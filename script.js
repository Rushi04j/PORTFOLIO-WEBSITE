/**
 * Main JavaScript File
 * Professional Animated Portfolio
 */

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
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
  setupThemeToggle()
  setupCustomCursor()
  setupMobileNav()
  setupParticles()
  setupTypingEffect()
  setupScrollAnimation()
  setupFilterButtons()
  setupContactForm()
  setupScrollSpy()
  setupThemeSelector()
  setupCounterAnimation()
  setupAIChat()

  // Initialize AOS (Animate on Scroll)
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    })
  }
})

/**
 * Theme Toggle Functionality
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle")
  const body = document.body

  // Check if user has a saved preference
  const currentTheme = localStorage.getItem("theme")

  // Apply saved theme or default to system preference
  if (currentTheme) {
    body.classList.toggle("dark-theme", currentTheme === "dark")
    themeToggle.checked = currentTheme === "dark"
  } else {
    // Check for user's system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
    if (prefersDarkScheme.matches) {
      body.classList.add("dark-theme")
      themeToggle.checked = true
      localStorage.setItem("theme", "dark")
    }
  }

  // Toggle theme when the checkbox changes
  themeToggle.addEventListener("change", () => {
    const isDarkMode = themeToggle.checked
    body.classList.toggle("dark-theme", isDarkMode)
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")

    // Show toast notification
    showToast(
      isDarkMode ? "Dark theme activated" : "Light theme activated",
      isDarkMode ? "Enjoy your eyes in the dark!" : "Welcome to the light side!",
      isDarkMode ? "moon" : "sun",
      "info",
    )

    // Update particles color based on theme
    updateParticlesColor(isDarkMode)
  })
}

/**
 * Theme Selector Modal
 */
function setupThemeSelector() {
  const themeModal = document.getElementById("themeSelectorModal")
  const themeOptions = document.querySelectorAll(".theme-option")
  const closeBtn = document.querySelector(".theme-close-btn")
  const themeToggle = document.getElementById("theme-toggle")
  const themeBtn = document.querySelector(".theme-selector-btn")
  const body = document.body

  if (!themeModal || !themeOptions.length || !closeBtn || !themeBtn) return

  // Open theme selector modal
  themeBtn.addEventListener("click", (e) => {
    e.preventDefault()
    themeModal.classList.add("active")
    document.body.style.overflow = "hidden"

    // Set active theme
    const currentTheme = localStorage.getItem("theme") || "system"
    themeOptions.forEach((option) => {
      option.classList.toggle("active", option.dataset.theme === currentTheme)
    })
  })

  // Close theme selector modal
  closeBtn.addEventListener("click", () => {
    themeModal.classList.remove("active")
    document.body.style.overflow = ""
  })

  // Close modal when clicking outside
  themeModal.addEventListener("click", (e) => {
    if (e.target === themeModal) {
      themeModal.classList.remove("active")
      document.body.style.overflow = ""
    }
  })

  // Theme option selection
  themeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const theme = option.dataset.theme

      // Remove active class from all options
      themeOptions.forEach((opt) => opt.classList.remove("active"))

      // Add active class to selected option
      option.classList.add("active")

      // Apply theme
      if (theme === "light") {
        body.classList.remove("dark-theme")
        themeToggle.checked = false
        localStorage.setItem("theme", "light")
        showToast("Light theme activated", "Welcome to the light side!", "sun", "info")
        updateParticlesColor(false)
      } else if (theme === "dark") {
        body.classList.add("dark-theme")
        themeToggle.checked = true
        localStorage.setItem("theme", "dark")
        showToast("Dark theme activated", "Enjoy your eyes in the dark!", "moon", "info")
        updateParticlesColor(true)
      } else if (theme === "system") {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)")
        body.classList.toggle("dark-theme", prefersDarkScheme.matches)
        themeToggle.checked = prefersDarkScheme.matches
        localStorage.setItem("theme", "system")
        showToast("System theme activated", "Following your system preferences", "laptop", "info")
        updateParticlesColor(prefersDarkScheme.matches)

        // Listen for system theme changes
        prefersDarkScheme.addEventListener("change", (e) => {
          if (localStorage.getItem("theme") === "system") {
            body.classList.toggle("dark-theme", e.matches)
            themeToggle.checked = e.matches
            updateParticlesColor(e.matches)
          }
        })
      }

      // Close modal
      setTimeout(() => {
        themeModal.classList.remove("active")
        document.body.style.overflow = ""
      }, 500)
    })
  })
}

