const byId = (id) => document.getElementById(id);

const menuBtn = byId("menuBtn");
const siteNav = byId("siteNav");
const navLinks = document.querySelectorAll(".nav a");
const revealItems = document.querySelectorAll(".reveal");
const yearNode = byId("year");
const scrollProgress = byId("scrollProgress");
const backTopBtn = byId("backTopBtn");
const toast = byId("toast");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectCount = byId("projectCount");
const contactForm = byId("contactForm");
const copyEmailBtn = byId("copyEmailBtn");
const emailAddress = byId("emailAddress");
const statNumbers = document.querySelectorAll(".stat-number");
const certLightbox = byId("certLightbox");
const lightboxImage = byId("lightboxImage");
const lightboxClose = byId("lightboxClose");
const certImageLinks = document.querySelectorAll(".cert-image-link");

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
};

const setupMobileMenu = () => {
  if (!menuBtn || !siteNav) return;

  menuBtn.addEventListener("click", () => siteNav.classList.toggle("open"));
  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => siteNav.classList.remove("open"));
  });
};

const setupYear = () => {
  if (yearNode) yearNode.textContent = new Date().getFullYear();
};

const setupRevealOnScroll = () => {
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => observer.observe(el));
};

const setupActiveSectionLink = () => {
  const sections = document.querySelectorAll("main section[id]");
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isMatch = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("is-active", isMatch);
        });
      });
    },
    { rootMargin: "-25% 0px -60% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
};

const setupCounters = () => {
  if (!statNumbers.length) return;

  const animateCounter = (node) => {
    const target = Number(node.dataset.target || 0);
    const duration = 1200;
    const startTime = performance.now();

    const run = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      node.textContent = String(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(run);
    };

    requestAnimationFrame(run);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.8 }
  );

  statNumbers.forEach((num) => observer.observe(num));
};

const setupScrollUi = () => {
  const update = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
    if (backTopBtn) backTopBtn.classList.toggle("show", scrollTop > 360);
  };

  window.addEventListener("scroll", update, { passive: true });
  update();

  if (backTopBtn) {
    backTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
};

const setupProjectFilters = () => {
  if (!filterButtons.length || !projectCards.length) return;

  const updateCount = () => {
    if (!projectCount) return;
    const visible = [...projectCards].filter((card) => !card.classList.contains("is-hidden")).length;
    projectCount.textContent = `${visible} projet${visible > 1 ? "s" : ""}`;
  };

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter || "all";

      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(/\s+/).filter(Boolean);
        const show = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });

      updateCount();
    });
  });

  updateCount();
};

const setupContact = () => {
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = String(contactForm.name.value || "").trim();
    const email = String(contactForm.email.value || "").trim();
    const message = String(contactForm.message.value || "").trim();

    if (!name || !email || !message) {
      showToast("Merci de remplir tous les champs.");
      return;
    }

    const subject = encodeURIComponent(`Contact portfolio - ${name}`);
    const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:anisguechetouli5@gmail.com?subject=${subject}&body=${body}`;
    showToast("Message prêt dans votre application mail.");
  });
};

const setupCopyEmail = () => {
  if (!copyEmailBtn || !emailAddress) return;

  copyEmailBtn.addEventListener("click", async () => {
    const email = emailAddress.textContent?.trim() || "";
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      showToast("Adresse email copiée.");
    } catch {
      showToast("Copie impossible sur ce navigateur.");
    }
  });
};

const setupCertificationLightbox = () => {
  if (!certLightbox || !lightboxImage) return;

  const openLightbox = (src, alt) => {
    lightboxImage.src = src;
    lightboxImage.alt = alt || "Certification agrandie";
    certLightbox.hidden = false;
    certLightbox.classList.add("is-open");
    certLightbox.setAttribute("aria-hidden", "false");
  };

  const closeLightbox = () => {
    certLightbox.classList.remove("is-open");
    certLightbox.hidden = true;
    certLightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  };

  certImageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const image = link.querySelector(".cert-image");
      if (!image) return;
      openLightbox(image.getAttribute("src") || link.getAttribute("href") || "", image.getAttribute("alt") || "");
    });
  });

  certLightbox.addEventListener("click", (event) => {
    if (event.target === certLightbox) closeLightbox();
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !certLightbox.hidden) closeLightbox();
  });
};

setupMobileMenu();
setupYear();
setupRevealOnScroll();
setupActiveSectionLink();
setupCounters();
setupScrollUi();
setupProjectFilters();
setupContact();
setupCopyEmail();
setupCertificationLightbox();
