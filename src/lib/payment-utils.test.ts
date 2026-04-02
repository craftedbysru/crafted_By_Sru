import { describe, it, expect } from "vitest";
import { verifyRazorpaySignature } from "./payment-utils";
import crypto from "crypto";

describe("verifyRazorpaySignature", () => {
  const secret = "test_secret";
  const orderId = "order_123";
  const paymentId = "pay_456";

  it("should return true for a valid signature", () => {
    const body = orderId + "|" + paymentId;
    const signature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const result = verifyRazorpaySignature(orderId, paymentId, signature, secret);
    expect(result).toBe(true);
  });

  it("should return false for an invalid signature", () => {
    const result = verifyRazorpaySignature(orderId, paymentId, "invalid_signature", secret);
    expect(result).toBe(false);
  });

  it("should return false if the secret is different", () => {
    const body = orderId + "|" + paymentId;
    const signature = crypto
      .createHmac("sha256", "wrong_secret")
      .update(body)
      .digest("hex");

    const result = verifyRazorpaySignature(orderId, paymentId, signature, secret);
    expect(result).toBe(false);
  });
});
