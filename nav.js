// nav.js — Injects the same stable navigation bar into every page.

(function () {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const isIndex    = path === "" || path === "index.html";
  const isWorkshop = path === "workshop.html";

  const navHTML = `
    <nav id="mainNav">
      <div class="nav-container">
        <ul class="nav-menu">
          <li><a href="./index.html" class="${isIndex ? 'active' : ''}">Home</a></li>
          <li><a href="./index.html#about">About</a></li>
          <li><a href="./index.html#principal">Founder</a></li>
          <li><a href="./index.html#programs">Programs</a></li>
          <li><a href="./workshop.html" class="${isWorkshop ? 'active' : ''}">Workshop</a></li>
          <li><a href="./index.html#facilities">Services</a></li>
          <li><a href="./index.html#position-holders">Position Holders</a></li>
          <li><a href="./index.html#exhibition">Innovation</a></li>
        </ul>

        <div class="nav-actions">
          <a href="./register.html" class="btn-apply">Apply Now</a>
          <a href="./login.html" class="btn-login">Login</a>
        </div>
      </div>
    </nav>
  `;

  function inject() {
    const placeholder = document.getElementById("mainNav");
    if (placeholder) {
      placeholder.outerHTML = navHTML;
    } else {
      const existing = document.querySelector("nav");
      if (existing) {
        existing.outerHTML = navHTML;
      } else {
        const header = document.querySelector("header");
        if (header) {
          header.insertAdjacentHTML("afterend", navHTML);
        } else {
          document.body.insertAdjacentHTML("afterbegin", navHTML);
        }
      }
    }

    if (isIndex) {
      window.addEventListener("scroll", highlightActiveSection);
      highlightActiveSection();
    }
  }

  function highlightActiveSection() {
    const sections = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll("#mainNav .nav-menu a");
    let currentId = "home";
    sections.forEach(s => {
      const top = s.offsetTop;
      if (window.pageYOffset >= top - 120) currentId = s.id;
    });
    links.forEach(a => {
      const href = a.getAttribute("href") || "";
      if (href.includes("#")) {
        const hash = href.split("#")[1];
        if (hash === currentId) a.classList.add("active");
        else a.classList.remove("active");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();