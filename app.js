/**
 * PLAN 21 DIAS FIT - INTERACTIVE INTERFACE SCRIPTS
 * Author: Antigravity AI
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initRecipeFilter();
  initCategoryPills();
  initTestimonialSlider();
  initStickyCta();
  initUrgencyCounter();
});

/**
 * 1. FAQ Accordion Toggle
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentNode;
      const isActive = item.classList.contains('active');
      
      // Close all other FAQ items for a clean accordion effect
      document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * 2. Recipe Showcase Category Filter
 */
function initRecipeFilter() {
  const filterTabs = document.querySelectorAll('.recipe-tab');
  const recipeCards = document.querySelectorAll('.recipe-card');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');
      
      // Update active tab class
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter recipe cards
      recipeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        // Match logic
        if (filterValue === 'all') {
          card.style.display = 'block';
          // Trigger slight fade-in animation
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else if (category === filterValue) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 3. Link Category Pills to Recipe Tabs
 */
function initCategoryPills() {
  const categoryLinks = document.querySelectorAll('.category-pill-link');
  
  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const category = link.getAttribute('data-category');
      
      // Map display name to filter value
      let filterValue = 'all';
      if (category === 'desayunos') filterValue = 'breakfast';
      else if (category === 'almuerzos') filterValue = 'lunch';
      else if (category === 'cenas') filterValue = 'dinner';
      else if (category === 'snacks') filterValue = 'snacks';
      
      // Find the corresponding recipe tab and trigger a click
      const targetTab = document.querySelector(`.recipe-tab[data-filter="${filterValue}"]`);
      if (targetTab) {
        targetTab.click();
      }
    });
  });
}

/**
 * 4. Responsive Testimonial Slider
 */
function initTestimonialSlider() {
  const slider = document.getElementById('testimonial-slider');
  const cards = slider.querySelectorAll('.testimonial-card');
  const dotsContainer = document.getElementById('slider-dots');
  
  if (!slider || cards.length === 0 || !dotsContainer) return;

  let cardsPerPage = getCardsPerPage();
  let totalPages = Math.ceil(cards.length / cardsPerPage);
  let currentPage = 0;
  
  // Build navigation dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    totalPages = Math.ceil(cards.length / cardsPerPage);
    
    // If only 1 page, no need for dots
    if (totalPages <= 1) return;
    
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      
      dot.addEventListener('click', () => {
        goToPage(i);
      });
      dotsContainer.appendChild(dot);
    }
  }
  
  function goToPage(pageIndex) {
    currentPage = pageIndex;
    
    // Update active dot
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === pageIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });
    
    // In desktop grid layout, we can translate the slider or toggle visibilities
    // Since we are using CSS Grid, translating the slider is easiest if it's set to flex,
    // or we can simply hide cards that are not in the current page view.
    if (window.innerWidth > 992) {
      // Desktop: show cards depending on index
      cards.forEach((card, index) => {
        const start = pageIndex * cardsPerPage;
        const end = start + cardsPerPage;
        if (index >= start && index < end) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    } else {
      // Mobile/Tablet: single card translation or simple show/hide
      cards.forEach((card, index) => {
        if (index === pageIndex) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    }
  }

  function getCardsPerPage() {
    if (window.innerWidth > 992) return 3; // Desktop: 3 cards
    return 1; // Tablet/Mobile: 1 card
  }

  // Handle window resizing
  window.addEventListener('resize', () => {
    const prevCardsPerPage = cardsPerPage;
    cardsPerPage = getCardsPerPage();
    
    if (prevCardsPerPage !== cardsPerPage) {
      // Reset cards visibility
      cards.forEach(card => card.style.display = 'flex');
      currentPage = 0;
      buildDots();
      goToPage(0);
    }
  });

  // Initial build
  buildDots();
  goToPage(0);
}

/**
 * 5. Mobile Sticky CTA Bar Show/Hide
 */
function initStickyCta() {
  const stickyBar = document.getElementById('floating-mobile-bar');
  const heroSection = document.getElementById('hero');
  
  if (!stickyBar) return;
  
  window.addEventListener('scroll', () => {
    // Show sticky bar only on mobile/tablet (width <= 992px)
    if (window.innerWidth <= 992) {
      const heroHeight = heroSection.offsetHeight;
      const scrollY = window.scrollY;
      
      // If user scrolled past the hero section, show sticky bar
      if (scrollY > heroHeight - 100) {
        stickyBar.style.display = 'block';
      } else {
        stickyBar.style.display = 'none';
      }
    } else {
      stickyBar.style.display = 'none';
    }
  });
}

/**
 * 6. Dynamic Scarcity Spots Count Updates
 */
function initUrgencyCounter() {
  const spotsElement = document.getElementById('spots-count');
  if (!spotsElement) return;
  
  let currentSpots = 12;
  
  // Set a random countdown to simulate real purchases
  const minSpots = 3;
  
  function decreaseSpots() {
    if (currentSpots > minSpots) {
      // Randomly decrease by 1 or 2
      const decreaseBy = Math.random() > 0.6 ? 2 : 1;
      currentSpots = Math.max(minSpots, currentSpots - decreaseBy);
      spotsElement.textContent = currentSpots;
      
      // Add a small highlight pulse to notice the change
      spotsElement.style.color = '#ff5a5f';
      spotsElement.style.transform = 'scale(1.3)';
      spotsElement.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        spotsElement.style.color = '';
        spotsElement.style.transform = '';
      }, 800);
    }
    
    // Set next timeout between 15 and 45 seconds
    const nextInterval = (Math.random() * 30 + 15) * 1000;
    setTimeout(decreaseSpots, nextInterval);
  }
  
  // First decrease after 20 seconds
  setTimeout(decreaseSpots, 20000);
}