/**
 * Toast Notifications
 */
function showToast(title, message, icon, type = "info") {
  const toastContainer = document.getElementById("toastContainer")

  if (!toastContainer) return

  const toast = document.createElement("div")
  toast.className = `toast toast-${type} glassmorphism`

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
`

  toastContainer.appendChild(toast)

  // Close toast on click
  const closeBtn = toast.querySelector(".toast-close")
  closeBtn.addEventListener("click", () => {
    toast.style.animation = "fadeOut 0.3s forwards"
    setTimeout(() => {
      toastContainer.removeChild(toast)
    }, 300)
  })

  // Auto remove toast after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.animation = "fadeOut 0.3s forwards"
      setTimeout(() => {
        if (toast.parentElement) {
          toastContainer.removeChild(toast)
        }
      }, 300)
    }
  }, 5000)
}

/**
 * Counter Animation
 */
function setupCounterAnimation() {
  const counters = document.querySelectorAll(".counter")

  if (!counters.length) return

  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.getAttribute("data-count"))
    const duration = 2000 // 2 seconds
    const step = target / (duration / 16) // 60fps
    let current = 0

    const updateCounter = () => {
      current += step
      if (current < target) {
        counter.textContent = Math.floor(current)
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target
        if (target === 1) {
          counter.textContent = target + "+"
        } else {
          counter.textContent = target + "+"
        }
      }
    }

    updateCounter()
  }

  const checkCounters = () => {
    counters.forEach((counter) => {
      if (isInViewport(counter) && !counter.classList.contains("animated")) {
        counter.classList.add("animated")
        setTimeout(() => {
          animateCounter(counter)
        }, 300)
      }
    })
  }

  window.addEventListener("scroll", checkCounters)
  checkCounters()
}

/**
 * Custom Cursor
 */
function setupCustomCursor() {
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  if (!cursor || !cursorFollower) return

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`
    cursor.style.top = `${e.clientY}px`

    setTimeout(() => {
      cursorFollower.style.left = `${e.clientX}px`
      cursorFollower.style.top = `${e.clientY}px`
    }, 100)
  })

  document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(0.8)"
    cursorFollower.style.transform = "translate(-50%, -50%) scale(0.8)"
  })

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)"
    cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
  })

  // Add hover effects for interactive elements
  const interactiveElements = document.querySelectorAll(
    "a, button, input, .social-link, .btn, .filter-btn, .theme-option",
  )

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursor.style.opacity = "0.5"
      cursorFollower.style.transform = "translate(-50%, -50%) scale(1.5)"
      cursorFollower.style.backgroundColor = "rgba(0, 247, 255, 0.1)"
      cursorFollower.style.borderWidth = "0px"
    })

    element.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)"
      cursor.style.opacity = "0.75"
      cursorFollower.style.transform = "translate(-50%, -50%) scale(1)"
      cursorFollower.style.backgroundColor = "transparent"
      cursorFollower.style.borderWidth = "2px"
    })
  })
}

/**
 * Mobile Navigation
 */
function setupMobileNav() {
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-list")
  const navItems = document.querySelectorAll(".nav-link")

  if (!hamburger || !navLinks) return

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navLinks.classList.toggle("active")

    if (navLinks.classList.contains("active")) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  })

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navLinks.classList.remove("active")
      document.body.style.overflow = ""
    })
  })
}

/**
 * Particles Background
 */
