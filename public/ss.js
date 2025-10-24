document.addEventListener("DOMContentLoaded", () => {
  // ===== Dark mode toggle =====
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;
  darkModeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    darkModeToggle.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });

  // ===== Hamburger menu toggle =====
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

  // ===== Highlight active nav link on scroll =====
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 70;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) {
        a.classList.add("active");
      }
    });
  });

  // ===== Hero Slider =====
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

  // ===== Lightbox =====
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

  galleryImages.forEach((img, i) => {
    img.addEventListener("click", () => showLightbox(i));
  });
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

  // ===== Gallery Slider (Mobile) =====
  const slides = document.querySelectorAll(".gallery-slide");
  const nextBtn = document.querySelector(".gallery-slider .next");
  const prevBtn = document.querySelector(".gallery-slider .prev");
  let index = 0;
  let startX = 0;
  let endX = 0;
  let sliderInterval;

  function showSlide(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach((slide) => slide.style.transform = `translateX(-${index * 100}%)`);
  }

  function initSlider() {
    if (!slides.length) return;
    showSlide(index);
    nextBtn?.addEventListener("click", () => showSlide(index + 1));
    prevBtn?.addEventListener("click", () => showSlide(index - 1));
    const slider = document.querySelector(".gallery-slider");
    slider?.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
    slider?.addEventListener("touchmove", (e) => endX = e.touches[0].clientX);
    slider?.addEventListener("touchend", () => {
      if (startX - endX > 50) showSlide(index + 1);
      if (endX - startX > 50) showSlide(index - 1);
    });
    sliderInterval = setInterval(() => showSlide(index + 1), 5000);
  }

  initSlider();
  window.addEventListener("resize", initSlider);

  // ===== Story Section Scroll Animation =====
  const storyItems = document.querySelectorAll(".story-item");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.3 });
  storyItems.forEach((item) => observer.observe(item));

  // ===== Timeline & Diamonds Animation =====
  const timeline = document.querySelector(".vertical-timeline");
  const diamonds = document.querySelectorAll(".vertical-timeline .diamond");
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        timeline.classList.add("active");
        if (diamonds[i]) diamonds[i].classList.add("active");
      } else {
        if (diamonds[i]) diamonds[i].classList.remove("active");
      }
    });
  }, { threshold: 0.4 });
  sections.forEach((section) => sectionObserver.observe(section));

  // ===== Wish System =====
  const wishForm     = document.getElementById("wishForm");
  const wishesList   = document.getElementById("wishesList");
  const openWishBtn  = document.getElementById("openModalBtn");
  const formModal    = document.getElementById("wishModalForm");
  const detailModal  = document.getElementById("wishDetailModal");

  const modalPhoto   = document.getElementById("modalPhoto");
  const modalName    = document.getElementById("modalName");
  const modalEmail   = document.getElementById("modalEmail");
  const modalMessage = document.getElementById("modalMessage");

  const closeFormModal   = formModal?.querySelector(".close-modal");
  const closeDetailModal = detailModal?.querySelector(".close-modal");

  openWishBtn?.addEventListener("click", () => formModal.style.display = "block");
  closeFormModal?.addEventListener("click", () => formModal.style.display = "none");
  closeDetailModal?.addEventListener("click", () => detailModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === formModal)   formModal.style.display   = "none";
    if (e.target === detailModal) detailModal.style.display = "none";
  });

  // ===== Load Wishes =====
async function loadWishes() {
  if (!wishesList) return;
  wishesList.innerHTML = "<p>Loading wishes…</p>";
  try {
    const res = await fetch("https://wedding-ncdk.vercel.app/api/wishes");

    if (!res.ok) {
      console.error("Server responded with error:", res.status, await res.text());
      wishesList.innerHTML = "<p>Failed to load wishes.</p>";
      return;
    }

    let wishes;
    try {
      wishes = await res.json();
    } catch(jsonErr) {
      console.error("Invalid JSON from server:", await res.text());
      wishesList.innerHTML = "<p>Failed to load wishes (invalid data).</p>";
      return;
    }

    if (!Array.isArray(wishes) || wishes.length === 0) {
      wishesList.innerHTML = "<p>No wishes yet. Be the first to send one!</p>";
      return;
    }

    wishesList.innerHTML = "";
    wishes.forEach((wish) => {
      const div = document.createElement("div");
      div.classList.add("wish-item");
      div.innerHTML = `
        ${wish.photo ? `<img src="${wish.photo}" class="wish-photo">` : ""}
        <div class="wish-content">
          <h4>${wish.fullName}</h4>
          <p><strong>Email:</strong> ${wish.email}</p>
          <p>${wish.message.length > 60 ? wish.message.substring(0, 60) + "..." : wish.message}</p>
        </div>
        <div class="wish-footer">
          <button class="like-btn">❤️ <span>${wish.likes || 0}</span></button>
        </div>
      `;
      wishesList.appendChild(div);
    });

  } catch(err) {
    console.error("Failed to load wishes:", err);
    wishesList.innerHTML = "<p>Failed to load wishes.</p>";
  }
}


  // ===== Floating Heart Animation =====
  function createFloatingHeart(button) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = "❤️";
    const rect = button.getBoundingClientRect();
    heart.style.left = `${rect.left + rect.width/2}px`;
    heart.style.top  = `${rect.top - 10}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
  }

  // ===== Submit Wish =====
  wishForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(wishForm);
    const data = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      message: formData.get("message"),
      photo: formData.get("photo")
    };
    try {
      const res = await fetch("https://wedding-ncdk.vercel.app/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to submit wish");
      alert("Wish sent successfully! ❤️");
      wishForm.reset();
      formModal.style.display = "none";
      loadWishes(); // refresh wish list
    } catch(err) {
      console.error(err);
      alert("Failed to send wish. Please try again.");
    }
  });

  loadWishes();
});
