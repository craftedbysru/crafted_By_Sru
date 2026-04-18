import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../route";
import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import prisma from "@/lib/prisma";
import { verifyRazorpaySignature } from "@/lib/payment-utils";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    order: {
      create: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb({
      product: {
        findUnique: vi.fn().mockResolvedValue({ stock: 100 }),
        update: vi.fn(),
      },
      order: {
        create: vi.fn().mockResolvedValue({ id: "order_abc" }),
      },
    })),
  },
}));

const mockRazorpay = {
  orders: {
    fetch: vi.fn(),
  },
};

vi.mock("@/lib/razorpay", () => ({
  getRazorpay: vi.fn(() => mockRazorpay),
}));

vi.mock("@/lib/payment-utils", () => ({
  verifyRazorpaySignature: vi.fn(),
}));

describe("POST /api/payment/verify", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 401 if user is not authenticated", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValue(null);

    const request = new Request("http://localhost/api/payment/verify", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
  });

  it("should return 400 if amount mismatch", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValue({ user: { id: "user_123" } });

    const razorpay = getRazorpay() as any;
    razorpay.orders.fetch.mockResolvedValue({ amount: 10000 }); // 100 INR

    const request = new Request("http://localhost/api/payment/verify", {
      method: "POST",
      body: JSON.stringify({
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_456",
        razorpay_signature: "sig_789",
        orderData: {
          total: 50, // 50 INR, mismatch
          items: [],
          shippingAddress: {},
        },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const text = await response.text();
    expect(text).toBe("Amount mismatch");
  });

  it("should return 200 and create order if payment is authentic", async () => {
    const { auth } = await import("@/auth");
    (auth as any).mockResolvedValue({ user: { id: "user_123" } });

    const razorpay = getRazorpay() as any;
    razorpay.orders.fetch.mockResolvedValue({ amount: 5000 }); // 50 INR
    (verifyRazorpaySignature as any).mockReturnValue(true);

    const request = new Request("http://localhost/api/payment/verify", {
      method: "POST",
      body: JSON.stringify({
        razorpay_order_id: "order_123",
        razorpay_payment_id: "pay_456",
        razorpay_signature: "sig_789",
        orderData: {
          total: 50,
          items: [{ id: "prod_1", quantity: 1, name: "Test" }],
          shippingAddress: {},
        },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.orderId).toBe("order_abc");
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