function setupParticles() {
  const particlesContainer = document.getElementById("particles-js")

  if (!particlesContainer || typeof particlesJS === "undefined") return

  const isDarkTheme = document.body.classList.contains("dark-theme")

  updateParticlesConfig(isDarkTheme)
}

function updateParticlesColor(isDarkTheme) {
  if (typeof particlesJS === "undefined") return

  updateParticlesConfig(isDarkTheme)
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
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
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
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  }

  particlesJS("particles-js", particlesConfig)
}

/**
 * Typing Effect
 */
function setupTypingEffect() {
  const typingElement = document.querySelector(".typing-text")
  const cursorElement = document.querySelector(".typing-cursor")

  if (!typingElement || !cursorElement) return

  const textList = ["Web Developer", "Software Engineer", "UI/UX Designer", "Problem Solver", "AI/ML Enthusiast"]

  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let isWaiting = false

  function type() {
    const currentText = textList[textIndex]

    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1)
      charIndex--

      if (charIndex === 0) {
        isDeleting = false
        isWaiting = true
        setTimeout(() => {
          isWaiting = false
          textIndex = (textIndex + 1) % textList.length
        }, 500)
      }

      setTimeout(type, 50)
    } else if (isWaiting) {
      setTimeout(type, 100)
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1)
      charIndex++

      if (charIndex === currentText.length) {
        isWaiting = true
        setTimeout(() => {
          isWaiting = false
          isDeleting = true
        }, 1500)
      }

      setTimeout(type, 100)
    }
  }

  setTimeout(type, 1000)

  setInterval(() => {
    cursorElement.style.opacity = cursorElement.style.opacity === "0" ? "1" : "0"
  }, 500)
}

/**
 * Scroll Animation
 */
function setupScrollAnimation() {
  const header = document.querySelector(".header")

  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    })
  }

  const skillLevels = document.querySelectorAll(".skill-level")
  const skillsSection = document.getElementById("skills")

  if (skillLevels.length > 0 && skillsSection) {
    const isInViewport = (element) => {
      const rect = element.getBoundingClientRect()
      return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
    }

    const animateSkillLevels = () => {
      if (isInViewport(skillsSection)) {
        skillLevels.forEach((level) => {
          const width = level.style.width
          level.style.width = "0"
          setTimeout(() => {
            level.style.width = width
          }, 100)
        })
        window.removeEventListener("scroll", animateSkillLevels)
      }
    }

    window.addEventListener("scroll", animateSkillLevels)
    animateSkillLevels()
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        e.preventDefault()
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

/**
 * Filter Buttons
 */
function setupFilterButtons() {
  // Skills Filter
  const skillsFilterButtons = document.querySelectorAll(".skills-filter .filter-btn")
  const skillItems = document.querySelectorAll(".skill-item")

  if (skillsFilterButtons.length > 0 && skillItems.length > 0) {
    skillsFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        skillsFilterButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        const filter = button.getAttribute("data-filter")

        skillItems.forEach((item) => {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "block"
            setTimeout(() => {
              item.style.transform = "translateY(0)"
              item.style.opacity = "1"
            }, 100)
          } else {
            item.style.transform = "translateY(20px)"
            item.style.opacity = "0"
            setTimeout(() => {
              item.style.display = "none"
            }, 300)
          }
        })
      })
    })
  }

  // Projects Filter
  const projectsFilterButtons = document.querySelectorAll(".projects-filter .filter-btn")
  const projectItems = document.querySelectorAll(".project-card")

  if (projectsFilterButtons.length > 0 && projectItems.length > 0) {
    projectsFilterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        projectsFilterButtons.forEach((btn) => btn.classList.remove("active"))
        button.classList.add("active")

        const filter = button.getAttribute("data-filter")

        projectItems.forEach((item) => {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "block"
            setTimeout(() => {
              item.style.transform = "translateY(0)"
              item.style.opacity = "1"
            }, 100)
          } else {
            item.style.transform = "translateY(20px)"
            item.style.opacity = "0"
            setTimeout(() => {
              item.style.display = "none"
            }, 300)
          }
        })
      })
    })
  }
}

