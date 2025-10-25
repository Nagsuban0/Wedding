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
      if (window.pageYOffset >= sectionTop) current = section.getAttribute("id");
    });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) a.classList.add("active");
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
      if (entry.isIntersecting) entry.target.classList.add("show");
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

  // ===== Supabase Setup =====

const supabaseUrl = 'https://eqkcemfxrctyurjiumyu.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa2NlbWZ4cmN0eXVyaml1bXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMzYwNjAsImV4cCI6MjA3NjkxMjA2MH0.1AyCYga_ph9VTO-N3NJHuLU8SyvFwhE5zrK7GCJo8MQ"
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

  // ===== Wish System =====
  const wishForm     = document.getElementById("wishForm");
  const wishesList   = document.getElementById("wishesList");
  const openWishBtn  = document.getElementById("openModalBtn");
  const formModal    = document.getElementById("wishModalForm");

  const closeFormModal   = formModal?.querySelector(".close-modal");

  openWishBtn?.addEventListener("click", () => formModal.style.display = "block");
  closeFormModal?.addEventListener("click", () => formModal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === formModal) formModal.style.display = "none";
  });

  // Floating Heart
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

  // ===== Load Wishes from Supabase =====
  async function loadWishes() {
    if (!wishesList) return;
    wishesList.innerHTML = "<p>Loading wishes…</p>";
    try {
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        wishesList.innerHTML = "<p>No wishes yet. Be the first to send one!</p>";
        return;
      }

      wishesList.innerHTML = "";
      data.forEach((wish) => {
        const div = document.createElement("div");
        div.classList.add("wish-item");

        const photoHTML = wish.photo
          ? `<img src="${wish.photo}" class="wish-photo" alt="Wish photo">`
          : "";

        const shortMessage = wish.message.length > 60
          ? wish.message.substring(0, 60) + "..."
          : wish.message;

        div.innerHTML = `
          ${photoHTML}
          <div class="wish-content">
            <h4>${wish.full_name}</h4>
            <p>${shortMessage}</p>
          </div>
          <div class="wish-footer">
            <button class="like-btn">❤️ <span>${wish.likes || 0}</span></button>
          </div>
        `;

        wishesList.appendChild(div);

        const likeBtn = div.querySelector(".like-btn");
        likeBtn?.addEventListener("click", async () => {
          const currentLikes = parseInt(likeBtn.querySelector("span").textContent) || 0;
          likeBtn.querySelector("span").textContent = currentLikes + 1;
          createFloatingHeart(likeBtn);

          await supabase
            .from('wishes')
            .update({ likes: currentLikes + 1 })
            .eq('id', wish.id);
        });
      });
    } catch (err) {
      console.error(err);
      wishesList.innerHTML = "<p>Failed to load wishes.</p>";
    }
  }

  loadWishes();

  // ===== Submit Wish =====
  wishForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(wishForm);
    const fullName = formData.get("fullName");
    const email    = formData.get("email");
    const message  = formData.get("message");
    const file     = formData.get("photo");

    let photoUrl = null;

    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('wishes-photos')
        .upload(fileName, file);

      if (!uploadError) {
        const { publicUrl } = supabase.storage.from('wishes-photos').getPublicUrl(fileName);
        photoUrl = publicUrl;
      }
    }

    try {
      await supabase.from('wishes').insert([{ full_name: fullName, email, message, photo: photoUrl, likes: 0 }]);
      wishForm.reset();
      formModal.style.display = "none";
      loadWishes();
      alert("Your wish has been submitted! 🎉");
    } catch (err) {
      console.error(err);
      alert("Failed to submit your wish. Please try again.");
    }
  });
});
