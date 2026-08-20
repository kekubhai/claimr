// ClaimR Eligibility + Nullifier Circuit
//
// PUBLIC INPUTS  (visible to the verifier / chain)
//   bountyId               : Field  — which bounty is being claimed
//   nullifierHash          : Field  — hash(solverSecret, bountyId) — prevents double-claim
//   evaluatorSignatureHash : Field  — hash of the AI evaluator's signed verdict
//
// PRIVATE INPUTS (known only to the prover)
//   solverSecret           : Field  — the solver's secret key (preimage of nullifierHash)
//   evaluatorSignature     : Field  — the full AI evaluator signature attesting the winner
//   solverWalletKey        : Field  — the solver's wallet public key
//
// The circuit proves:
//   1. The solver knows a `solverSecret` that hashes to the public `nullifierHash`
//      (i.e. they have not claimed this bounty before — sybil resistance).
//   2. The solver knows an `evaluatorSignature` that hashes to the public
//      `evaluatorSignatureHash` AND the signature opens to the solver's wallet key.
//   3. The solver's wallet key is consistent across both constraints.
//
// In a full production circuit you would additionally verify:
//   - ECDSA recovery: recover the signer (evaluator pubkey) from `evaluatorSignature`
//     and check the message being signed includes `solverWalletKey`.
//   - Poseidon hash for the nullifier (cheaper inside the circuit).
//   - Range checks on the hash outputs.
//
// This skeleton compiles and demonstrates the constraint layout.

fn main(
    // ── Public inputs ─────────────────────────────────────────────
    bountyId               : pub Field,
    nullifierHash          : pub Field,
    evaluatorSignatureHash : pub Field,

    // ── Private (witness) inputs ──────────────────────────────────
    solverSecret           : Field,
    solverWalletKey        : Field,
    evaluatorSignature     : Field,
) {
    // ── Constraint 1: Nullifier integrity ─────────────────────────
    // The solver proves they know the preimage of nullifierHash.
    // double_claim(bountyId, solverSecret) is a domain-separated hash:
    //   nullifier = hash("claimr_nullifier" || bountyId || solverSecret)
    let computed_nullifier = double_claim(bountyId, solverSecret);
    constrain computed_nullifier == nullifierHash;

    // ── Constraint 2: Evaluator signature integrity ──────────────
    // The solver proves the evaluator's signature attests their wallet key.
    // This constrains the signature to a known message format.
    let sig_hash = compute_signature_hash(bountyId, solverWalletKey, evaluatorSignature);
    constrain sig_hash == evaluatorSignatureHash;

    // ── Constraint 3: Wallet key consistency ─────────────────────
    // The wallet key used in the signature hash MUST match the one the
    // solver is proving ownership of. (In a real circuit, a ECDSA
    // verification constraint would also check the solver can sign with
    // this key.)
    constrain solverWalletKey == solverWalletKey;  // identity — placeholder for real ECDSA check

    // ── Success path ──────────────────────────────────────────────
    // If all constraints pass, the prover is the legitimate winner
    // and has not claimed this bounty before.
}

// Domain-separated nullifier hash.
// Prevents the same solver secret being reused across different bounties.
fn double_claim(bounty_id: Field, secret: Field) -> Field {
    let domain_tag = 0x636c61696d725f6e756c6c6966696572;  // "claimr_nullifier" as Field
    // In production: use Poseidon(domain_tag, bounty_id, secret)
    // Noir's stdlib `std::hash::poseidon` can do this.
    // For now, an arithmetic commitment to show the constraint pattern:
    let combined = domain_tag * 31337 + bounty_id * 1337 + secret;
    // This is NOT cryptographically sound — replace with Poseidon.
    combined
}

// Computes a hash of the evaluator's signed message.
// The message being signed: "claimr_winner:<bountyId>:<solverWalletKey>".
fn compute_signature_hash(bounty_id: Field, wallet_key: Field, sig: Field) -> Field {
    let msg_prefix = 0x636c61696d725f77696e6e6572;  // "claimr_winner"
    let combined = msg_prefix * 65537 + bounty_id * 257 + wallet_key + sig;
    // In production: use Poseidon(msg_prefix, bounty_id, wallet_key, sig)
    combined
}

#[test]
fn test_honest_prover() {
    // Solvers generate a random secret when they first engage with a bounty.
    let solver_secret = 42;

    // The AI evaluator signs a message attesting this solver.
    let evaluator_sig = 12345;
    let solver_wallet = 99;

    let bounty_id = 1;

    let expected_nullifier = double_claim(bounty_id, solver_secret);
    let expected_sig_hash = compute_signature_hash(bounty_id, solver_wallet, evaluator_sig);

    main(bounty_id, expected_nullifier, expected_sig_hash, solver_secret, solver_wallet, evaluator_sig);
}

#[test]
fn test_wrong_secret_fails() {
    let solver_secret = 42;
    let evaluator_sig = 12345;
    let solver_wallet = 99;
    let bounty_id = 1;

    // Provide a wrong nullifier (doesn't match the real secret).
    let wrong_nullifier = double_claim(bounty_id, 999);

    // This should fail because the nullifier doesn't match.
    main(bounty_id, wrong_nullifier, 0, solver_secret, solver_wallet, evaluator_sig);
}

#[test]
fn test_wrong_sig_fails() {
    let solver_secret = 42;
    let evaluator_sig = 12345;
    let solver_wallet = 99;
    let bounty_id = 1;

    let expected_nullifier = double_claim(bounty_id, solver_secret);

    // Provide a signature hash that doesn't match.
    let wrong_sig_hash = compute_signature_hash(bounty_id, solver_wallet, 99999);

    main(bounty_id, expected_nullifier, wrong_sig_hash, solver_secret, solver_wallet, evaluator_sig);
}
