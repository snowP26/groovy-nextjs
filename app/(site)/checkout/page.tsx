"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/cart";

const SHIPPING_FEE = 155;

const PAYMENT_METHODS = [
  {
    id: "gcash",
    label: "GCash",
    qr: "/assets/payment/gcash_qr.jpg",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    details: [
      { label: "GCash Number", value: "09611840412", copyable: true },
      { label: "Account Name", value: "Groovy PH", copyable: false },
    ],
  },
  {
    id: "bank",
    label: "Bank Transfer",
    qr: "/assets/payment/bdo_qr.jpg",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="10" width="18" height="11" rx="1" />
        <path d="M3 10l9-7 9 7" />
        <path d="M8 10v11M12 10v11M16 10v11" />
      </svg>
    ),
    details: [
      { label: "Bank", value: "BDO Unibank", copyable: false },
      { label: "Account Name", value: "Groovy PH", copyable: false },
      { label: "Account Number", value: "0084 4009 4790", copyable: true },
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

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button type="button" className="copy-btn" onClick={() => navigator.clipboard.writeText(value).then(() => setCopied(true))} aria-label={`Copy ${value}`}>
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label="Copied">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Copy">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, totalQuantity, clearCart } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
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
  const [qrOpen, setQrOpen] = useState(false);

  const noDigits = (value: string) => !/\d/.test(value);
  const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validPhone = (value: string) => {
    const digits = value.replace(/[\s\-()+]/g, "");
    return /^(63|0)?9\d{9}$/.test(digits);
  };

  const validateField = (name: string, value: string) => {
    if (name === "email" && value && !validEmail(value))
      return "Enter a valid email address.";
    if (name === "phone" && value && !validPhone(value))
      return "Enter a valid PH number (e.g. 09XX-XXX-XXXX).";
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

  const isStep1Complete =
    validEmail(contact.email) &&
    validPhone(contact.phone) &&
    noDigits(shipping.firstName) && shipping.firstName.trim() !== "" &&
    noDigits(shipping.lastName) && shipping.lastName.trim() !== "" &&
    shipping.address.trim() !== "" &&
    shipping.province !== "" &&
    shipping.city.trim() !== "" &&
    shipping.zip.trim() !== "";

  const handleContinue = () => {
    const errors: Record<string, string> = {};
    if (!contact.email) errors.email = "Email is required.";
    else if (!validEmail(contact.email)) errors.email = "Enter a valid email address.";
    if (!contact.phone) errors.phone = "Phone number is required.";
    else if (!validPhone(contact.phone)) errors.phone = "Enter a valid PH number (e.g. 09XX-XXX-XXXX).";
    if (!shipping.firstName) errors.firstName = "First name is required.";
    else if (!noDigits(shipping.firstName)) errors.firstName = "First name cannot contain numbers.";
    if (!shipping.lastName) errors.lastName = "Last name is required.";
    else if (!noDigits(shipping.lastName)) errors.lastName = "Last name cannot contain numbers.";
    setFieldErrors(errors);
    if (Object.values(errors).some(Boolean)) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subtotal = lines.reduce((sum, l) => sum + parseFloat(l.price) * l.quantity, 0);
  const grandTotal = subtotal + SHIPPING_FEE;
  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          shippingFee: SHIPPING_FEE,
          grandTotal,
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
        <button type="button" className="checkout-back-btn" onClick={() => router.back()} aria-label="Go back">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <Link href="/" className="checkout-logo" aria-label="Groovy — back to home">
          <span className="checkout-logo-text">Groovy.</span>
        </Link>
      </header>

      <form className="checkout-form" onSubmit={handleSubmit}>

        {/* Left column */}
        <div className="checkout-fields">

          {/* Step progress indicator */}
          <div className="checkout-progress" aria-label="Checkout progress">
            <div className={`checkout-progress-step${step > 1 ? " is-done" : " is-active"}`}>
              <span className="checkout-progress-dot">{step > 1 ? "✓" : "1"}</span>
              <span className="checkout-progress-label">Customer Details</span>
            </div>
            <div className={`checkout-progress-connector${step > 1 ? " is-done" : ""}`} aria-hidden="true" />
            <div className={`checkout-progress-step${step === 2 ? " is-active" : ""}`}>
              <span className="checkout-progress-dot">2</span>
              <span className="checkout-progress-label">Payment</span>
            </div>
          </div>

          <div key={step} className="checkout-step-content">
          {step === 1 ? (
            <>
              {/* Contact */}
              <fieldset className="checkout-fieldset">
                <legend className="checkout-legend">
                  <span className="checkout-legend-step">1</span>
                  Contact
                </legend>
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
                      className={`checkout-input${fieldErrors.phone ? " checkout-input--error" : ""}`}
                      placeholder=" "
                      value={contact.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d+\-\s()]/g, "");
                        setContact({ ...contact, phone: val });
                      }}
                      onBlur={(e) => handleFieldBlur("phone", e.target.value)}
                    />
                    <label className="checkout-label" htmlFor="phone">Phone</label>
                    {fieldErrors.phone ? <span className="checkout-field-error">{fieldErrors.phone}</span> : null}
                  </div>
                </div>
              </fieldset>

              {/* Delivery */}
              <fieldset className="checkout-fieldset">
                <legend className="checkout-legend">
                  <span className="checkout-legend-step">2</span>
                  Delivery
                </legend>
                <div className="checkout-row">
                  <div className="checkout-field">
                    <input
                      id="firstName" type="text" required autoComplete="given-name"
                      className={`checkout-input${fieldErrors.firstName ? " checkout-input--error" : ""}`}
                      placeholder=" "
                      value={shipping.firstName}
                      onChange={(e) => setShipping({ ...shipping, firstName: e.target.value.replace(/\d/g, "") })}
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
                      onChange={(e) => setShipping({ ...shipping, lastName: e.target.value.replace(/\d/g, "") })}
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
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value.replace(/\d/g, "") })}
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

              <div className="checkout-submit-group">
                <button type="button" className="checkout-submit-btn" onClick={handleContinue} disabled={!isStep1Complete}>
                  Continue to Payment
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Customer details summary */}
              <div className="checkout-step-summary">
                <div className="checkout-step-summary-info">
                  <span className="checkout-step-summary-label">Contact</span>
                  <span className="checkout-step-summary-value">{contact.email} · {contact.phone}</span>
                </div>
                <div className="checkout-step-summary-info">
                  <span className="checkout-step-summary-label">Ship to</span>
                  <span className="checkout-step-summary-value">
                    {shipping.address}{shipping.address2 ? `, ${shipping.address2}` : ""}, {shipping.city}, {shipping.province} {shipping.zip}
                  </span>
                </div>
                <button type="button" className="checkout-step-edit-btn" onClick={() => setStep(1)}>
                  Edit
                </button>
              </div>

              {/* Payment */}
              <fieldset className="checkout-fieldset">
                <legend className="checkout-legend">
                  <span className="checkout-legend-step">3</span>
                  Payment
                </legend>
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
                        <li key={d.label} className="checkout-payment-info-row">
                          <div className="checkout-payment-info-cell">
                            <span className="checkout-payment-info-label">{d.label}</span>
                            <span className="checkout-payment-info-value">{d.value}</span>
                          </div>
                          {d.copyable ? <CopyButton value={d.value} /> : null}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="checkout-qr-btn"
                      onClick={() => setQrOpen(true)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                        <path d="M14 14h.01M14 17h.01M17 14h.01M17 17h3M20 14v.01" />
                      </svg>
                      Show QR Code
                    </button>

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
                <button type="submit" className="checkout-submit-btn" disabled={isSubmitting || !paymentMethod || !referenceNumber.trim()}>
                  {isSubmitting ? "Placing Order…" : "Complete Order"}
                </button>
                <p className="checkout-trust-line">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Secure order · Payment verified manually by our team
                </p>
              </div>
            </>
          )}
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`checkout-summary-chevron${summaryOpen ? " is-open" : ""}`} aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
            <span className="checkout-summary-toggle-total">
              <span className="currency-label">PHP</span> {grandTotal.toLocaleString("en-PH")}
            </span>
          </button>

          <div className={`checkout-summary-body${summaryOpen ? " is-open" : ""}`}>
            <div className="checkout-summary-body-inner">
              <ul className="checkout-summary-lines">
                {lines.map((line) => (
                  <li key={line.id} className="checkout-summary-line">
                    {line.imageUrl ? (
                      <div className="checkout-summary-image-wrap">
                        <div className="checkout-summary-image">
                          <Image src={line.imageUrl} alt={line.imageAlt ?? line.productTitle} width={80} height={96} quality={70} />
                        </div>
                        <span className="checkout-summary-qty">{line.quantity}</span>
                      </div>
                    ) : null}
                    <div className="checkout-summary-info">
                      <p className="checkout-summary-product">{line.productTitle}</p>
                      <p className="checkout-summary-variant">{line.variantTitle}</p>
                    </div>
                    <p className="checkout-summary-price">
                      <span className="currency-label">PHP</span> {(parseFloat(line.price) * line.quantity).toLocaleString("en-PH")}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="checkout-summary-breakdown">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <span><span className="currency-label">PHP</span> {subtotal.toLocaleString("en-PH")}</span>
                </div>
                <div className="checkout-summary-row">
                  <span>Shipping</span>
                  <span><span className="currency-label">PHP</span> {SHIPPING_FEE.toLocaleString("en-PH")}</span>
                </div>
              </div>

              <div className="checkout-summary-total">
                <span>Total</span>
                <span><span className="currency-label">PHP</span> {grandTotal.toLocaleString("en-PH")}</span>
              </div>

              <p className="checkout-summary-note">
                Payment is verified manually. We&apos;ll confirm your order within 24 hours.
              </p>
            </div>
          </div>
        </aside>
      </form>

      {/* QR modal */}
      {qrOpen && selectedPayment ? (
        <div className="qr-modal-overlay" onClick={() => setQrOpen(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="qr-modal-close" onClick={() => setQrOpen(false)} aria-label="Close QR code">✕</button>
            <p className="qr-modal-label">{selectedPayment.label}</p>
            <Image
              src={selectedPayment.qr}
              alt={`${selectedPayment.label} QR code`}
              width={400}
              height={400}
              quality={90}
              className="qr-modal-image"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
