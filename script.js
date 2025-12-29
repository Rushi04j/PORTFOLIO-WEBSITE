/**
 * Main JavaScript File
 * Professional Animated Portfolio
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create page loader element
  createPageLoader();

  // Initialize AOS (Animate on Scroll)
  if (typeof AOS === "undefined") {
    window.AOS = {
      init: () => {},
    }
  }

  // Initialize particlesJS
  if (typeof particlesJS === "undefined") {
    window.particlesJS = () => {}
  }

  // Initialize all components
  setupThemeToggle();
  setupCustomCursor();
  setupMobileNav();
  setupParticles();
  setupTypingEffect();
  setupScrollAnimation();
  setupFilterButtons();
  setupContactForm();
  setupScrollSpy();
  setupThemeSelector();
  setupCounterAnimation();
  setupAIChat();
  setupSectionAnimations();
  setupCardTilt();

  // Initialize AOS (Animate on Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  // Simulate page loading
  setTimeout(() => {
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
      pageLoader.classList.add('loaded');
      setTimeout(() => {
        pageLoader.remove();
      }, 500);
    }
  }, 1500);
});

/**
 * Create Page Loader
 */
function createPageLoader() {
  const pageLoader = document.createElement('div');
  pageLoader.className = 'page-loader';
  pageLoader.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(pageLoader);
}

/**
 * Section Animations on Scroll
 */
function setupSectionAnimations() {
  const sections = document.querySelectorAll('.section');
  
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.75 &&
      rect.bottom >= 0
    );
  };
  
  const checkSections = () => {
    sections.forEach(section => {
      if (isInViewport(section)) {
        section.classList.add('in-view');
      }
    });
  };
  
  window.addEventListener('scroll', checkSections);
  checkSections();
}

/**
 * 3D Card Tilt Effect
 */
function setupCardTilt() {
  const cards = document.querySelectorAll('.project-card, .leadership-card, .timeline-card, .publication-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const cardRect = card.getBoundingClientRect();
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;
      
      const centerX = cardRect.width / 2;
      const centerY = cardRect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });
}

/**
 * Theme Toggle Functionality
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  if (!themeToggle) return;

  // Check if user has a saved preference
  const currentTheme = localStorage.getItem("theme");

  // Apply saved theme or default to system preference
  if (currentTheme) {
    body.classList.toggle("dark-theme", currentTheme === "dark");
    themeToggle.checked = currentTheme === "dark";
  } else {
    // Check for user's system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
      body.classList.add("dark-theme");
      themeToggle.checked = true;
      localStorage.setItem("theme", "dark");
    }
  }

  // Toggle theme when the checkbox changes
  themeToggle.addEventListener("change", () => {
    const isDarkMode = themeToggle.checked;
    body.classList.toggle("dark-theme", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Show toast notification
    showToast(
      isDarkMode ? "Dark theme activated" : "Light theme activated",
      isDarkMode ? "Enjoy your eyes in the dark!" : "Welcome to the light side!",
      isDarkMode ? "moon" : "sun",
      "info",
    );

    // Update particles color based on theme
    updateParticlesColor(isDarkMode);
  });
}

/**
 * Theme Selector Modal
 */
