// ============================
// TELA DE ENTRADA + ÁUDIO
// ============================

const entryScreen = document.getElementById("entryScreen");
const entryBtn    = document.getElementById("entryBtn");
const entrySkip   = document.getElementById("entrySkip");
const playerPill  = document.getElementById("playerPill");
const ppTrack     = document.getElementById("ppTrack");
const ppMute      = document.getElementById("ppMute");

// Arquivos de áudio — adicione o src quando tiver o arquivo na pasta audio/
const audioSrcs = {
    "fase-agro":   "audio/vai-me-dando-corda.mp3",
    "fase-nanda":  "audio/pitty.mp3",
    "fase-veigh":  "audio/meio-pa.mp3",
    "fase-boate":  "audio/boate.mp3",
    "fase-rodeio": "audio/jeito-carinhoso.mp3",
};

let audioEnabled = false;
let muted        = false;
let currentAudio = null;
const FADE_STEPS = 20;
const FADE_TIME  = 800;

// Mapeamento fase → áudio
const faseAudios = {};
document.querySelectorAll("[data-audio]").forEach(section => {
    const audioEl = document.getElementById(section.dataset.audio);
    const src     = audioSrcs[section.id] || "";
    if (audioEl && src) {
        audioEl.src    = src;
        audioEl.volume = 0;
        faseAudios[section.id] = { el: audioEl, track: section.dataset.track };
    } else if (audioEl) {
        // sem arquivo ainda — registra só o nome pra exibir no player
        faseAudios[section.id] = { el: null, track: section.dataset.track };
    }
});

function fadeIn(audio, targetVol = 0.7) {
    if (!audio || !audio.src) return;
    try {
        audio.volume = 0;
        audio.play().catch(() => {});
        const step = targetVol / FADE_STEPS;
        const ms   = FADE_TIME / FADE_STEPS;
        let i = 0;
        const t = setInterval(() => {
            i++;
            audio.volume = Math.min(targetVol, audio.volume + step);
            if (i >= FADE_STEPS) clearInterval(t);
        }, ms);
    } catch(e) {}
}

function fadeOut(audio, cb) {
    if (!audio || !audio.src) { if (cb) cb(); return; }
    try {
        const step = audio.volume / FADE_STEPS;
        const ms   = FADE_TIME / FADE_STEPS;
        let i = 0;
        const t = setInterval(() => {
            i++;
            audio.volume = Math.max(0, audio.volume - step);
            if (i >= FADE_STEPS) {
                clearInterval(t);
                try { audio.pause(); audio.currentTime = 0; } catch(e) {}
                if (cb) cb();
            }
        }, ms);
    } catch(e) { if (cb) cb(); }
}

function trocarMusica(faseId) {
    if (!audioEnabled) return;
    const next = faseAudios[faseId];
    if (!next) return;

    // sempre atualiza o nome no player
    ppTrack.textContent = next.track || "—";

    // sem arquivo ainda, só para o atual
    if (!next.el) {
        if (currentAudio && currentAudio.el) fadeOut(currentAudio.el);
        currentAudio = next;
        return;
    }

    if (currentAudio && currentAudio.el === next.el) return;

    if (currentAudio && currentAudio.el) {
        fadeOut(currentAudio.el, () => { if (!muted) fadeIn(next.el); });
    } else {
        if (!muted) fadeIn(next.el);
    }
    currentAudio = next;
}

function iniciarExperiencia(comSom) {
    audioEnabled = comSom;
    muted        = !comSom;
    ppMute.textContent = comSom ? "🔊" : "🔇";

    entryScreen.classList.add("hidden");
    playerPill.style.display = "flex";
    setTimeout(() => playerPill.classList.add("visible"), 100);

    // toca a primeira fase
    const primeira = document.querySelector(".fase[data-audio]");
    if (primeira) trocarMusica(primeira.id);
}

entryBtn.addEventListener("click",  () => iniciarExperiencia(true));
entrySkip.addEventListener("click", () => iniciarExperiencia(false));

ppMute.addEventListener("click", () => {
    muted = !muted;
    ppMute.textContent = muted ? "🔇" : "🔊";
    if (currentAudio && currentAudio.el) {
        muted ? fadeOut(currentAudio.el) : fadeIn(currentAudio.el);
    }
});

// ============================
// TROCA DE MÚSICA POR SEÇÃO
// ============================
const secaoObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            trocarMusica(entry.target.id);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll(".fase[data-audio]").forEach(s => secaoObs.observe(s));

// ============================
// TYPEWRITER HERO
// ============================
const heroTyped = document.getElementById("heroTyped");
const typeText  = "18 anos de uma pessoa que não cabe em uma definição só";
let   typeIdx   = 0;

