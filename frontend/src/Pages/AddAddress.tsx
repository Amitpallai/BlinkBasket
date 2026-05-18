import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner";
import axios from "axios";

interface Address {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
}

type AddressKey = keyof Address;

const EMPTY_ADDRESS: Address = {
  firstName: "", lastName: "", email: "",
  street: "", city: "", state: "",
  zipcode: "", country: "", phone: "",
};

const EMPTY_ERRORS: Record<AddressKey, string> = { ...EMPTY_ADDRESS };

/* ─── Field config ─── */
const FIELDS: {
  name: AddressKey;
  placeholder: string;
  type: string;
  col?: "full";
}[][] = [
  [
    { name: "firstName",  placeholder: "First name",       type: "text" },
    { name: "lastName",   placeholder: "Last name",        type: "text" },
  ],
  [
    { name: "email",      placeholder: "Email address",    type: "email",  col: "full" },
  ],
  [
    { name: "phone",      placeholder: "Phone number",     type: "tel",    col: "full" },
  ],
  [
    { name: "street",     placeholder: "Street address",   type: "text",   col: "full" },
  ],
  [
    { name: "city",       placeholder: "City",             type: "text" },
    { name: "state",      placeholder: "State / Province", type: "text" },
  ],
  [
    { name: "zipcode",    placeholder: "ZIP / Postal code", type: "text" },
    { name: "country",    placeholder: "Country",           type: "text" },
  ],
];

/* ─── Single input ─── */
const Field: React.FC<{
  field: (typeof FIELDS)[0][0];
  value: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ field, value, error, onChange }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <div style={{ position: "relative" }}>
      <input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        value={value}
        onChange={onChange}
        required
        style={{
          ...s.input,
          ...(error ? s.inputError : {}),
          ...(value ? s.inputFilled : {}),
        }}
      />
    </div>
    {error && <span style={s.errorMsg}>{error}</span>}
  </div>
);

