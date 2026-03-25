import { describe, expect, it } from "vitest"

import { hashPassword, verifyPassword, isLegacyHash, secureCompare } from "../../src/lib/server/security"

describe("security helpers", () => {
  it("hashes passwords securely with bcrypt", async () => {
    const password = "test-password-123"
    const hash = await hashPassword(password)
    
    // Bcrypt hashes start with $2 and are ~60 characters
    expect(hash).toMatch(/^\$2[aby]\$\d+\$/)
    expect(hash.length).toBeGreaterThan(50)
    
    // Different salts should produce different hashes
    const hash2 = await hashPassword(password)
    expect(hash).not.toBe(hash2)
  })

  it("verifies passwords correctly", async () => {
    const password = "secure-password-456"
    const hash = await hashPassword(password)
    
    const isValid = await verifyPassword(password, hash)
    const isInvalid = await verifyPassword("wrong-password", hash)
    
    expect(isValid).toBe(true)
    expect(isInvalid).toBe(false)
  })

  it("detects legacy hashes", () => {
    const bcryptHash = "$2a$12$abcdefghijklmnopqrstuvwxyz"
    const legacyHash = "abc123def456"
    
    expect(isLegacyHash(bcryptHash)).toBe(false)
    expect(isLegacyHash(legacyHash)).toBe(true)
  })

  it("performs secure string comparison", () => {
    const a = "secret-token-123"
    const b = "secret-token-123"
    const c = "different-token"
    
    expect(secureCompare(a, b)).toBe(true)
    expect(secureCompare(a, c)).toBe(false)
    expect(secureCompare(a, a.slice(0, -1))).toBe(false) // Different length
  })

  it("rejects legacy hashes in password verification", async () => {
    const legacyHash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8" // SHA-256
    const password = "password"
    
    const result = await verifyPassword(password, legacyHash)
    expect(result).toBe(false)
  })
})
