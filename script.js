const grid = document.getElementById("essayGrid");
const modal = document.getElementById("essayModal");
const modalTitle = document.getElementById("modalTitle");
const modalNumber = document.getElementById("modalNumber");
const modalBody = document.getElementById("modalBody");
const search = document.getElementById("essaySearch");
const count = document.getElementById("essayCount");
const empty = document.getElementById("emptyState");

function renderEssays(term = "") {
  const filtered = (window.ESSAYS || []).filter(essay =>
    `${essay.title} ${essay.number}`.toLocaleLowerCase("pt-BR").includes(term.toLocaleLowerCase("pt-BR"))
  );
  grid.innerHTML = "";
  filtered.forEach((essay, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "essay-card";
    const number = document.createElement("span");
    number.className = "essay-number";
    number.textContent = `TEXTO ${String(index + 1).padStart(2, "0")} · ${essay.number}`;
    const title = document.createElement("h3");
    title.textContent = essay.title;
    const read = document.createElement("span");
    read.className = "read-more";
    read.textContent = "Ler redação ↗";
    card.append(number, title, read);
    card.addEventListener("click", () => openEssay(essay));
    grid.appendChild(card);
  });
  count.textContent = `${filtered.length} ${filtered.length === 1 ? "texto" : "textos"}`;
  empty.hidden = filtered.length !== 0;
}
function openEssay(essay) {
  modalNumber.textContent = `REDAÇÃO ${essay.number}`;
  modalTitle.textContent = essay.title;
  modalBody.innerHTML = "";
  essay.paragraphs.forEach(text => {
    const p = document.createElement("p");
    p.textContent = text;
    modalBody.appendChild(p);
  });
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.getElementById("modalClose").focus();
}
function closeEssay() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}
search.addEventListener("input", event => renderEssays(event.target.value.trim()));
document.getElementById("modalClose").addEventListener("click", closeEssay);
modal.addEventListener("click", event => { if (event.target.hasAttribute("data-close-modal")) closeEssay(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("is-open")) closeEssay(); });

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
}
renderEssays();
