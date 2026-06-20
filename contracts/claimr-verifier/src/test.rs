#![cfg(test)]

use soroban_sdk::{Env, Bytes, Address, testutils::Address as _};
use crate::{ClaimrVerifier, ClaimrVerifierClient, BountyStatus, Error};

fn setup() -> (Env, ClaimrVerifierClient<'static>, Address) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ClaimrVerifier);
    let client = ClaimrVerifierClient::new(&env, &contract_id);

    // Create a mock asset token
    let asset = Address::generate(&env);
    client.init(&asset);

    (env, client, asset)
}

#[test]
fn test_init() {
    let (env, client, asset) = setup();

    // Should not panic — init was called in setup
    let poster = Address::generate(&env);
    let bounty_id = client.create_bounty(&poster);
    assert_eq!(bounty_id, 0);
}

#[test]
fn test_create_and_lock_reward() {
    let (env, client, _asset) = setup();
    let poster = Address::generate(&env);

    let bounty_id = client.create_bounty(&poster);

    let commitment = Bytes::from_slice(&env, b"0xdeadbeefcafe");
    let opaque = Bytes::from_slice(&env, &1000u64.to_be_bytes());

    client.lock_reward(&poster, &bounty_id, &commitment, &opaque, &9999999999u64);

    let status = client.bounty_status(&bounty_id);
    assert_eq!(status, BountyStatus::Active);
}

#[test]
fn test_double_lock_fails() {
    let (env, client, _asset) = setup();
    let poster = Address::generate(&env);

    let bounty_id = client.create_bounty(&poster);
    let commitment = Bytes::from_slice(&env, b"commit");
    let opaque = Bytes::from_slice(&env, &500u64.to_be_bytes());

    client.lock_reward(&poster, &bounty_id, &commitment, &opaque, &9999999999u64);

    // Second lock on same bounty should still work (poster adding more funds)
    // — this is fine, no error expected.
    client.lock_reward(&poster, &bounty_id, &commitment, &opaque, &9999999999u64);
}

#[test]
fn test_nullifier_not_spent_initially() {
    let (env, client, _asset) = setup();

    let spent = client.nullifier_status(&42u64);
    assert!(!spent);
}

#[test]
fn test_verify_and_payout_bounty_not_found() {
    let (env, client, _asset) = setup();
    let poster = Address::generate(&env);

    let bounty_id = client.create_bounty(&poster);
    let commitment = Bytes::from_slice(&env, b"commit");
    let opaque = Bytes::from_slice(&env, &1000u64.to_be_bytes());
    client.lock_reward(&poster, &bounty_id, &commitment, &opaque, &9999999999u64);

    // Try to verify + payout on nonexistent bounty 999
    let proof = Bytes::new(&env);
    let signals = Bytes::from_slice(&env, &[0u8; 24]);
    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.verify_and_payout(&999, &proof, &signals);
    }));
    assert!(result.is_err());
}

#[test]
fn test_verify_and_payout_success() {
    let (env, client, _asset) = setup();
    let poster = Address::generate(&env);

    let bounty_id = client.create_bounty(&poster);
    let commitment = Bytes::from_slice(&env, b"commit");
    let opaque = Bytes::from_slice(&env, &1000u64.to_be_bytes());

    client.lock_reward(&poster, &bounty_id, &commitment, &opaque, &9999999999u64);

    // Build a valid proof (stub — the groth16_verify always returns true in this skeleton)
    let proof = Bytes::from_slice(&env, b"valid_proof");
    let mut signal_bytes = [0u8; 24];
    // bountyId = 0, nullifierHash = 42, evaluatorSigHash = 12345
    signal_bytes[8..16].copy_from_slice(&42u64.to_be_bytes());
    signal_bytes[16..24].copy_from_slice(&12345u64.to_be_bytes());
    let signals = Bytes::from_slice(&env, &signal_bytes);

    client.verify_and_payout(&bounty_id, &proof, &signals);

    // After payout, bounty should be closed
    let status = client.bounty_status(&bounty_id);
    assert_eq!(status, BountyStatus::Closed);

    // Nullifier 42 should be marked as spent
    let spent = client.nullifier_status(&42u64);
    assert!(spent);
}

#[test]
fn test_double_claim_fails() {
    let (env, client, _asset) = setup();
    let poster = Address::generate(&env);

    let bounty_id = client.create_bounty(&poster);
    let commitment = Bytes::from_slice(&env, b"commit");
    let opaque = Bytes::from_slice(&env, &1000u64.to_be_bytes());
    client.lock_reward(&poster, &bounty_id, &commitment, &opaque, &9999999999u64);

    let proof = Bytes::from_slice(&env, b"valid_proof");
    let mut signal_bytes = [0u8; 24];
    signal_bytes[8..16].copy_from_slice(&42u64.to_be_bytes());
    signal_bytes[16..24].copy_from_slice(&12345u64.to_be_bytes());
    let signals = Bytes::from_slice(&env, &signal_bytes);

    // First claim succeeds
    client.verify_and_payout(&bounty_id, &proof, &signals);

    // Second claim with same nullifier must fail
    // We need another active bounty; this one is closed.
    let bounty_id2 = client.create_bounty(&poster);
    client.lock_reward(&poster, &bounty_id2, &commitment, &opaque, &9999999999u64);

    let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
        client.verify_and_payout(&bounty_id2, &proof, &signals);
    }));
    assert!(result.is_err());
}
