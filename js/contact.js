"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const fullName = document.getElementById("full_name").value.trim();
    const company = document.getElementById("company").value.trim() || "—";
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim() || "—";
    const interest = document.getElementById("interest").value.trim();
    const message = document.getElementById("message").value.trim();

    let text =
      "Hello, I would like to make an inquiry:\n\n" +
      "• Name: " + fullName + "\n" +
      "• Company: " + company + "\n" +
      "• Phone: " + phone + "\n" +
      "• Email: " + email + "\n" +
      "• Product interest: " + interest;

    if (message) text += "\n\nRequirements / Message:\n" + message;
    text += "\n\nThank you.";

    window.open("https://wa.me/919811472847?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
    form.reset();
  });
});