function setupThemeSelector() {
  const themeModal = document.getElementById("themeSelectorModal");
  const themeOptions = document.querySelectorAll(".theme-option");
  const closeBtn = document.querySelector(".theme-close-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const themeBtn = document.querySelector(".theme-selector-btn");
  const body = document.body;

  if (!themeModal || !themeOptions.length || !closeBtn || !themeBtn) return;

  // Open theme selector modal
  themeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    themeModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Set active theme
    const currentTheme = localStorage.getItem("theme") || "system";
    themeOptions.forEach((option) => {
      option.classList.toggle("active", option.dataset.theme === currentTheme);
    });
  });

  // Close theme selector modal
  closeBtn.addEventListener("click", () => {
    themeModal.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close modal when clicking outside
  themeModal.addEventListener("click", (e) => {
    if (e.target === themeModal) {
      themeModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Theme option selection
  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const theme = option.dataset.theme;

      // Remove active class from all options
      themeOptions.forEach((opt) => opt.classList.remove("active"));

      // Add active class to selected option
      option.classList.add("active");

      // Apply theme
      if (theme === "light") {
        body.classList.remove("dark-theme");
        themeToggle.checked = false;
        localStorage.setItem("theme", "light");
        showToast("Light theme activated", "Welcome to the light side!", "sun", "info");
        updateParticlesColor(false);
      } else if (theme === "dark") {
        body.classList.add("dark-theme");
        themeToggle.checked = true;
        localStorage.setItem("theme", "dark");
        showToast("Dark theme activated", "Enjoy your eyes in the dark!", "moon", "info");
        updateParticlesColor(true);
      } else if (theme === "system") {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        body.classList.toggle("dark-theme", prefersDarkScheme.matches);
        themeToggle.checked = prefersDarkScheme.matches;
        localStorage.setItem("theme", "system");
        showToast("System theme activated", "Following your system preferences", "laptop", "info");
        updateParticlesColor(prefersDarkScheme.matches);

        // Listen for system theme changes
        prefersDarkScheme.addEventListener("change", (e) => {
          if (localStorage.getItem("theme") === "system") {
            body.classList.toggle("dark-theme", e.matches);
            themeToggle.checked = e.matches;
            updateParticlesColor(e.matches);
          }
        });
      }

      // Close modal
      setTimeout(() => {
        themeModal.classList.remove("active");
        document.body.style.overflow = "";
      }, 500);
    });
  });
}

/**
 * Toast Notifications
 */
function showToast(title, message, icon, type = "info") {
  const toastContainer = document.getElementById("toastContainer");

  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type} glassmorphism`;

  toast.innerHTML = `
  <div class="toast-icon">
    <i class="fas fa-${icon}"></i>
  </div>
  <div class="toast-content">
    <h4 class="toast-title">${title}</h4>
    <p class="toast-message">${message}</p>
  </div>
  <button class="toast-close">
    <i class="fas fa-times"></i>
  </button>
