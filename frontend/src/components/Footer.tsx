"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@300;400;500&display=swap');

* { box-sizing: border-box; }

.bl-footer { font-family: 'Outfit', sans-serif; background: #000; color: #fff; padding: 0; overflow: hidden; }
.bl-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
.bl-top-bar { display:flex; align-items:center; gap:12px; padding:24px 0 0; }
.bl-line { flex:1; height:1px; background: linear-gradient(to right, transparent, #4a6644, transparent); }
.bl-leaf { color:#5a8a54; font-size:16px; letter-spacing:4px; }

.bl-grid { display: grid; grid-template-columns: 1.4fr 0.8fr 0.8fr; gap: 0; padding: 32px 0 0; }
.bl-brand { padding-right: 48px; border-right: 0.5px solid #2a3d2a; }
.bl-title { font-family: 'Cormorant Garamond', serif; font-size: 42px; font-weight:300; line-height:1; color:#ede4d0; margin:0 0 8px; }
.bl-title em { font-style:italic; color:#c4a96a; font-weight:400; }
.bl-tm { font-size:11px; vertical-align: super; font-weight:300; color:#8a9e7e; margin-left:6px; }
.bl-tagline { font-size:13px; color:#fff; line-height:1.6; max-width: 320px; margin:12px 0 20px; font-weight:300; }

.bl-badge { display:inline-flex; align-items:center; gap:6px; background:#101a10; border:0.5px solid #3a5a3a; border-radius:20px; padding:6px 12px; font-size:11px; color:#8aab84; }
.bl-dot { width:8px; height:8px; border-radius:50%; background:#5a9952; animation: bl-pulse 2s ease-in-out infinite; }
@keyframes bl-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }

.bl-links { padding: 0 32px; border-right: 0.5px solid #2a3d2a; }
.bl-section-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#5a7a54; margin:0 0 16px; font-weight:400; }
.bl-nav { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:8px; }
.bl-nav a { font-size:15px; color:#fff; text-decoration:none; font-weight:300; position:relative; display:inline-block; transition: color .2s ease; padding:4px 0; }
.bl-nav a::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:#c4a96a; transition:width .25s ease; }
.bl-nav a:hover { color:#ede4d0; }
.bl-nav a:hover::after { width:100%; }

.bl-contact { padding-left: 32px; }
.bl-contact-item { display:flex; gap:10px; margin:0 0 12px; align-items:flex-start; }
.bl-contact-text { font-size:13px; color:#fff; line-height:1.6; font-weight:300; }

.bl-divider { margin:32px 0 0; height:0.5px; background: linear-gradient(to right, #2a3d2a, transparent); }

.bl-bottom { display:flex; align-items:center; justify-content:space-between; padding:20px 0 32px; flex-wrap:wrap; gap:16px; }
.bl-copy { font-size:12px; color:#4a6444; font-weight:300; letter-spacing:0.3px; }
.bl-socials { display:flex; gap:12px; }
.bl-soc { width:36px; height:36px; border:0.5px solid #2a3d2a; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: border-color .2s, background .2s; background:transparent; }
.bl-soc:hover { border-color:#c4a96a; background:#101a10; }
.bl-soc svg { width:14px; height:14px; fill:#6a8a64; transition:fill .2s; }
.bl-soc:hover svg { fill:#c4a96a; }

/* Medium screens: stack columns and reduce paddings */
@media (max-width: 768px) {
.bl-inner { padding: 0 24px; }
.bl-grid { grid-template-columns: 1fr; gap: 16px; padding-top: 20px; }
.bl-brand { padding-right: 0; border-right: none; padding-bottom: 12px; border-bottom: 0.5px solid #2a3d2a; }
.bl-links { padding: 12px 0; border-right: none; border-bottom: 0.5px solid #2a3d2a; }
.bl-contact { padding-left: 0; padding-top: 12px; }
.bl-title { font-size: 36px; max-width: 100%; }
.bl-tagline { max-width: 100%; }
.bl-bottom { padding-top: 16px; }
}

/* Small phones: tighter spacing and smaller title */
@media (max-width: 480px) {
.bl-inner { padding: 0 16px; }
.bl-top-bar { padding-top: 18px; gap:8px; }
.bl-title { font-size: 30px; }
.bl-badge { padding:5px 10px; font-size:11px; }
.bl-socials { gap:10px; }
.bl-soc { width:36px; height:36px; }
.bl-nav a { font-size:14px; }
.bl-copy { font-size:12px; }
}
`}</style>

      <footer className="bl-footer" aria-label="Site footer">
        <div className="bl-inner">
          <div className="bl-top-bar">
            <div className="bl-line" />
            <span className="bl-leaf" aria-hidden>
              ✦ ✦ ✦
            </span>
            <div className="bl-line" />
          </div>

          <div className="bl-grid">
            <div className="bl-brand">
              <h2 className="bl-title">
                Blink<em>Basket</em>
                <span className="bl-tm">™</span>
              </h2>
              <p className="bl-tagline">
                Modern Fresh shopping — farm-fresh products, curated with care
                and delivered with speed.
              </p>
              <div className="bl-badge" role="status" aria-live="polite">
                <div className="bl-dot" />
                Now delivering in Bhadrak
              </div>
            </div>

            <div className="bl-links" aria-labelledby="nav-label">
              <p id="nav-label" className="bl-section-label">
                Navigate
              </p>
              <ul className="bl-nav" role="list">
                {["Home", "Products", "About us", "Contact", "Careers"].map(
                  (link) => (
                    <li key={link}>
                      <a href="#" role="link">
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="bl-contact" aria-labelledby="contact-label">
              <p id="contact-label" className="bl-section-label">
                Find us
              </p>
              <div className="bl-contact-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5a8a54"
                  strokeWidth="1.5"
                  style={{ flexShrink: 0, marginTop: 2 }}
                  aria-hidden
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
                <span className="bl-contact-text">
                  123 Example Road, Bhadrak, India
                </span>
              </div>
              <div className="bl-contact-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5a8a54"
                  strokeWidth="1.5"
                  style={{ flexShrink: 0, marginTop: 2 }}
                  aria-hidden
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.12 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span className="bl-contact-text">+91 9000000000</span>
              </div>
              <div className="bl-contact-item">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5a8a54"
                  strokeWidth="1.5"
                  style={{ flexShrink: 0, marginTop: 2 }}
                  aria-hidden
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="bl-contact-text">BlinkBasket@gmail.in</span>
              </div>
            </div>
          </div>

          <div className="bl-divider" />

          <div className="bl-bottom">
            <p className="bl-copy">
              © {new Date().getFullYear()} Blenes. All rights reserved. ·
              Privacy Policy · Terms of Service
            </p>

            <div className="bl-socials" aria-label="Social links">
              <div
                className="bl-soc"
                role="button"
                tabIndex={0}
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div
                className="bl-soc"
                role="button"
                tabIndex={0}
                aria-label="X (Twitter)"
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </div>
              <div
                className="bl-soc"
                role="button"
                tabIndex={0}
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
