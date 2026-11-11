(function () {
  /* ============================================================
     CONFIG – edit these only
     ============================================================ */
  var RECEIVE_EMAIL = "arrianaexportsltd@gmail.com";
  var FORMSPREE_ID = ""; // optional Formspree form ID, or leave blank
  var WA_NUMBER = "254724964302"; // WhatsApp (0724)

  /* ---------- Page loader ---------- */
  var loader = document.getElementById("loader");
  var showLoader = true;

  try {
    if (sessionStorage.getItem("arriana_loader_seen")) {
      showLoader = false;
    }
  } catch (e) {
    showLoader = true;
  }

  if (!showLoader) {
    loader.classList.add("hide");
  } else {
    setTimeout(function () {
      loader.classList.add("hide");
      try {
        sessionStorage.setItem("arriana_loader_seen", "1");
      } catch (e) {}
    }, 1800);
  }

  window.addEventListener("load", function () {
    setTimeout(function () {
      loader.classList.add("hide");
    }, 400);
  });

  // Year
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
    document.querySelectorAll("#links a, .nav-cta").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", false);
      });
    });
  }

  // Active nav on scroll
  var links = document.querySelectorAll("#links a");
  var secs = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function spy() {
    var y = window.scrollY + 160;
    var cur = -1;
    secs.forEach(function (s, i) {
      if (s && s.offsetTop <= y) cur = i;
    });
    links.forEach(function (a, i) {
      a.classList.toggle("active", i === cur);
    });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // Scroll reveal
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    rv.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    rv.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // Catalogue tabs
  var catalog = {
    "Tubers & bananas": [
      "Cavendish banana",
      "Irish potato",
      "Arrowroots",
      "Sweet potato",
      "Yams",
      "Cassava",
    ],
    "Spices & vegetables": ["Ginger", "Beetroot", "Turmeric"],
    Fruits: ["Mango", "Sugarcane", "Avocado", "Pineapple"],
    Nuts: ["Macadamia nuts", "Cashew nuts", "Coconut"],
    Legumes: [
      "Cow peas",
      "Green grams",
      "Pigeon peas",
      "Red kidney beans",
    ],
    "Meats & oils": ["Halal meats", "Edible oils"],
  };
  var tabs = document.getElementById("tabs");
  var tags = document.getElementById("tags");
  function show(name) {
    if (!tabs || !tags) return;
    tags.innerHTML = "";
    catalog[name].forEach(function (t, i) {
      var s = document.createElement("span");
      s.textContent = t;
      s.style.animationDelay = i * 50 + "ms";
      tags.appendChild(s);
    });
    tabs.querySelectorAll(".tab").forEach(function (b) {
      b.classList.toggle("on", b.textContent === name);
      b.setAttribute("aria-selected", b.textContent === name);
    });
  }
  if (tabs && tags) {
    Object.keys(catalog).forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tab";
      b.setAttribute("role", "tab");
      b.textContent = k;
      b.addEventListener("click", function () {
        show(k);
      });
      tabs.appendChild(b);
    });
    show("Tubers & bananas");
  }

  // Contact form
  var form = document.getElementById("form");
  var note = document.getElementById("formNote");
  var via = "wa";

  if (form) {
    form.querySelectorAll("button[type=submit]").forEach(function (b) {
      b.addEventListener("click", function () {
        via = b.dataset.via || "wa";
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var name = (d.get("name") || "").trim();
      var email = (d.get("email") || "").trim();
      var msg = (d.get("message") || "").trim();

      if (
        !name ||
        !msg ||
        (via === "mail" && !/^\S+@\S+\.\S+$/.test(email))
      ) {
        if (note) {
          note.textContent =
            "Please add your name, a valid email (for email sends) and a short message.";
          note.style.color = "#F5C518";
        }
        return;
      }

      var body =
        "Hello Arriana Exports Ltd,\n\nName: " +
        name +
        "\nCompany: " +
        (d.get("company") || "-") +
        "\nEmail: " +
        (email || "-") +
        "\nPhone: " +
        (d.get("phone") || "-") +
        "\nInterested in: " +
        d.get("interest") +
        "\n\n" +
        msg;

      if (via === "wa") {
        window.open(
          "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(body),
          "_blank",
          "noopener"
        );
        form.reset();
        if (note) {
          note.style.color = "#F5C518";
          note.textContent = "Thanks — WhatsApp is ready to send.";
        }
        return;
      }

      if (FORMSPREE_ID) {
        if (note) note.textContent = "Sending…";
        fetch("https://formspree.io/f/" + FORMSPREE_ID, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            company: d.get("company") || "",
            phone: d.get("phone") || "",
            interest: d.get("interest"),
            message: msg,
            _replyto: email,
          }),
        })
          .then(function (r) {
            if (r.ok) {
              form.reset();
              if (note) {
                note.style.color = "#F5C518";
                note.textContent =
                  "Message sent successfully. We will reply soon.";
              }
            } else {
              if (note) {
                note.textContent =
                  "Could not send. Please try WhatsApp or email us directly.";
              }
            }
          })
          .catch(function () {
            if (note) note.textContent = "Network error. Please try WhatsApp.";
          });
      } else {
        window.location.href =
          "mailto:" +
          RECEIVE_EMAIL +
          "?subject=" +
          encodeURIComponent("Enquiry: " + d.get("interest")) +
          "&body=" +
          encodeURIComponent(body);
        form.reset();
        if (note) {
          note.style.color = "#F5C518";
          note.textContent = "Thanks — your email app is ready to send.";
        }
      }
    });
  }
})();