function typeNext() {
    if (typeIdx < typeText.length) {
        heroTyped.textContent += typeText[typeIdx++];
        setTimeout(typeNext, 45);
    }
}
setTimeout(typeNext, 800);

// ============================
// SCROLL REVEAL
// ============================
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("vis");
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObs.observe(el));

// ============================
// GALERIA LIGHTBOX
// ============================
const imagens = [
    "img/sophia aesthetic.jpeg",
    "img/sophia ama MG.jpeg",
    "img/sophia com bezerro.jpeg",
    "img/sophia com biquinho.jpeg",
    "img/sophia com copo na mao.jpeg",
    "img/sophia com coral.jpeg",
    "img/sophia com crianca.jpeg",
    "img/sophia com flor na cabeca.jpeg",
    "img/sophia com roupa rep.jpeg",
    "img/sophia com sirius.jpeg",
    "img/sophia corpo inteiro.jpeg",
    "img/sophia cowgirl.jpeg",
    "img/sophia de juju.jpeg",
    "img/sophia e seu prof.jpeg",
    "img/sophia foto fav.jpeg",
    "img/sophia hangloose.jpeg",
    "img/sophia linda.jpeg",
    "img/sophia lingua.jpeg",
    "img/sophia meiga buffet.jpeg",
    "img/sophia na rep.jpeg",
    "img/sophia no buffet.jpeg",
    "img/sophia onibus.jpeg",
    "img/sophia pedindo benca.jpeg",
    "img/sophia pequena com penas.jpeg",
    "img/sophia pequena no cavalo.jpeg",
    "img/sophia tirando leite da vaca.jpeg",
    "img/sophia twitter.jpeg",
];

const lightbox   = document.getElementById("lightbox");
const lbImg      = document.getElementById("lbImg");
const lbCounter  = document.getElementById("lbCounter");
const lbDots     = document.getElementById("lbDots");
const lbClose    = document.getElementById("lbClose");
const lbPrev     = document.getElementById("lbPrev");
const lbNext     = document.getElementById("lbNext");
const lbPrevMob  = document.getElementById("lbPrevMob");
const lbNextMob  = document.getElementById("lbNextMob");
const lbBackdrop = document.getElementById("lbBackdrop");

let lbIndex = 0;

imagens.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "lb-dot";
    d.setAttribute("aria-label", `Foto ${i + 1}`);
    d.addEventListener("click", () => goTo(i));
    lbDots.appendChild(d);
});

function pad(n) { return String(n).padStart(2, "0"); }

function updateDots() {
    lbDots.querySelectorAll(".lb-dot").forEach((d, i) =>
        d.classList.toggle("active", i === lbIndex));
}

function goTo(index) {
    lbIndex = (index + imagens.length) % imagens.length;
    lbImg.classList.add("fading");
    setTimeout(() => {
        lbImg.src = imagens[lbIndex];
        lbImg.classList.remove("fading");
        lbCounter.textContent = `${pad(lbIndex + 1)} / ${pad(imagens.length)}`;
        updateDots();
    }, 220);
}

function openLightbox(index) {
    lbIndex = index;
    lbImg.src = imagens[lbIndex];
    lbCounter.textContent = `${pad(lbIndex + 1)} / ${pad(imagens.length)}`;
    updateDots();
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

document.querySelectorAll(".gal-item").forEach(item =>
    item.addEventListener("click", () => openLightbox(Number(item.dataset.index))));

lbClose.addEventListener("click", closeLightbox);
lbBackdrop.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click",    () => goTo(lbIndex - 1));
lbNext.addEventListener("click",    () => goTo(lbIndex + 1));
lbPrevMob.addEventListener("click", () => goTo(lbIndex - 1));
lbNextMob.addEventListener("click", () => goTo(lbIndex + 1));

document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowRight") goTo(lbIndex + 1);
    if (e.key === "ArrowLeft")  goTo(lbIndex - 1);
});

let touchStartX = 0;
lightbox.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener("touchend",   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff >  50) goTo(lbIndex + 1);
    if (diff < -50) goTo(lbIndex - 1);
});

lbImg.addEventListener("error", () => {
    lbImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%231A1612' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%23C8922A' text-anchor='middle' font-size='14' font-family='monospace' dominant-baseline='middle'%3Efoto ainda chegando...%3C/text%3E%3C/svg%3E";
});

// ============================
// WHATSAPP RSVP
// ============================
document.getElementById("confirmarBtn").addEventListener("click", () => {
    const numero   = "5519900000000"; // troque pelo número correto
    const mensagem = "Oi! Confirmo minha presença no aniversário de 18 anos da Sophia! 🤍🎉";
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank");
});