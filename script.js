const profile = {
  name: "ISHAAN HUMANEY",
  role: "AI & ML STUDENT",
  quote: "Intelligence is the bridge between human imagination and digital reality.",
  tags: ["AI AGENT DEVELOPER", "C++, PYTHON, JAVA", "OPEN SOURCE CONTRIBUTOR", "HUMAN RIGHTS ACTIVIST"],
  photo: "./profile.webp",
  passId: "NV-026-001",
  flight: "NV 026",
  originCode: "HUM",
  origin: "HUMAN IDEAS",
  destinationCode: "AID",
  destination: "AI DIMENSION",
  gate: "08",
  seat: "A1",
  links: {
    email: "ishaanhumaney@outlook.com",
    instagram: "https://www.instagram.com/ishaan_humaney/?hl=en",
    portfolio: "https://needfulcabin3.github.io/ISHAAN-HUMANEY-PORTFOLIO---Royal-Edition/",
    linkedin: "https://www.linkedin.com/in/ishaan-humaney/",
    github: "https://github.com/NeedFulCabin3"
  }
};

const byId = (id) => document.getElementById(id);

function setText(id, value) {
  const node = byId(id);
  if (node && typeof value === "string") node.textContent = value;
}

function renderProfile() {
  setText("profileQuote", profile.quote);
  setText("profileRole", profile.role);
  setText("passId", profile.passId);
  setText("flightCode", profile.flight);
  setText("originCode", profile.originCode);
  setText("originLabel", profile.origin);
  setText("destinationCode", profile.destinationCode);
  setText("destinationLabel", profile.destination);
  setText("gateCode", profile.gate);
  setText("seatCode", profile.seat);

  const nameNode = byId("profileName");
  if (nameNode) {
    const name = document.createTextNode(profile.name);
    const period = document.createElement("span");
    period.textContent = ".";
    nameNode.replaceChildren(name, period);
  }

  // Render all profile tags dynamically
  const tagsNode = byId("profileTags");

  if (tagsNode) {
    tagsNode.replaceChildren();

    profile.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      tagsNode.appendChild(chip);
    });
  }

  const photo = byId("profilePhoto");
  const placeholder = byId("portraitPlaceholder");

  if (photo && placeholder && typeof profile.photo === "string" && profile.photo.trim()) {

      // Prioritize profile image loading
      photo.loading = "eager";
      photo.fetchPriority = "high";
      photo.decoding = "async";

      photo.addEventListener("load", () => {
          photo.style.display = "block";
          placeholder.style.display = "none";
      }, { once: true });

      photo.addEventListener("error", () => {
          photo.style.display = "flex";
          placeholder.style.display = "flex";
      }, { once: true });

      photo.src = profile.photo;
  }

  document.querySelectorAll(".social-link[data-network]").forEach((link) => {
    const network = link.dataset.network;
    const destination = profile.links[network];
    if (!destination) {
      link.hidden = true;
      return;
    }
    link.hidden = false;
    link.href = network === "email"
      ? `mailto:${destination.replace(/^mailto:/i, "")}`
      : destination;
  });
}

function createBarcode() {
  const host = byId("barcode");
  if (!host) return;
  const seed = `${profile.passId}|${profile.name}`;
  let value = 2166136261;
  for (const character of seed) value = Math.imul(value ^ character.charCodeAt(0), 16777619) >>> 0;
  const bars = [];
  for (let index = 0; index < 74; index += 1) {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    const bar = document.createElement("i");
    bar.style.height = `${8 + (value % 10)}px`;
    bar.style.flexGrow = String(1 + (value % 3));
    if ((value & 7) === 0) bar.style.opacity = ".48";
    bars.push(bar);
  }
  host.replaceChildren(...bars);
}

function showToast(message) {
  const toast = byId("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove("show"), 1600);
}

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return true;
  }
  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const copied = document.execCommand("copy");
  field.remove();
  return copied;
}

function setupCopyButton() {
  const button = byId("copyPass");
  if (!button) return;
  button.addEventListener("click", async () => {
    try {
      const copied = await copyText(profile.passId);
      showToast(copied ? "BOARDING PASS ID COPIED" : `PASS ID: ${profile.passId}`);
    } catch {
      showToast(`PASS ID: ${profile.passId}`);
    }
  });
}

function setupTilt() {
  const card = byId("passCard");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!card || !finePointer.matches || reducedMotion.matches) return;

  const reset = () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--shine-x", "50%");
    card.style.setProperty("--shine-y", "40%");
  };
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--tilt-x", `${(0.5 - y) * 3.2}deg`);
    card.style.setProperty("--tilt-y", `${(x - 0.5) * 3.8}deg`);
    card.style.setProperty("--shine-x", `${x * 100}%`);
    card.style.setProperty("--shine-y", `${y * 100}%`);
  });
  card.addEventListener("pointerleave", reset);
  card.addEventListener("pointercancel", reset);
}

function setupSocialFeedback() {
  document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("click", () => {
      const network = link.dataset.network;
      if (network) showToast(`OPENING ${network.toUpperCase()} GATE`);
    });
  });
}

function initializePocketPass() {
  renderProfile();
  createBarcode();
  setupCopyButton();
  setupTilt();
  setupSocialFeedback();
}

document.addEventListener("DOMContentLoaded", initializePocketPass);

