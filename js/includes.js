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

function currentNavKey() {
  const file = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (file === "index.html" || file === "home.html" || file === "") return "home";
  if (file === "product.html") return "products";
  if (file === "about-us.html") return "about";
  if (file === "contact.html") return "contact";
  return "";
}

function initNavActive() {
  const key = currentNavKey();
  if (!key) return;
  document.querySelectorAll("[data-nav-key]").forEach(function (el) {
    const active = el.getAttribute("data-nav-key") === key;
    el.classList.toggle("top-nav__link--active", active && el.classList.contains("top-nav__link"));
    el.classList.toggle("side-nav__item--active", active && el.classList.contains("side-nav__item"));
  });
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
  const [navRes, footerRes] = await Promise.all([
    fetch("includes/nav.html"),
    fetch("includes/footer.html"),
  ]);
  if (!navRes.ok) throw new Error("includes/nav.html: " + navRes.status);
  if (!footerRes.ok) throw new Error("includes/footer.html: " + footerRes.status);
  const [navHtml, footerHtml] = await Promise.all([navRes.text(), footerRes.text()]);
  injectFragment("site-nav", navHtml);
  injectFragment("site-footer", footerHtml);
  initNavActive();
  initFooterYear();
  initMobileNav();
}

loadIncludes().catch(function (err) {
  console.error("[includes]", err);
});
