const weddingDate = new Date("2026-12-19T16:00:00-05:00");
const music = document.getElementById("music");
const button = document.getElementById("musicButton");
const openButton = document.getElementById("open");
const cover = document.getElementById("cover");
const particleLayer = document.querySelector(".cover-particles");

function createCoverParticles() {
  const symbols = ["✦", "♥", "✧", "♡"];
  const particleCount = 28;

  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.PI + (index / (particleCount - 1)) * Math.PI;
    const distance = 190 + (index % 4) * 34;
    const particle = document.createElement("span");
    particle.className = `cover-particle${index % 2 === 1 ? " is-heart" : ""}`;
    particle.textContent = symbols[index % symbols.length];
    particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--particle-size", `${15 + (index % 4) * 4}px`);
    particle.style.setProperty("--particle-delay", `${(index % 6) * 35}ms`);
    particle.style.setProperty("--particle-rotation", `${(index % 2 ? -1 : 1) * (25 + index % 5 * 12)}deg`);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
    particleLayer.append(particle);
  }
}

function updateMusicButtonState(isPlaying) {
  const floating = button.classList.contains("is-floating");
  button.textContent = isPlaying ? (floating ? "♫" : "♫ Pausar música") : (floating ? "♫" : "♫ Activar música");
  button.setAttribute("aria-label", isPlaying ? "Pausar música" : "Activar música");
  button.setAttribute("aria-pressed", String(isPlaying));
}

function startMusic() {
  return music.play().then(() => {
    updateMusicButtonState(true);
  }).catch((error) => {
    console.error("No se pudo reproducir la música:", error);
    updateMusicButtonState(false);
  });
}

function openInvitation() {
  if (openButton.disabled) {
    return;
  }

  startMusic();
  createCoverParticles();
  openButton.disabled = true;
  document.querySelector("[data-open-invitation]").disabled = true;
  cover.classList.add("is-opening");

  setTimeout(() => {
    document.getElementById("site").classList.remove("hidden");
    button.classList.add("is-floating");
    updateMusicButtonState(!music.paused);
    cover.classList.add("is-revealing");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      cover.style.display = "none";
    }, 750);
  }, 1100);
}

openButton.addEventListener("click", openInvitation);
document.querySelector("[data-open-invitation]").addEventListener("click", openInvitation);

function tick() {
  const diff = Math.max(0, weddingDate.getTime() - Date.now());
  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };

  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).textContent = String(value).padStart(2, "0");
  });
}

tick();
setInterval(tick, 1000);

const text = encodeURIComponent("¡Hola! Confirmo mi asistencia a la boda de Karla Santillán y Jefersson Mantuano, el 19 de diciembre de 2026. Mi nombre es: ");
document.getElementById("waKarla").href = "https://wa.me/593991369750?text=" + text;
document.getElementById("waJefersson").href = "https://wa.me/593986418486?text=" + text;

const galleryCaptions = [
  "Un momento para nosotros",
  "Siempre en equipo",
  "Un recuerdo para guardar",
  "Juntos en cada aventura",
  "Sonrisas que hablan por sí solas",
  "Así se siente la felicidad",
  "Nuestro amor, en cada detalle",
  "Un día lleno de alegría",
  "Mi lugar favorito es a tu lado",
  "La vida es más bonita juntos",
  "Y este es solo el comienzo"
];
const photoSlides = document.getElementById("photoSlides");
const galleryPhotos = [
  { file: "foto-2.jpeg", alt: "Karla y Jefersson disfrutando juntos" },
  { file: "foto-03.jpg", alt: "Karla y Jefersson sonriendo juntos" },
  ...Array.from({ length: 9 }, (_, index) => ({
    file: `foto-${String(index + 4).padStart(2, "0")}.jpeg`,
    alt: `Karla y Jefersson, fotografía ${index + 4}`
  }))
];

galleryPhotos.forEach((photo, index) => {
  const card = document.createElement("figure");
  card.className = `photo-card${index === 0 ? " is-active" : ""}`;
  card.setAttribute("aria-hidden", String(index !== 0));

  const image = document.createElement("img");
  image.src = `assets/${photo.file}`;
  image.alt = photo.alt;
  image.loading = index === 0 ? "eager" : "lazy";

  const caption = document.createElement("figcaption");
  caption.textContent = galleryCaptions[index];

  card.append(image, caption);
  photoSlides.append(card);
});

const photoCards = Array.from(photoSlides.querySelectorAll(".photo-card"));
const photoCounter = document.getElementById("photoCounter");
let activePhoto = 0;

function showPhoto(index) {
  activePhoto = (index + photoCards.length) % photoCards.length;
  photoCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === activePhoto;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-hidden", String(!isActive));
  });
  photoCounter.textContent = `${activePhoto + 1} / ${photoCards.length}`;
}

document.getElementById("previousPhoto").addEventListener("click", () => {
  showPhoto(activePhoto - 1);
});

document.getElementById("nextPhoto").addEventListener("click", () => {
  showPhoto(activePhoto + 1);
});

document.querySelector(".photo-carousel").addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showPhoto(activePhoto - 1);
  } else if (event.key === "ArrowRight") {
    showPhoto(activePhoto + 1);
  }
});

showPhoto(0);

button.addEventListener("click", () => {
  if (music.paused) {
    startMusic();
  } else {
    music.pause();
    updateMusicButtonState(false);
  }
});