`;

  toastContainer.appendChild(toast);

  // Add haptic feedback if available
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }

  // Close toast on click
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    toast.style.animation = "fadeOut 0.3s forwards";
    setTimeout(() => {
      if (toast.parentElement) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  });

  // Auto remove toast after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = "fadeOut 0.3s forwards";
      setTimeout(() => {
        if (toast.parentElement) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
}

/**
 * Counter Animation
 */
function setupCounterAnimation() {
  const counters = document.querySelectorAll(".counter");

  if (!counters.length) return;

  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0;
  }

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.getAttribute("data-count"));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
        if (target === 1) {
          counter.textContent = target + "+";
        } else {
          counter.textContent = target + "+";
        }
      }
    }

    updateCounter();
  }

  // Use Intersection Observer instead of scroll event
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
        entry.target.classList.add("animated");
        setTimeout(() => {
          animateCounter(entry.target);
        }, 300);
      }
    });
  }, { threshold: 0.1 });

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

/**
 * Custom Cursor
 */
function setupCustomCursor() {
  const cursor = document.querySelector(".cursor");
  const cursorFollower = document.querySelector(".cursor-follower");

  if (!cursor || !cursorFollower) return;
  
  // Store the current position to calculate velocity
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  
  const animateCursor = () => {
    const easeAmount = 0.2;
    
    // Calculate distance between current and target
    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;
    
    // Update current position with easing
    currentX += deltaX * easeAmount;
    currentY += deltaY * easeAmount;
    
    // Apply to cursor
    cursor.style.left = `${currentX}px`;
    cursor.style.top = `${currentY}px`;
    
    // Apply with delay to follower
    cursorFollower.style.left = `${currentX}px`;
    cursorFollower.style.top = `${currentY}px`;
    
    // Calculate velocity for size changes
    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.05;
    
    // Clamp velocity between 0.8 and 1.2 for subtle size changes
    const sizeMultiplier = Math.max(0.8, Math.min(1.2, 1 + velocity * 0.01));
    
    // Apply subtle size changes based on velocity
    cursor.style.transform = `translate(-50%, -50%) scale(${sizeMultiplier})`;
    
    requestAnimationFrame(animateCursor);
  };
  
  // Start animation loop
  animateCursor();

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(0.8)";
  });

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
  });

  // Add hover effects for interactive elements with categories
  const interactiveElements = {
    links: document.querySelectorAll('a, .social-link, .btn'),
    buttons: document.querySelectorAll('button, .filter-btn, .theme-option'),
    inputs: document.querySelectorAll('input, textarea')
  };

  // Different effects based on element type
  Object.entries(interactiveElements).forEach(([type, elements]) => {
    elements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        switch(type) {
          case 'links':
            cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
            cursor.style.opacity = "0.5";
            cursorFollower.style.transform = "translate(-50%, -50%) scale(1.8)";
            cursorFollower.style.backgroundColor = "rgba(0, 247, 255, 0.15)";
            cursorFollower.style.borderWidth = "0px";
            break;
          case 'buttons':
            cursor.style.transform = "translate(-50%, -50%) scale(1.2)";
            cursor.style.opacity = "0.6";
            cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)";
            cursorFollower.style.backgroundColor = "rgba(247, 37, 133, 0.1)";
            cursorFollower.style.borderWidth = "0px";
            break;
          case 'inputs':
            cursor.style.transform = "translate(-50%, -50%) scale(1.3)";
            cursor.style.opacity = "0.6";
            cursorFollower.style.transform = "translate(-50%, -50%) scale(2)";
            cursorFollower.style.backgroundColor = "rgba(114, 9, 183, 0.1)";
            cursorFollower.style.borderWidth = "0px";
            break;
        }
      });

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.opacity = "0.75";
        cursorFollower.style.transform = "translate(-50%, -50%) scale(1)";
        cursorFollower.style.backgroundColor = "transparent";
        cursorFollower.style.borderWidth = "2px";
      });
    });
  });
}

/**
 * Mobile Navigation
 */
function setupMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-list");
  const navItems = document.querySelectorAll(".nav-link");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {
      document.body.style.overflow = "hidden";
      
      // Animate nav items with delay
      navItems.forEach((item, index) => {
        item.style.transform = "translateY(20px)";
        item.style.opacity = "0";
        item.style.transition = `all 0.3s ease ${index * 0.07}s`;
        
        setTimeout(() => {
          item.style.transform = "translateY(0)";
          item.style.opacity = "1";
        }, 10);
      });
    } else {
      document.body.style.overflow = "";
      
      // Reset nav items
      navItems.forEach((item) => {
        item.style.transform = "";
        item.style.opacity = "";
        item.style.transition = "";
      });
    }
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

/**
 * Particles Background
 */
function setupParticles() {
  const particlesContainer = document.getElementById("particles-js");

  if (!particlesContainer || typeof particlesJS === "undefined") return;

  const isDarkTheme = document.body.classList.contains("dark-theme");

  updateParticlesConfig(isDarkTheme);
}

function updateParticlesColor(isDarkTheme) {
  if (typeof particlesJS === "undefined") return;

  updateParticlesConfig(isDarkTheme);
}

function updateParticlesConfig(isDarkTheme) {
  const particlesConfig = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: isDarkTheme ? "#00f7ff" : "#00f7ff",
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: isDarkTheme ? "#00f7ff" : "#00f7ff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200
        }
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "bubble",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 150,
          size: 12,
          duration: 2,
          opacity: 0.8,
          speed: 3
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2
        }
      },
    },
    retina_detect: true,
  }

  particlesJS("particles-js", particlesConfig);
}

/**
 * Typing Effect
 */
function setupTypingEffect() {
  const typingElement = document.querySelector(".typing-text");
  const cursorElement = document.querySelector(".typing-cursor");

  if (!typingElement || !cursorElement) return;

  const textList = ["Web Developer", "Software Engineer", "UI/UX Designer", "Problem Solver", "AI/ML Enthusiast"];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isWaiting = false;

  function type() {
    const currentText = textList[textIndex];

    // Calculate random typing/deleting speed variation for more realistic effect
    const speed = isDeleting 
      ? 50 + Math.random() * 40  // Delete speed (50-90ms)
      : 100 + Math.random() * 80; // Type speed (100-180ms)

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        isWaiting = true;
        setTimeout(() => {
          isWaiting = false;
          textIndex = (textIndex + 1) % textList.length;
        }, 500);
      }

      setTimeout(type, speed);
    } else if (isWaiting) {
      setTimeout(type, 100);
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentText.length) {
        isWaiting = true;
        setTimeout(() => {
          isWaiting = false;
          isDeleting = true;
        }, 1500);
      }

      setTimeout(type, speed);
    }
  }

  setTimeout(type, 1000);

  setInterval(() => {
    cursorElement.style.opacity = cursorElement.style.opacity === "0" ? "1" : "0";
  }, 500);
}

/**
 * Scroll Animation
 */
function setupScrollAnimation() {
  const header = document.querySelector(".header");

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  const skillLevels = document.querySelectorAll(".skill-level");
  const skillsSection = document.getElementById("skills");

  if (skillLevels.length > 0 && skillsSection) {
    // Use Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        skillLevels.forEach((level, index) => {
          const width = level.style.width;
          level.style.width = "0";
          setTimeout(() => {
            level.style.width = width;
          }, 100 + index * 50); // Staggered animation
        });
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    
    observer.observe(skillsSection);
  }

  // Smooth scroll with easing function
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        // Easing function for smoother animation
        const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        const animate = (currentTime) => {
          if (start === null) start = currentTime;
          const timeElapsed = currentTime - start;
          const run = easeInOutQuad(Math.min(timeElapsed / duration, 1)) * distance;
          window.scrollTo(0, startPosition + run);
          if (timeElapsed < duration) requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
      }
    });
  });
}

/**
 * Filter Buttons
 */
function setupFilterButtons() {
  // Skills Filter
  const skillsFilterButtons = document.querySelectorAll(".skills-filter .filter-btn");
  const skillItems = document.querySelectorAll(".skill-item");

  if (skillsFilterButtons.length > 0 && skillItems.length > 0) {
    skillsFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        skillsFilterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        // Staggered animations
        skillItems.forEach((item, index) => {
          const delay = index * 50; // 50ms delay between each item
          
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            // First hide all items
            item.style.transform = "translateY(20px)";
            item.style.opacity = "0";
            
            // Then show relevant ones with delay
            setTimeout(() => {
              item.style.display = "block";
              setTimeout(() => {
                item.style.transform = "translateY(0)";
                item.style.opacity = "1";
              }, 50);
            }, delay);
          } else {
            // Hide items smoothly
            item.style.transform = "translateY(20px)";
            item.style.opacity = "0";
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }

  // Projects Filter
  const projectsFilterButtons = document.querySelectorAll(".projects-filter .filter-btn");
  const projectItems = document.querySelectorAll(".project-card");

  if (projectsFilterButtons.length > 0 && projectItems.length > 0) {
    projectsFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        projectsFilterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        // Staggered animations
        projectItems.forEach((item, index) => {
          const delay = index * 50; // 50ms delay between each item
          
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            // First hide all items
            item.style.transform = "translateY(20px)";
            item.style.opacity = "0";
            
            // Then show relevant ones with delay
            setTimeout(() => {
              item.style.display = "block";
              setTimeout(() => {
                item.style.transform = "translateY(0)";
                item.style.opacity = "1";
              }, 50);
            }, delay);
          } else {
            // Hide items smoothly
            item.style.transform = "translateY(20px)";
            item.style.opacity = "0";
            setTimeout(() => {
              item.style.display = "none";
            }, 300);
          }
        });
      });
    });
  }
}

/**
 * Contact Form
 */
/**
 * Contact Form with EmailJS
 */
function setupContactForm() {
  const contactForm = document.getElementById("contact-form");
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
  const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

  if (!contactForm) return;

  // Initialize EmailJS (Replace with your actual Public Key from EmailJS dashboard)
  emailjs.init("YOUR_PUBLIC_KEY_HERE"); 

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    let isValid = true;

    // Validation
    if (!nameInput.value.trim()) {
      showError(nameInput, "Please enter your name");
      isValid = false;
    } else {
      removeError(nameInput);
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, "Please enter your email");
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address");
      isValid = false;
    } else {
      removeError(emailInput);
    }

    if (!subjectInput.value.trim()) {
      showError(subjectInput, "Please enter a subject");
      isValid = false;
    } else {
      removeError(subjectInput);
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, "Please enter your message");
      isValid = false;
    } else {
      removeError(messageInput);
    }

    if (isValid) {
      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending</span><span class="typing-dots"><span></span><span></span><span></span></span>';
      }

      // Prepare parameters for EmailJS
      const templateParams = {
        from_name: nameInput.value,
        from_email: emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value,
        to_name: "Rushikesh" 
      };

      // Send email
      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values
      emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
        .then(() => {
          if (submitBtn) {
            submitBtn.innerHTML = '<span>Sent!</span> <i class="fas fa-check"></i>';
          }
          
          showToast("Message Sent!", "Thanks for reaching out. I'll get back to you soon.", "check-circle", "success");
          
          // Reset form with animation
          const formInputs = contactForm.querySelectorAll('.form-input');
          formInputs.forEach((input, index) => {
            setTimeout(() => {
              input.style.transition = "transform 0.3s ease, opacity 0.3s ease";
              input.style.opacity = "0.5";
              input.style.transform = "translateX(10px)";
              
              setTimeout(() => {
                input.value = "";
                input.style.opacity = "1";
                input.style.transform = "translateX(0)";
              }, 300);
            }, index * 100);
          });

          // Reset button
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.innerHTML = originalBtnContent;
              submitBtn.disabled = false;
            }
          }, 2000);
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          showToast("Sending Failed", "Something went wrong. Please check your internet connection or try again later.", "times-circle", "error");
          
          if (submitBtn) {
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
          }
        });
    }
  });

  // Add focus animations
  const formInputs = contactForm.querySelectorAll('.form-input');
  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      const formGroup = input.parentElement;
      formGroup.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      const formGroup = input.parentElement;
      if (!input.value.trim()) {
        formGroup.classList.remove('focused');
      }
    });
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
  const formGroup = input.parentElement;
  const errorElement = formGroup.querySelector(".error-message") || document.createElement("div");

  errorElement.className = "error-message";
  errorElement.textContent = message;

  if (!formGroup.querySelector(".error-message")) {
    formGroup.appendChild(errorElement);
    
    // Animate error appearance
    errorElement.style.transform = "translateY(-10px)";
    errorElement.style.opacity = "0";
    
    setTimeout(() => {
      errorElement.style.transition = "all 0.3s ease";
      errorElement.style.transform = "translateY(0)";
      errorElement.style.opacity = "1";
    }, 10);
  }

  input.classList.add("error");
  errorElement.style.color = "var(--color-error)";
  errorElement.style.fontSize = "0.85rem";
  errorElement.style.marginTop = "5px";
  input.style.borderColor = "var(--color-error)";
  
  // Add shake animation
  input.style.animation = "shake 0.5s cubic-bezier(.36,.07,.19,.97) both";
  setTimeout(() => {
    input.style.animation = "";
  }, 500);
}

function removeError(input) {
  const formGroup = input.parentElement;
  const errorElement = formGroup.querySelector(".error-message");

  if (errorElement) {
    // Animate error disappearance
    errorElement.style.transform = "translateY(-10px)";
    errorElement.style.opacity = "0";
    
    setTimeout(() => {
      if (formGroup.contains(errorElement)) {
        formGroup.removeChild(errorElement);
      }
    }, 300);
  }

  input.classList.remove("error");
  input.style.borderColor = "";
}

/**
 * Scroll Spy
 */
function setupScrollSpy() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  // Use Intersection Observer instead of scroll event
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update navigation
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: "-100px 0px -300px 0px" });
  
  sections.forEach(section => {
    observer.observe(section);
  });

  // Special case for home section when at top of page
  window.addEventListener("scroll", () => {
    if (window.scrollY < sections[0].offsetTop) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const homeLink = document.querySelector('.nav-link[href="#home"]');
      if (homeLink) {
        homeLink.classList.add("active");
      }
    }
  });
}

/**
 * AI Chat Widget
 */
function setupAIChat() {
  const chatWidget = document.getElementById("aiChatWidget");
  const chatToggleBtn = document.getElementById("chatToggleBtn");
  const chatCloseBtn = document.getElementById("chatCloseBtn");
  const chatInput = document.getElementById("chatInput");
  const chatSendBtn = document.getElementById("chatSendBtn");
  const chatMessages = document.getElementById("chatMessages");

  if (!chatWidget || !chatToggleBtn || !chatCloseBtn || !chatInput || !chatSendBtn || !chatMessages) return;

  // Toggle chat widget with animation
  chatToggleBtn.addEventListener("click", () => {
    chatWidget.classList.toggle("active");
    chatToggleBtn.classList.toggle("active");

    if (chatWidget.classList.contains("active")) {
      chatInput.focus();
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  });

  // Close chat widget
  chatCloseBtn.addEventListener("click", () => {
    chatWidget.classList.remove("active");
    chatToggleBtn.classList.remove("active");
  });

  // Send message on button click
  chatSendBtn.addEventListener("click", sendMessage);

  // Send message on Enter key
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Add focus event to the chat input
  chatInput.addEventListener("focus", () => {
    // Scroll chat to bottom when input is focused
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message to chat
    addMessage(message, "user");

    // Clear input
    chatInput.value = "";

    // Add typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message bot typing-indicator";
    typingIndicator.innerHTML = `
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
    chatMessages.appendChild(typingIndicator);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Simulate AI thinking with variable timing for realism
    const thinkingTime = 1000 + Math.random() * 1000; // Between 1-2 seconds
    
    setTimeout(() => {
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);

      // Process the message and generate a response
      const response = generateResponse(message);

      // Add AI response to chat with character-by-character typing effect
      typeMessage(response, "bot");

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, thinkingTime);
  }

  function addMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";

    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = text;

    messageContent.appendChild(messageParagraph);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add entrance animation
    messageDiv.style.opacity = "0";
    messageDiv.style.transform = sender === "user" ? "translateX(20px)" : "translateX(-20px)";
    
    setTimeout(() => {
      messageDiv.style.transition = "all 0.3s ease";
      messageDiv.style.opacity = "1";
      messageDiv.style.transform = "translateX(0)";
    }, 10);
  }
  
  function typeMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}`;

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";

    const messageParagraph = document.createElement("p");
    messageParagraph.textContent = "";

    messageContent.appendChild(messageParagraph);
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // Add entrance animation
    messageDiv.style.opacity = "0";
    messageDiv.style.transform = "translateX(-20px)";
    
    setTimeout(() => {
      messageDiv.style.transition = "all 0.3s ease";
      messageDiv.style.opacity = "1";
      messageDiv.style.transform = "translateX(0)";
      
      // Start typing effect
      let i = 0;
      const typingSpeed = 30; // ms per character
      
      function typeChar() {
        if (i < text.length) {
          messageParagraph.textContent += text.charAt(i);
          i++;
          chatMessages.scrollTop = chatMessages.scrollHeight;
          setTimeout(typeChar, typingSpeed + Math.random() * 20); // Add randomness
        }
      }
      
      typeChar();
    }, 10);
  }

  function generateResponse(message) {
    // Simple rule-based responses
    message = message.toLowerCase();

    if (message.includes("resume") || message.includes("cv")) {
      return "You can download Rushikesh's resume using the 'Download Resume' button on the homepage. It contains details about his education, skills, and work experience.";
    } else if (message.includes("education") || message.includes("college") || message.includes("university")) {
      return "Rushikesh is pursuing a B.Tech in Computer Science & Engineering from Nagpur Institute of Technology, RTMNU, Nagpur (2022 - Present). His CGPA is 8.2 (1st Year), 7.7 (2nd Year), and 7.5 (Latest Semester).";
    } else if (message.includes("skills") || message.includes("technologies")) {
      return "Rushikesh is skilled in Python, Java, C/C++, HTML, CSS, JavaScript, React.js, Node.js, and has experience with AWS, Docker, and Machine Learning technologies.";
    } else if (message.includes("project") || message.includes("work")) {
      return "Rushikesh has worked on several projects including an Escape Room Game (MERN stack), Netflix Clone (React.js), and ML-Based Cloud Security. Check out the Projects section for more details!";
    } else if (message.includes("experience") || message.includes("internship")) {
      return "Rushikesh has completed internships as an Android Developer, Cloud Security Intern, and AI/ML & Cloud Security Intern with AICTE. These experiences have helped him develop practical skills in software development and security.";
    } else if (message.includes("contact") || message.includes("email") || message.includes("phone")) {
      return "You can contact Rushikesh via email at rj751054@gmail.com or by phone at 8087232830. You can also connect with him on LinkedIn or GitHub.";
    } else if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! I'm Rushikesh's AI assistant. How can I help you today?";
    } else if (message.includes("timeline") || message.includes("career")) {
      return "Rushikesh's career timeline includes: Started B.Tech in 2022, Android Developer Internship in 2023, and Cloud Security Internship in 2024. Check out the Career Timeline section for more details!";
    } else if (message.includes("who are you") || message.includes("what can you do")) {
      return "I'm an AI assistant for Rushikesh's portfolio. I can answer questions about his education, skills, projects, experience, and how to contact him. Feel free to ask me anything!";
    } else {
      return "I'm not sure I understand. You can ask me about Rushikesh's education, skills, projects, experience, or how to contact him.";
    }
  }
}