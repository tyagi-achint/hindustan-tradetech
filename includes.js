"use strict";

function injectFragment(targetId, htmlString) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const doc = new DOMParser().parseFromString(htmlString.trim(), "text/html");
  target.replaceChildren(...Array.from(doc.body.children));
}

function initFooterYear() {
  const el = document.getElementById("footer-year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function initMobileNav() {
  const shell = document.getElementById("side-nav-shell");
  const toggle = document.getElementById("mobile-menu-toggle");
  if (!shell || !toggle) return;

  const backdrop = shell.querySelector(".side-nav-backdrop");
  const panel = shell.querySelector(".side-nav");
  const icon = toggle.querySelector(".mobile-header__menu-icon");

  function isDesktop() {
    return window.matchMedia("(min-width: 768px)").matches;
  }

  function setOpen(open) {
    if (isDesktop()) open = false;
    shell.dataset.open = open ? "true" : "false";
    shell.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (icon) icon.textContent = open ? "close" : "menu";
    if ("inert" in shell) shell.inert = !open;
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(shell.dataset.open !== "true");
  });

  if (backdrop) backdrop.addEventListener("click", function () { setOpen(false); });

  if (panel) {
    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    const quoteBtn = panel.querySelector(".side-nav__footer .btn-gradient");
    if (quoteBtn) quoteBtn.addEventListener("click", function () { setOpen(false); });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && shell.dataset.open === "true") setOpen(false);
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", function (ev) {
    if (ev.matches) setOpen(false);
  });
}

async function loadIncludes() {
  const [navRes, footerRes] = await Promise.all([fetch("nav.html"), fetch("footer.html")]);
  if (!navRes.ok) throw new Error("nav.html: " + navRes.status);
  if (!footerRes.ok) throw new Error("footer.html: " + footerRes.status);
  const [navHtml, footerHtml] = await Promise.all([navRes.text(), footerRes.text()]);
  injectFragment("site-nav", navHtml);
  injectFragment("site-footer", footerHtml);
  initFooterYear();
  initMobileNav();
}

loadIncludes().catch(function (err) {
  console.error("[includes]", err);
});
