"use strict";

var BROCHURE_FILE = "HINDUSTAN-TRADETECH_product_list.pdf";

function siteBase() {
  var path = window.location.pathname.toLowerCase();
  if (path.indexOf("/product/") !== -1) return "../";
  return "";
}

function downloadPDF() {
  var url = siteBase() + BROCHURE_FILE;
  var link = document.createElement("a");
  link.href = url;
  link.download = BROCHURE_FILE;
  link.setAttribute("type", "application/pdf");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function initDownloadBrochureButtons() {
  document.querySelectorAll("[data-download-brochure]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      downloadPDF();
    });
  });
}

window.downloadPDF = downloadPDF;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDownloadBrochureButtons);
} else {
  initDownloadBrochureButtons();
}