/**
 * Contact Form
 */
function setupContactForm() {
  const contactForm = document.getElementById("contact-form")

  if (!contactForm) return

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const nameInput = document.getElementById("name")
    const emailInput = document.getElementById("email")
    const subjectInput = document.getElementById("subject")
    const messageInput = document.getElementById("message")
    const submitButton = contactForm.querySelector('button[type="submit"]')

    let isValid = true

    if (!nameInput.value.trim()) {
      showError(nameInput, "Please enter your name")
      isValid = false
    } else {
      removeError(nameInput)
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, "Please enter your email")
      isValid = false
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailInput, "Please enter a valid email address")
      isValid = false
    } else {
      removeError(emailInput)
    }

    if (!subjectInput.value.trim()) {
      showError(subjectInput, "Please enter a subject")
      isValid = false
    } else {
      removeError(subjectInput)
    }

    if (!messageInput.value.trim()) {
      showError(messageInput, "Please enter your message")
      isValid = false
    } else {
      removeError(messageInput)
    }

    if (isValid) {
      const originalText = submitButton.innerHTML
      submitButton.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>'
      submitButton.disabled = true

      setTimeout(() => {
        showToast(
          "Message Sent!",
          "Your message has been sent successfully. I will get back to you soon.",
          "check-circle",
          "success",
        )
        contactForm.reset()

        setTimeout(() => {
          submitButton.innerHTML = originalText
          submitButton.disabled = false
        }, 2000)
      }, 1500)
    }
  })
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function showError(input, message) {
  const formGroup = input.parentElement
  const errorElement = formGroup.querySelector(".error-message") || document.createElement("div")

  errorElement.className = "error-message"
  errorElement.textContent = message

  if (!formGroup.querySelector(".error-message")) {
    formGroup.appendChild(errorElement)
  }

  input.classList.add("error")
  errorElement.style.color = "var(--color-error)"
  errorElement.style.fontSize = "0.85rem"
  errorElement.style.marginTop = "5px"
  input.style.borderColor = "var(--color-error)"
}

function removeError(input) {
  const formGroup = input.parentElement
  const errorElement = formGroup.querySelector(".error-message")

  if (errorElement) {
    formGroup.removeChild(errorElement)
  }

  input.classList.remove("error")
  input.style.borderColor = ""
}

/**
 * Scroll Spy
 */
function setupScrollSpy() {
  const sections = document.querySelectorAll("section")
  const navLinks = document.querySelectorAll(".nav-link")

  if (sections.length === 0 || navLinks.length === 0) return

  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"))
        const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)
        if (activeLink) {
          activeLink.classList.add("active")
        }
      }
    })

    if (scrollPosition < sections[0].offsetTop) {
      navLinks.forEach((link) => link.classList.remove("active"))
      const homeLink = document.querySelector('.nav-link[href="#home"]')
      if (homeLink) {
        homeLink.classList.add("active")
      }
    }
  }

  window.addEventListener("scroll", updateActiveLink)
  updateActiveLink()
}

/**
 * AI Chat Widget
 */
