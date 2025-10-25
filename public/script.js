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

 // ==============================
// 1️⃣ Initialize Supabase
// ==============================
const supabaseUrl = 'https://eqkcemfxrctyurjiumyu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxa2NlbWZ4cmN0eXVyaml1bXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMzYwNjAsImV4cCI6MjA3NjkxMjA2MH0.1AyCYga_ph9VTO-N3NJHuLU8SyvFwhE5zrK7GCJo8MQ'; // Replace with your actual anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ==============================
// 2️⃣ DOM Elements
// ==============================
const openModalBtn = document.getElementById('openModalBtn');
const wishModal = document.getElementById('wishModalForm');
const closeModalBtns = document.querySelectorAll('.close-modal');
const wishForm = document.getElementById('wishForm');
const wishesList = document.getElementById('wishesList');

// Modal detail view
const wishDetailModal = document.getElementById('wishDetailModal');
const modalPhoto = document.getElementById('modalPhoto');
const modalName = document.getElementById('modalName');
const modalEmail = document.getElementById('modalEmail');
const modalMessage = document.getElementById('modalMessage');

// ==============================
// 3️⃣ Modal Open/Close
// ==============================
openModalBtn.addEventListener('click', () => {
  wishModal.style.display = 'block';
});

closeModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').style.display = 'none';
  });
});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
  }
});

// ==============================
// 4️⃣ Submit Wish Form
// ==============================
wishForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const wishes = document.getElementById('wishes').value;
  const photoInput = document.getElementById('photo');
  let photoUrl = null;

  // Upload photo if exists
  if (photoInput.files.length > 0) {
    const file = photoInput.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('wishes-photos') // Make sure your bucket exists
      .upload(fileName, file);

    if (error) {
      console.error('Photo upload error:', error);
    } else {
      photoUrl = `${supabaseUrl}/storage/v1/object/public/wishes-photos/${fileName}`;
    }
  }

  // Insert wish into Supabase
  const { data, error } = await supabase
    .from('wishes')
    .insert([{ fullName, email, wishes, photoUrl }]);

  if (error) {
    console.error('Insert error:', error);
  } else {
    alert('Your wish has been sent! 🎉');
    wishForm.reset();
    wishModal.style.display = 'none';
    loadWishes(); // Refresh wishes list
  }
});

// ==============================
// 5️⃣ Load Wishes
// ==============================
async function loadWishes() {
  const { data: wishes, error } = await supabase
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  wishesList.innerHTML = wishes
    .map(wish => `
      <div class="wish-item" data-id="${wish.id}">
        ${wish.photoUrl ? `<img src="${wish.photoUrl}" alt="${wish.fullName}" class="wish-thumb">` : ''}
        <h4>${wish.fullName}</h4>
        <p>${wish.wishes}</p>
      </div>
    `).join('');

  // Add click event to show detail modal
  document.querySelectorAll('.wish-item').forEach(item => {
    item.addEventListener('click', () => {
      const wishId = item.dataset.id;
      const wish = wishes.find(w => w.id == wishId);
      modalPhoto.src = wish.photoUrl || '';
      modalName.textContent = wish.fullName;
      modalEmail.textContent = wish.email;
      modalMessage.textContent = wish.wishes;
      wishDetailModal.style.display = 'block';
    });
  });
}

// Initial load
loadWishes();