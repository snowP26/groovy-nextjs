"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderName = searchParams.get("order");

  return (
    <>
      <header className="checkout-header">
        <Link href="/" className="checkout-logo" aria-label="Groovy — back to home">
          <span className="checkout-logo-text">Groovy.</span>
        </Link>
      </header>

      <section className="checkout-success">
      <div className="checkout-success-icon">✓</div>
      <h1 className="checkout-success-title">Order Placed!</h1>
      {orderName ? (
        <p className="checkout-success-order">Order {orderName}</p>
      ) : null}
      <p className="checkout-success-message">
        Thank you for your order. We'll verify your payment within 24 hours
        and send a confirmation to your email once it's been processed.
      </p>
      <div className="checkout-success-steps">
        <div className="checkout-success-step">
          <span className="checkout-success-step-num">1</span>
          <span>Order received</span>
        </div>
        <span className="checkout-success-step-divider" aria-hidden="true" />
        <div className="checkout-success-step">
          <span className="checkout-success-step-num checkout-success-step-num--pending">2</span>
          <span>Payment verified</span>
        </div>
        <span className="checkout-success-step-divider" aria-hidden="true" />
        <div className="checkout-success-step">
          <span className="checkout-success-step-num checkout-success-step-num--pending">3</span>
          <span>Order shipped</span>
        </div>
      </div>
      <Link href="/collection" className="btn">Continue Shopping</Link>
      </section>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