const AddAddress: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
  const [errors,  setErrors]  = useState<Record<AddressKey, string>>(EMPTY_ERRORS);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name as AddressKey])
      setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const next = { ...EMPTY_ERRORS };
    let ok = true;

    if (!address.firstName.trim()) { next.firstName = "First name is required"; ok = false; }
    if (!address.lastName.trim())  { next.lastName  = "Last name is required";  ok = false; }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email);
    if (!address.email.trim())     { next.email = "Email is required";          ok = false; }
    else if (!emailOk)             { next.email = "Enter a valid email";        ok = false; }

    const phoneOk = /^\d{10}$/.test(address.phone);
    if (!address.phone.trim())     { next.phone = "Phone is required";          ok = false; }
    else if (!phoneOk)             { next.phone = "Enter a valid 10-digit number"; ok = false; }

    (["street","city","state","zipcode","country"] as AddressKey[]).forEach((f) => {
      if (!address[f].trim()) {
        next[f] = `${f.charAt(0).toUpperCase() + f.slice(1)} is required`;
        ok = false;
      }
    });

    setErrors(next);
    return ok;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message || "Address saved!");
        navigate("/cart");
      } else {
        toast.error(data.message || "Failed to save address");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* ── Header ── */}
      <div style={s.header}>
        <span style={s.headerIcon}>📦</span>
        <h1 style={s.heading}>Delivery address</h1>
        <p style={s.subheading}>Where should we deliver your fresh groceries?</p>
      </div>

      {/* ── Card ── */}
      <div style={s.card}>

        {/* Progress hint */}
        <div style={s.steps}>
          {["Cart", "Address", "Payment"].map((step, i) => (
            <React.Fragment key={step}>
              <div style={s.stepWrap}>
                <div style={{ ...s.stepDot, ...(i === 1 ? s.stepDotActive : i < 1 ? s.stepDotDone : {}) }}>
                  {i < 1 ? "✓" : i + 1}
                </div>
                <span style={{ ...s.stepLabel, ...(i === 1 ? s.stepLabelActive : {}) }}>{step}</span>
              </div>
              {i < 2 && <div style={{ ...s.stepLine, ...(i < 1 ? s.stepLineDone : {}) }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={s.divider} />

        {/* ── Form ── */}
        <form onSubmit={onSubmit} style={s.form} noValidate>
          {FIELDS.map((row, ri) => (
            <div
              key={ri}
              style={{
                display: "grid",
                gridTemplateColumns: row[0].col === "full" ? "1fr" : "1fr 1fr",
                gap: 12,
              }}
            >
              {row.map((field) => (
                <Field
                  key={field.name}
                  field={field}
                  value={address[field.name]}
                  error={errors[field.name]}
                  onChange={handleChange}
                />
              ))}
            </div>
          ))}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ ...s.submitBtn, ...(loading ? s.submitBtnLoading : {}) }}
            className="submit-btn"
          >
            {loading ? (
              <span style={s.spinnerRow}>
                <span style={s.spinner} className="spinner" />
                Saving address…
              </span>
            ) : (
              "Save & continue to payment →"
            )}
          </button>
        </form>
      </div>

      {/* Trust strip */}
      <div style={s.trustStrip}>
        {[
          { icon: "🔒", text: "Secure & encrypted" },
          { icon: "🚚", text: "Same-day delivery" },
          { icon: "♻️",  text: "Eco packaging" },
        ].map(({ icon, text }) => (
          <div key={text} style={s.trustItem}>
            <span style={s.trustIcon}>{icon}</span>
            <span style={s.trustText}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Tokens ─── */
const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY    = "'DM Sans', 'Helvetica Neue', sans-serif";
const GREEN        = "#2E7D4F";
const GREEN_DARK   = "#1B5E36";
const GREEN_LIGHT  = "#E8F5EE";
const SURFACE      = "#FAFAF7";
const BORDER       = "#EDEEE8";

/* ─── Styles ─── */
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: SURFACE,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "3rem 1.5rem 5rem",
    fontFamily: FONT_BODY,
  },

  /* Header */
  header: {
    textAlign: "center",
    marginBottom: "2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  headerIcon: { fontSize: 36 },
  heading: {
    fontFamily: FONT_DISPLAY,
    fontSize: 32,
    fontWeight: 600,
    color: "#1A2B1A",
    letterSpacing: "-0.02em",
    margin: 0,
  },
  subheading: {
    fontSize: 14,
    color: "#888",
    margin: 0,
  },

  /* Card */
  card: {
    width: "100%",
    maxWidth: 580,
    background: "#fff",
    borderRadius: 20,
    border: `1px solid ${BORDER}`,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    padding: "2rem",
  },

  /* Progress steps */
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    marginBottom: "1.5rem",
  },
  stepWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: BORDER,
    color: "#aaa",
    fontSize: 12,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: FONT_BODY,
  },
  stepDotActive: {
    background: GREEN,
    color: "#fff",
  },
  stepDotDone: {
    background: GREEN_LIGHT,
    color: GREEN,
  },
  stepLabel: {
    fontSize: 11,
    color: "#aaa",
    fontWeight: 500,
    fontFamily: FONT_BODY,
  },
  stepLabelActive: { color: GREEN },
  stepLine: {
    flex: 1,
    height: 1.5,
    background: BORDER,
    minWidth: 48,
    marginBottom: 18,
  },
  stepLineDone: { background: GREEN_LIGHT },

  divider: { height: 1, background: BORDER, marginBottom: "1.5rem" },

  /* Form */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    width: "100%",
    height: 46,
    padding: "0 14px",
    borderRadius: 10,
    border: `1.5px solid ${BORDER}`,
    background: SURFACE,
    fontSize: 14,
    fontFamily: FONT_BODY,
    color: "#1A2B1A",
    outline: "none",
    transition: "border-color 0.15s, background 0.15s",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#E57373",
    background: "#FFF8F8",
  },
  inputFilled: {
    background: "#fff",
    borderColor: "#C8E6D4",
  },
  errorMsg: {
    fontSize: 11,
    color: "#C62828",
    fontFamily: FONT_BODY,
    paddingLeft: 2,
  },

  /* Submit */
  submitBtn: {
    marginTop: 8,
    width: "100%",
    height: 50,
    borderRadius: 12,
    background: GREEN,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: FONT_BODY,
    border: "none",
    cursor: "pointer",
    letterSpacing: "0.01em",
    transition: "background 0.2s, transform 0.1s",
  },
  submitBtnLoading: {
    background: "#888",
    cursor: "not-allowed",
  },
  spinnerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2.5px solid rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
    display: "inline-block",
  },

  /* Trust strip */
  trustStrip: {
    display: "flex",
    gap: "2rem",
    marginTop: "1.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  trustIcon: { fontSize: 16 },
  trustText: { fontSize: 12, color: "#999", fontFamily: FONT_BODY },
};

/* ─── Global CSS ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=DM+Sans:wght@400;500;600&display=swap');

  input::placeholder { color: #bbb; }

  input:focus {
    border-color: #2E7D4F !important;
    background: #fff !important;
    box-shadow: 0 0 0 3px rgba(46,125,79,0.10);
  }

  .submit-btn:hover:not(:disabled) {
    background: ${GREEN_DARK} !important;
    transform: translateY(-1px);
  }
  .submit-btn:active:not(:disabled) { transform: scale(0.99); }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { animation: spin 0.75s linear infinite; }
`;

export default AddAddress;