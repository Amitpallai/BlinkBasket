"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="font-['Outfit',sans-serif] bg-black text-white overflow-hidden" aria-label="Site footer">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16">
        {/* Top Bar */}
        <div className="flex items-center gap-3 pt-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#4a6644] to-transparent" />
          <span className="text-[#5a8a54] text-base tracking-[4px]" aria-hidden>
            ✦ ✦ ✦
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#4a6644] to-transparent" />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr_0.8fr] gap-4 md:gap-0 pt-8">
          {/* Brand Section */}
          <div className="md:pr-12 md:border-r md:border-[#2a3d2a] pb-3 md:pb-0 border-b md:border-b-0 border-[#2a3d2a]">
            <h2 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-[36px] md:text-[42px] font-light leading-tight text-[#ede4d0] mb-2">
              Blink<em className="italic text-[#c4a96a] not-italic">Basket</em>
              <span className="text-[11px] align-super font-light text-[#8a9e7e] ml-1.5">™</span>
            </h2>
            <p className="text-[13px] text-white leading-relaxed max-w-[320px] w-full mt-3 mb-5 font-light">
              Modern Fresh shopping — farm-fresh products, curated with care
              and delivered with speed.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-[#101a10] border border-[#3a5a3a] rounded-full px-3 py-1.5 text-[11px] text-[#8aab84]" role="status" aria-live="polite">
              <div className="w-2 h-2 rounded-full bg-[#5a9952] animate-pulse" />
              Now delivering in Bhadrak
            </div>
          </div>

          {/* Links Section */}
          <div className="md:px-8 py-3 md:py-0 md:border-r md:border-[#2a3d2a] border-b md:border-b-0 border-[#2a3d2a]" aria-labelledby="nav-label">
            <p id="nav-label" className="text-[10px] tracking-[2px] uppercase text-[#5a7a54] mb-4 font-normal">
              Navigate
            </p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2" role="list">
              {["Home", "Products", "About us", "Contact", "Careers"].map(
                (link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      role="link"
                      className="text-[15px] text-white no-underline font-light relative inline-block transition-colors duration-200 py-1 hover:text-[#ede4d0] after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-px after:bg-[#c4a96a] after:transition-all after:duration-200 hover:after:w-full"
                    >
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="md:pl-8 pt-3 md:pt-0" aria-labelledby="contact-label">
            <p id="contact-label" className="text-[10px] tracking-[2px] uppercase text-[#5a7a54] mb-4 font-normal">
              Find us
            </p>
            <div className="flex gap-2.5 mb-3 items-start">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5a8a54"
                strokeWidth="1.5"
                className="flex-shrink-0 mt-0.5"
                aria-hidden
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span className="text-[13px] text-white leading-relaxed font-light">
                123 Example Road, Bhadrak, India
              </span>
            </div>
            <div className="flex gap-2.5 mb-3 items-start">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5a8a54"
                strokeWidth="1.5"
                className="flex-shrink-0 mt-0.5"
                aria-hidden
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.12 2.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.45-.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span className="text-[13px] text-white leading-relaxed font-light">+91 9000000000</span>
            </div>
            <div className="flex gap-2.5 mb-3 items-start">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5a8a54"
                strokeWidth="1.5"
                className="flex-shrink-0 mt-0.5"
                aria-hidden
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="text-[13px] text-white leading-relaxed font-light">BlinkBasket@gmail.in</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-[#2a3d2a] to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 pb-8">
          <p className="text-[12px] text-[#4a6444] font-light tracking-[0.3px]">
            © {new Date().getFullYear()} Blenes. All rights reserved. ·
            Privacy Policy · Terms of Service
          </p>

          <div className="flex gap-3" aria-label="Social links">
            <div
              className="w-9 h-9 border border-[#2a3d2a] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#c4a96a] hover:bg-[#101a10]"
              role="button"
              tabIndex={0}
              aria-label="Instagram"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-3.5 h-3.5 fill-[#6a8a64] transition-colors duration-200 group-hover:fill-[#c4a96a]"
                aria-hidden
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div
              className="w-9 h-9 border border-[#2a3d2a] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#c4a96a] hover:bg-[#101a10]"
              role="button"
              tabIndex={0}
              aria-label="X (Twitter)"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-3.5 h-3.5 fill-[#6a8a64] transition-colors duration-200 group-hover:fill-[#c4a96a]"
                aria-hidden
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </div>
            <div
              className="w-9 h-9 border border-[#2a3d2a] rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#c4a96a] hover:bg-[#101a10]"
              role="button"
              tabIndex={0}
              aria-label="LinkedIn"
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-3.5 h-3.5 fill-[#6a8a64] transition-colors duration-200 group-hover:fill-[#c4a96a]"
                aria-hidden
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;