function setupAIChat() {
  const chatWidget = document.getElementById("aiChatWidget")
  const chatToggleBtn = document.getElementById("chatToggleBtn")
  const chatCloseBtn = document.getElementById("chatCloseBtn")
  const chatInput = document.getElementById("chatInput")
  const chatSendBtn = document.getElementById("chatSendBtn")
  const chatMessages = document.getElementById("chatMessages")

  if (!chatWidget || !chatToggleBtn || !chatCloseBtn || !chatInput || !chatSendBtn || !chatMessages) return

  // Toggle chat widget
  chatToggleBtn.addEventListener("click", () => {
    chatWidget.classList.toggle("active")
    chatToggleBtn.classList.toggle("active")

    if (chatWidget.classList.contains("active")) {
      chatInput.focus()
    }
  })

  // Close chat widget
  chatCloseBtn.addEventListener("click", () => {
    chatWidget.classList.remove("active")
    chatToggleBtn.classList.remove("active")
  })

  // Send message on button click
  chatSendBtn.addEventListener("click", sendMessage)

  // Send message on Enter key
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })

  // Add focus event to the chat input
  chatInput.addEventListener("focus", () => {
    // Scroll chat to bottom when input is focused
    chatMessages.scrollTop = chatMessages.scrollHeight
  })

  function sendMessage() {
    const message = chatInput.value.trim()

    if (!message) return

    // Add user message to chat
    addMessage(message, "user")

    // Clear input
    chatInput.value = ""

    // Add typing indicator
    const typingIndicator = document.createElement("div")
    typingIndicator.className = "message bot typing-indicator"
    typingIndicator.innerHTML = `
        <div class="message-content">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `
    chatMessages.appendChild(typingIndicator)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Simulate AI thinking
    setTimeout(() => {
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator)

      // Process the message and generate a response
      const response = generateResponse(message)

      // Add AI response to chat
      addMessage(response, "bot")

      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight
    }, 1000)
  }

  function addMessage(text, sender) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${sender}`

    const messageContent = document.createElement("div")
    messageContent.className = "message-content"

    const messageParagraph = document.createElement("p")
    messageParagraph.textContent = text

    messageContent.appendChild(messageParagraph)
    messageDiv.appendChild(messageContent)
    chatMessages.appendChild(messageDiv)

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  function generateResponse(message) {
    // Simple rule-based responses
    message = message.toLowerCase()

    if (message.includes("resume") || message.includes("cv")) {
      return "You can download Rushikesh's resume using the 'Download Resume' button on the homepage. It contains details about his education, skills, and work experience."
    } else if (message.includes("education") || message.includes("college") || message.includes("university")) {
      return "Rushikesh is pursuing a B.Tech in Computer Science & Engineering from Nagpur Institute of Technology, RTMNU, Nagpur (2022 - Present). His CGPA is 8.2 (1st Year), 7.7 (2nd Year), and 7.5 (Latest Semester)."
    } else if (message.includes("skills") || message.includes("technologies")) {
      return "Rushikesh is skilled in Python, Java, C/C++, HTML, CSS, JavaScript, React.js, Node.js, and has experience with AWS, Docker, and Machine Learning technologies."
    } else if (message.includes("project") || message.includes("work")) {
      return "Rushikesh has worked on several projects including an Escape Room Game (MERN stack), Netflix Clone (React.js), and ML-Based Cloud Security. Check out the Projects section for more details!"
    } else if (message.includes("experience") || message.includes("internship")) {
      return "Rushikesh has completed internships as an Android Developer, Cloud Security Intern, and AI/ML & Cloud Security Intern with AICTE. These experiences have helped him develop practical skills in software development and security."
    } else if (message.includes("contact") || message.includes("email") || message.includes("phone")) {
      return "You can contact Rushikesh via email at rj751054@gmail.com or by phone at 8087232830. You can also connect with him on LinkedIn or GitHub."
    } else if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
      return "Hello! I'm Rushikesh's AI assistant. How can I help you today?"
    } else if (message.includes("timeline") || message.includes("career")) {
      return "Rushikesh's career timeline includes: Started B.Tech in 2022, Android Developer Internship in 2023, and Cloud Security Internship in 2024. Check out the Career Timeline section for more details!"
    } else if (message.includes("who are you") || message.includes("what can you do")) {
      return "I'm an AI assistant for Rushikesh's portfolio. I can answer questions about his education, skills, projects, experience, and how to contact him. Feel free to ask me anything!"
    } else {
      return "I'm not sure I understand. You can ask me about Rushikesh's education, skills, projects, experience, or how to contact him."
    }
  }
}
