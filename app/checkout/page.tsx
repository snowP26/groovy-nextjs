"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/cart";

const PAYMENT_METHODS = [
  {
    id: "gcash",
    label: "GCash",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    details: [
      "GCash Number: 09XX-XXX-XXXX",
      "Account Name: Groovy PH",
    ],
  },
  {
    id: "bank",
    label: "Bank Transfer",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="10" width="18" height="11" rx="1" />
        <path d="M3 10l9-7 9 7" />
        <path d="M8 10v11M12 10v11M16 10v11" />
      </svg>
    ),
    details: [
      "Bank: BDO",
      "Account Name: Groovy PH",
      "Account Number: XXXX-XXXX-XXXX",
    ],
  },
];

const PH_PROVINCES = [
  "Metro Manila", "Abra", "Agusan del Norte", "Agusan del Sur", "Aklan",
  "Albay", "Antique", "Apayao", "Aurora", "Basilan", "Bataan", "Batanes",
  "Batangas", "Benguet", "Biliran", "Bohol", "Bukidnon", "Bulacan",
  "Cagayan", "Camarines Norte", "Camarines Sur", "Camiguin", "Capiz",
  "Catanduanes", "Cavite", "Cebu", "Cotabato", "Davao de Oro",
  "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental",
  "Dinagat Islands", "Eastern Samar", "Guimaras", "Ifugao", "Ilocos Norte",
  "Ilocos Sur", "Iloilo", "Isabela", "Kalinga", "La Union", "Laguna",
  "Lanao del Norte", "Lanao del Sur", "Leyte", "Maguindanao del Norte",
  "Maguindanao del Sur", "Marinduque", "Masbate", "Misamis Occidental",
  "Misamis Oriental", "Mountain Province", "Negros Occidental",
  "Negros Oriental", "Northern Samar", "Nueva Ecija", "Nueva Vizcaya",
  "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Pampanga",
  "Pangasinan", "Quezon", "Quirino", "Rizal", "Romblon", "Samar",
  "Sarangani", "Siquijor", "Sorsogon", "South Cotabato", "Southern Leyte",
  "Sultan Kudarat", "Sulu", "Surigao del Norte", "Surigao del Sur",
  "Tarlac", "Tawi-Tawi", "Zambales", "Zamboanga del Norte",
  "Zamboanga del Sur", "Zamboanga Sibugay",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalQuantity, cartId, clearCart } = useCart();

  const [contact, setContact] = useState({ email: "", phone: "" });
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", address: "", address2: "",
    city: "", province: "", zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [summaryOpen, setSummaryOpen] = useState(false);

  const noDigits = (value: string) => !/\d/.test(value);
  const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validateField = (name: string, value: string) => {
    if (name === "email" && value && !validEmail(value))
      return "Enter a valid email address.";
    if (name === "firstName" && value && !noDigits(value))
      return "First name cannot contain numbers.";
    if (name === "lastName" && value && !noDigits(value))
      return "Last name cannot contain numbers.";
    return "";
  };

  const handleFieldBlur = (name: string, value: string) => {
    const msg = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const total = lines.reduce(
    (sum, l) => sum + parseFloat(l.price) * l.quantity, 0
  );

  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {
      email: validateField("email", contact.email),
      firstName: validateField("firstName", shipping.firstName),
      lastName: validateField("lastName", shipping.lastName),
    };
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    if (!paymentMethod) { setError("Please select a payment method."); return; }
    if (!referenceNumber.trim()) { setError("Please enter your reference number."); return; }
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          shipping,
          paymentMethod: selectedPayment?.label,
          referenceNumber,
          lines: lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
        }),
      });
      if (!res.ok) throw new Error("Failed to place order.");
      const { orderName } = await res.json();
      router.push(`/checkout/success?order=${orderName}`);
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (totalQuantity === 0) {
    return (
      <section className="checkout-empty">
        <p>Your cart is empty.</p>
        <Link href="/collection" className="btn">Browse Collection</Link>
      </section>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <Link href="/" className="checkout-logo" aria-label="Groovy — back to home">
          <span className="checkout-logo-text">Groovy.</span>
        </Link>
      </header>

      <form className="checkout-form" onSubmit={handleSubmit}>

        {/* Left column */}
        <div className="checkout-fields">


          {/* Contact */}
          <fieldset className="checkout-fieldset">
            <legend className="checkout-legend">Contact</legend>
            <div className="checkout-row">
              <div className="checkout-field">
                <input
                  id="email" type="email" required autoComplete="email"
                  className={`checkout-input${fieldErrors.email ? " checkout-input--error" : ""}`}
                  placeholder=" "
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  onBlur={(e) => handleFieldBlur("email", e.target.value)}
                />
                <label className="checkout-label" htmlFor="email">Email</label>
                {fieldErrors.email ? <span className="checkout-field-error">{fieldErrors.email}</span> : null}
              </div>
              <div className="checkout-field">
                <input
                  id="phone" type="tel" required autoComplete="tel"
                  className="checkout-input"
                  placeholder=" "
                  value={contact.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^\d+\-\s()]/g, "");
                    setContact({ ...contact, phone: val });
                  }}
                />
                <label className="checkout-label" htmlFor="phone">Phone</label>
              </div>
            </div>
          </fieldset>

          {/* Delivery */}
          <fieldset className="checkout-fieldset">
            <legend className="checkout-legend">Delivery</legend>
            <div className="checkout-row">
              <div className="checkout-field">
                <input
                  id="firstName" type="text" required autoComplete="given-name"
                  className={`checkout-input${fieldErrors.firstName ? " checkout-input--error" : ""}`}
                  placeholder=" "
                  value={shipping.firstName}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\d/g, "");
                    setShipping({ ...shipping, firstName: val });
                  }}
                  onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                />
                <label className="checkout-label" htmlFor="firstName">First Name</label>
                {fieldErrors.firstName ? <span className="checkout-field-error">{fieldErrors.firstName}</span> : null}
              </div>
              <div className="checkout-field">
                <input
                  id="lastName" type="text" required autoComplete="family-name"
                  className={`checkout-input${fieldErrors.lastName ? " checkout-input--error" : ""}`}
                  placeholder=" "
                  value={shipping.lastName}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\d/g, "");
                    setShipping({ ...shipping, lastName: val });
                  }}
                  onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                />
                <label className="checkout-label" htmlFor="lastName">Last Name</label>
                {fieldErrors.lastName ? <span className="checkout-field-error">{fieldErrors.lastName}</span> : null}
              </div>
            </div>
            <div className="checkout-field">
              <input
                id="address" type="text" required autoComplete="street-address"
                className="checkout-input"
                placeholder=" "
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
              />
              <label className="checkout-label" htmlFor="address">Address</label>
            </div>
            <div className="checkout-field">
              <input
                id="address2" type="text" autoComplete="address-line2"
                className="checkout-input"
                placeholder=" "
                value={shipping.address2}
                onChange={(e) => setShipping({ ...shipping, address2: e.target.value })}
              />
              <label className="checkout-label" htmlFor="address2">Apartment, suite, etc. (optional)</label>
            </div>
            <div className={`checkout-field checkout-field--select${shipping.province ? " checkout-field--selected" : ""}`}>
              <select
                id="province" required
                className="checkout-input checkout-select"
                value={shipping.province}
                onChange={(e) => setShipping({ ...shipping, province: e.target.value })}
              >
                <option value="" disabled hidden>Province</option>
                {PH_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <label className="checkout-label" htmlFor="province">Province</label>
            </div>
            <div className="checkout-row">
              <div className="checkout-field">
                <input
                  id="city" type="text" required autoComplete="address-level2"
                  className="checkout-input"
                  placeholder=" "
                  value={shipping.city}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\d/g, "");
                    setShipping({ ...shipping, city: val });
                  }}
                />
                <label className="checkout-label" htmlFor="city">City / Municipality</label>
              </div>
              <div className="checkout-field">
                <input
                  id="zip" type="text" required autoComplete="postal-code"
                  className="checkout-input"
                  placeholder=" "
                  value={shipping.zip}
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                />
                <label className="checkout-label" htmlFor="zip">ZIP Code</label>
              </div>
            </div>
          </fieldset>

          {/* Payment */}
          <fieldset className="checkout-fieldset">
            <legend className="checkout-legend">Payment</legend>
            <div className="checkout-payment-methods">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  className={`checkout-payment-btn${paymentMethod === method.id ? " is-active" : ""}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <span className="checkout-payment-btn-icon">{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>

            {selectedPayment ? (
              <div className="checkout-payment-details">
                <p className="checkout-payment-instruction">
                  Send payment to the following, then enter your reference number below.
                </p>
                <ul className="checkout-payment-info">
                  {selectedPayment.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="checkout-field">
                  <input
                    id="refNum" type="text" required
                    className="checkout-input"
                    placeholder=" "
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                  />
                  <label className="checkout-label" htmlFor="refNum">
                    Reference / Transaction Number <span aria-hidden="true" className="checkout-required-star">*</span>
                  </label>
                </div>
              </div>
            ) : null}
          </fieldset>

          {error ? <p className="checkout-error" role="alert">{error}</p> : null}

          <div className="checkout-submit-group">
            <button
              type="submit"
              className="checkout-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing Order…" : "Complete Order"}
            </button>
            <p className="checkout-trust-line">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure order · Payment verified manually by our team
            </p>
          </div>
        </div>

        {/* Right column — order summary */}
        <aside className="checkout-summary">
          <button
            type="button"
            className={`checkout-summary-toggle${summaryOpen ? " is-open" : ""}`}
            onClick={() => setSummaryOpen((o) => !o)}
            aria-expanded={summaryOpen}
          >
            <span className="checkout-summary-toggle-label">
              Order Summary
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`checkout-summary-chevron${summaryOpen ? " is-open" : ""}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
            <span className="checkout-summary-toggle-total"><span className="currency-label">PHP</span> {total.toLocaleString()}</span>
          </button>

          <div className={`checkout-summary-body${summaryOpen ? " is-open" : ""}`}>
            <div className="checkout-summary-body-inner">
              <ul className="checkout-summary-lines">
                {lines.map((line) => (
                  <li key={line.id} className="checkout-summary-line">
                    {line.imageUrl ? (
                      <div className="checkout-summary-image-wrap">
                        <div className="checkout-summary-image">
                          <Image
                            src={line.imageUrl}
                            alt={line.imageAlt ?? line.productTitle}
                            width={80}
                            height={80}
                            quality={70}
                          />
                        </div>
                        <span className="checkout-summary-qty">{line.quantity}</span>
                      </div>
                    ) : null}
                    <div className="checkout-summary-info">
                      <p className="checkout-summary-product">{line.productTitle}</p>
                      <p className="checkout-summary-variant">{line.variantTitle}</p>
                    </div>
                    <p className="checkout-summary-price">
                      <span className="currency-label">PHP</span> {(parseFloat(line.price) * line.quantity).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="checkout-summary-total">
                <span>Total</span>
                <span><span className="currency-label">PHP</span> {total.toLocaleString()}</span>
              </div>
              <p className="checkout-summary-note">
                Payment is verified manually. We'll confirm your order within 24 hours.
              </p>
            </div>
          </div>
        </aside>

      </form>
    </div>
  );
}
