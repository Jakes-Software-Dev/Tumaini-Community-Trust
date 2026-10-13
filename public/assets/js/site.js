/* Tumaini Community Trust — progressive enhancement only. */
(function () {
  "use strict";

  /* Current year in the footer */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* Sticky header shadow once the page scrolls */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile navigation */
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("hidden", !open);
      var openIcon = toggle.querySelector('[data-icon="open"]');
      var closeIcon = toggle.querySelector('[data-icon="close"]');
      if (openIcon && closeIcon) {
        openIcon.classList.toggle("hidden", open);
        closeIcon.classList.toggle("hidden", !open);
      }
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
  }

  /* Contact form: hands the message to the visitor's own mail client so the
     static site never has to store personal data. */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var topic = String(data.get("topic") || "").trim();
      var message = String(data.get("message") || "").trim();

      var subject = "Website enquiry" + (topic ? " — " + topic : "") + (name ? " (" + name + ")" : "");
      var body = [
        "Name: " + name,
        "Email: " + email,
        "Topic: " + topic,
        "",
        message,
        "",
        "— Sent from the Tumaini Community Trust website",
      ].join("\n");

      var href =
        "mailto:hello@tumainitrust.org?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      if (status) {
        status.textContent =
          "Opening your email app with this message ready to send. You can also write to hello@tumainitrust.org directly.";
        status.classList.remove("hidden");
      }
      window.location.href = href;
    });
  }
})();
