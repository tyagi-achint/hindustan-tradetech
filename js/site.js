"use strict";

function downloadPDF() {
  const link = document.createElement("a");
  link.href = "HINDUSTAN-TRADETECH_product_list.pdf";
  link.download = "HINDUSTAN-TRADETECH_product_list.pdf";
  link.click();
}

window.downloadPDF = downloadPDF;
