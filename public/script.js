document.addEventListener("DOMContentLoaded", () => {
  // ===== DARK MODE =====
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  darkModeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    darkModeToggle.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("show");
      hamburger.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("show")) {
          navLinks.classList.remove("show");
          hamburger.setAttribute("aria-expanded", false);
          hamburger.classList.remove("open");
        }
      });
    });
  }

  // ===== NAV SCROLL HIGHLIGHT =====
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 70;
      if (pageYOffset >= sectionTop) current = section.getAttribute("id");
    });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) a.classList.add("active");
    });
  });

  // ===== HERO SLIDER =====
  const heroSlides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentHero = 0;
  const slideInterval = 4000;
  let autoSlide;

  function showHeroSlide(index) {
    heroSlides.forEach((slide, i) => {
      slide.classList.remove("active");
      slide.style.opacity = i === index ? "1" : "0";
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
    currentHero = index;
  }

  function nextHeroSlide() {
    showHeroSlide((currentHero + 1) % heroSlides.length);
  }

  if (heroSlides.length && dots.length) {
    autoSlide = setInterval(nextHeroSlide, slideInterval);
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showHeroSlide(parseInt(dot.getAttribute("data-slide")));
        clearInterval(autoSlide);
        autoSlide = setInterval(nextHeroSlide, slideInterval);
      });
    });
    showHeroSlide(currentHero);
  }

  // ===== LIGHTBOX =====
  const galleryImages = document.querySelectorAll(".gallery-item img, .gallery-slide img, .story-img img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const closeBtn = document.querySelector(".lightbox .close");
  const nextLightbox = document.querySelector(".lightbox .next");
  const prevLightbox = document.querySelector(".lightbox .prev");
  let currentIndex = 0;

  function showLightbox(index) {
    if (!galleryImages[index]) return;
    currentIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightbox.classList.add("show");
  }

  galleryImages.forEach((img, i) => img.addEventListener("click", () => showLightbox(i)));
  closeBtn?.addEventListener("click", () => lightbox.classList.remove("show"));
  nextLightbox?.addEventListener("click", (e) => {
    e.stopPropagation();
    showLightbox((currentIndex + 1) % galleryImages.length);
  });
  prevLightbox?.addEventListener("click", (e) => {
    e.stopPropagation();
    showLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  });
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("show");
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("show")) return;
    if (e.key === "Escape") lightbox.classList.remove("show");
    if (e.key === "ArrowRight") showLightbox((currentIndex + 1) % galleryImages.length);
    if (e.key === "ArrowLeft") showLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
  });

  // ===== GALLERY SLIDER (Mobile) =====
  const slides = document.querySelectorAll(".gallery-slide");
  const nextBtn = document.querySelector(".gallery-slider .next");
  const prevBtn = document.querySelector(".gallery-slider .prev");
  let index = 0;

  function showSlide(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach(slide => slide.style.transform = `translateX(-${index * 100}%)`);
  }

  function initSlider() {
    if (!slides.length) return;
    showSlide(index);
    nextBtn?.addEventListener("click", () => showSlide(index + 1));
    prevBtn?.addEventListener("click", () => showSlide(index - 1));

    const slider = document.querySelector(".gallery-slider");
    let startX = 0, endX = 0;
    slider?.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
    slider?.addEventListener("touchmove", (e) => endX = e.touches[0].clientX);
    slider?.addEventListener("touchend", () => {
      if (startX - endX > 50) showSlide(index + 1);
      if (endX - startX > 50) showSlide(index - 1);
    });

    setInterval(() => showSlide(index + 1), 5000);
  }

  initSlider();
  window.addEventListener("resize", initSlider);

  // ===== STORY ANIMATION =====
  const storyItems = document.querySelectorAll(".story-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("show"); });
  }, { threshold: 0.3 });
  storyItems.forEach((item) => observer.observe(item));

  // ===== TIMELINE ANIMATION =====
  const timeline = document.querySelector(".vertical-timeline");
  const diamonds = document.querySelectorAll(".vertical-timeline .diamond");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        timeline.classList.add("active");
        diamonds[i]?.classList.add("active");
      } else {
        diamonds[i]?.classList.remove("active");
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((section) => sectionObserver.observe(section));

  // ===== WISH SYSTEM =====
  const wishesWrapper = document.querySelector(".wishes-wrapper");
  const wishesList = document.getElementById("wishesList");
  const contactForm = document.getElementById("contactForm");
  const modalContact = document.getElementById("contactModal");
  const openModalBtnContact = document.getElementById("openModalBtn");
  const closeModalContact = document.querySelector(".close-modal");
  const wishModal = document.getElementById("wishModal");
  const modalPhoto = document.getElementById("modalPhoto");
  const modalName = document.getElementById("modalName");
  const modalEmail = document.getElementById("modalEmail");
  const modalMessage = document.getElementById("modalMessage");
  const closeWishModal = wishModal?.querySelector(".close-modal");

  // ===== Open/Close Modals =====
  openModalBtnContact?.addEventListener("click", () => modalContact.style.display = "block");
  closeModalContact?.addEventListener("click", () => modalContact.style.display = "none");
  closeWishModal?.addEventListener("click", () => wishModal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === modalContact) modalContact.style.display = "none";
    if (e.target === wishModal) wishModal.style.display = "none";
  });

  // ===== Load Wishes =====
  async function loadWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = "";
    try {
      const res = await fetch("/api/wishes"); // ✅ Corrected API URL
      const wishes = await res.json();

      wishes.forEach((wish) => {
        const div = document.createElement("div");
        div.classList.add("wish-item");
        div.innerHTML = `
          ${wish.photo ? `<img src="${wish.photo}" class="wish-photo">` : ""}
          <div class="wish-content">
            <h4>${wish.fullName}</h4>
            <p><strong>Email:</strong> ${wish.email}</p>
            <p>${wish.message.length > 50 ? wish.message.substring(0, 50) + "..." : wish.message}</p>
          </div>
          <div class="wish-footer">
            <button class="like-btn">❤️ <span>${wish.likes || 0}</span></button>
          </div>
        `;

        // Open modal
        div.addEventListener("click", (e) => {
          if (e.target.classList.contains("like-btn")) return;
          modalPhoto.style.display = wish.photo ? "block" : "none";
          modalPhoto.src = wish.photo || "";
          modalName.textContent = wish.fullName;
          modalEmail.textContent = wish.email;
          modalMessage.textContent = wish.message;
          wishModal.style.display = "block";
        });

        // Like button
        const likeBtn = div.querySelector(".like-btn");
        likeBtn?.addEventListener("click", async (e) => {
          e.stopPropagation();
          try {
            await fetch(`/api/wishes/${wish.id}/like`, { method: "POST" }); // ✅ Corrected API URL
            loadWishes();
            createFloatingHeart(likeBtn);
          } catch (err) {
            console.error("Failed to like wish:", err);
          }
        });

        wishesList.appendChild(div);
      });
    } catch (err) {
      console.error("Failed to load wishes:", err);
    }
  }

  // ===== Submit New Wish =====
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = contactForm.fullName.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.wishes.value.trim();
    const photoInput = contactForm.photo?.files[0];
    if (!fullName || !email || !message) return;

    async function saveWishServer(photoData) {
      try {
        await fetch("/api/wishes", { // ✅ Corrected API URL
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, email, message, photo: photoData })
        });
        loadWishes();
        modalContact.style.display = "none";
        contactForm.reset();
      } catch (err) {
        console.error("Failed to save wish:", err);
      }
    }

    if (photoInput) {
      const reader = new FileReader();
      reader.onload = (e) => saveWishServer(e.target.result);
      reader.readAsDataURL(photoInput);
    } else {
      saveWishServer(null);
    }
  });

  // ===== Swipeable Wishes =====
  if (wishesWrapper) {
    let wishStartX = 0, wishScrollLeft = 0;
    wishesWrapper.addEventListener("touchstart", e => {
      wishStartX = e.touches[0].pageX - wishesWrapper.offsetLeft;
      wishScrollLeft = wishesWrapper.scrollLeft;
    });
    wishesWrapper.addEventListener("touchmove", e => {
      const x = e.touches[0].pageX - wishesWrapper.offsetLeft;
      const walk = wishStartX - x;
      wishesWrapper.scrollLeft = wishScrollLeft + walk;
    });
  }

  // ===== Floating Hearts Animation =====
  function createFloatingHeart(button) {
    if (!button) return;
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";
    heart.style.position = "absolute";

    const rect = button.getBoundingClientRect();
    heart.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
    heart.style.top = `${rect.top - 10 + window.scrollY}px`;
    heart.style.fontSize = "20px";
    heart.style.opacity = 1;
    heart.style.pointerEvents = "none";
    heart.style.transition = "transform 1s ease-out, opacity 1s ease-out";
    heart.style.transform = "translate(-50%, 0) scale(1)";
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.style.transform = "translate(-50%, -60px) scale(1.5)";
      heart.style.opacity = 0;
    }, 50);

    setTimeout(() => heart.remove(), 1000);
  }

  // ===== INIT =====
  loadWishes();
});
