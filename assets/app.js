/* =============================================================
   JET 7 BIKE — Refonte 2026 · Interactions
   Léon ⚡️🦁⚡️ pour Philippe Charrier
   Maquette statique : les soumissions sont simulées (démo).
   ============================================================= */
(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelector(".nav-links");
  if (burger && navLinks) {
    burger.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Sélecteur de couleurs (page produit) ---------- */
  document.querySelectorAll("[data-color-picker]").forEach((picker) => {
    const target = document.querySelector(picker.getAttribute("data-target"));
    picker.querySelectorAll("[data-img]").forEach((swatch) => {
      swatch.addEventListener("click", () => {
        picker.querySelectorAll("[data-img]").forEach((s) => s.classList.remove("active"));
        swatch.classList.add("active");
        if (target) target.src = swatch.getAttribute("data-img");
      });
    });
  });

  /* ---------- Modales de capture de leads ---------- */
  const modalRoot = document.getElementById("modal-root");
  function openModal(type, model) {
    if (!modalRoot) return;
    const titles = {
      essai: "Réserver un essai gratuit",
      devis: "Recevoir une offre personnalisée",
      alerte: "M'alerter sur ce modèle",
    };
    const subs = {
      essai: "Sans engagement · Réponse sous 24h · Cannes ou Sainte-Maxime",
      devis: "Prix, financement, reprise — une offre claire sous 24h.",
      alerte: "Nouveautés, séries limitées et promos. Désinscription en 1 clic.",
    };
    const ctaLabel = { essai: "Planifier mon essai", devis: "Recevoir mon offre", alerte: "M'avertir" };
    const extra = type === "alerte" ? "" : `
        <div class="row">
          <div class="field"><label>Prénom</label><input class="input" name="prenom" placeholder="Jean" required></div>
          <div class="field"><label>Nom</label><input class="input" name="nom" placeholder="Dupont" required></div>
        </div>
        <div class="field"><label>Téléphone</label><input class="input" name="tel" type="tel" placeholder="06 12 34 56 78" required></div>`;
    const boutiqueSel = type === "alerte" ? "" : `
        <div class="field"><label>Boutique</label>
          <select class="select" name="boutique">
            <option>Jet 7 Bike — Cannes</option>
            <option>Jet 7 Bike — Sainte-Maxime</option>
          </select></div>`;
    modalRoot.innerHTML = `
      <div class="modal-overlay" data-close>
        <div class="modal" role="dialog" aria-modal="true">
          <button class="modal__x" data-close aria-label="Fermer">×</button>
          <p class="eyebrow">${model ? model : "Jet 7 Bike"}</p>
          <h3>${titles[type]}</h3>
          <p class="lead" style="font-size:.98rem;margin:.2em 0 1.2em">${subs[type]}</p>
          <form class="form form--light" data-leadform>
            ${extra}
            <div class="field"><label>Email</label><input class="input" name="email" type="email" placeholder="vous@email.fr" required></div>
            ${boutiqueSel}
            <button class="btn btn--primary btn--wide btn--lg" type="submit">${ctaLabel[type]}</button>
            <p class="consent" style="color:var(--muted)">🔒 Vos données restent chez Jet 7 Bike. Aucun spam.</p>
          </form>
        </div>
      </div>`;
    document.body.style.overflow = "hidden";
    const form = modalRoot.querySelector("[data-leadform]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.innerHTML = `<div class="form-success">
          <div class="form-success__ic">✓</div>
          <h3>C'est noté, merci !</h3>
          <p>L'équipe Jet 7 Bike vous recontacte très vite.</p>
          <button class="btn btn--dark mt-m" data-close>Fermer</button>
        </div>`;
      bindClose();
    });
    bindClose();
  }
  function closeModal() {
    if (!modalRoot) return;
    modalRoot.innerHTML = "";
    document.body.style.overflow = "";
  }
  function bindClose() {
    modalRoot.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", (e) => { if (e.target === el) closeModal(); })
    );
  }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-modal]");
    if (t) { e.preventDefault(); openModal(t.getAttribute("data-modal"), t.getAttribute("data-model")); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------- Newsletter inline (démo) ---------- */
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.innerHTML = '<p class="news-ok">✓ Inscription confirmée. À très vite sur la route !</p>';
    });
  });

  /* ---------- Exit-intent (alerte email) — desktop, une fois ---------- */
  let exitShown = sessionStorage.getItem("j7-exit") === "1";
  if (window.matchMedia("(min-width:760px)").matches) {
    document.addEventListener("mouseout", (e) => {
      if (!exitShown && e.clientY <= 0 && !e.relatedTarget) {
        exitShown = true; sessionStorage.setItem("j7-exit", "1");
        openModal("alerte", document.body.getAttribute("data-model") || "");
      }
    });
  }
})();
