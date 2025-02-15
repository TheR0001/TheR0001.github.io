document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    offset: 100,
    once: true
  });

  // Mobile menu toggle with improved functionality
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent click from bubbling to document
      navMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      if (href && href !== "#") {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = menuToggle?.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
            }
          }
        }
      }
    });
  });

  // Enhanced form handling with progress steps
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Reset form progress state
    let currentStep = 0;
    const totalSteps = 3;
    
    // Group form fields by step
    const formFields = {
      step1: ['name', 'email'],
      step2: ['os'],
      step3: ['message']
    };

    // Initialize step elements
    const progressSteps = document.querySelectorAll('.progress-step');
    const formGroups = document.querySelectorAll('.form-group');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    if (submitButton) {
      submitButton.style.display = 'none';
    }

    // Create navigation buttons
    const navButtons = document.createElement('div');
    navButtons.className = 'form-navigation';
    navButtons.innerHTML = `
      <button type="button" class="secondary-button prev-btn" style="display: none">Précédent</button>
      <button type="button" class="cta-button next-btn">Suivant</button>
      <button type="submit" class="cta-button submit-btn" style="display: none">Créer mon VPS</button>
    `;
    contactForm.appendChild(navButtons);

    const prevBtn = navButtons.querySelector('.prev-btn');
    const nextBtn = navButtons.querySelector('.next-btn');
    const submitBtn = navButtons.querySelector('.submit-btn');

    function updateProgressSteps() {
      progressSteps.forEach((step, index) => {
        if (index <= currentStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    }

    function showCurrentFormGroup() {
      formGroups.forEach((group, index) => {
        if (Math.floor(index / 2) === currentStep) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    }

    function validateCurrentStep() {
      const currentStepFields = formFields[`step${currentStep + 1}`];
      let isValid = true;

      currentStepFields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        if (input.required && !input.value.trim()) {
          isValid = false;
          showError(input, 'Ce champ est requis');
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          showError(input, 'Adresse email invalide');
        } else {
          clearError(input);
        }
      });

      return isValid;
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
      clearError(input);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      input.parentElement.appendChild(errorDiv);
      input.classList.add('error');
    }

    function clearError(input) {
      const errorDiv = input.parentElement.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.remove();
      }
      input.classList.remove('error');
    }

    // Initialize form display
    showCurrentFormGroup();
    updateProgressSteps();

    // Handle navigation buttons
    if (prevBtn && nextBtn && submitBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
          currentStep--;
          updateProgressSteps();
          showCurrentFormGroup();
          
          // Update button visibility
          prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
          nextBtn.style.display = 'block';
          submitBtn.style.display = 'none';
        }
      });

      nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
          if (currentStep < totalSteps - 1) {
            currentStep++;
            updateProgressSteps();
            showCurrentFormGroup();
            
            // Update button visibility
            prevBtn.style.display = 'block';
            if (currentStep === totalSteps - 1) {
              nextBtn.style.display = 'none';
              submitBtn.style.display = 'block';
            }
          }
        }
      });

      // Handle form submission
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateCurrentStep()) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création en cours...';
          
          try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            contactForm.reset();
            currentStep = 0;
            updateProgressSteps();
            showCurrentFormGroup();
            
            // Reset buttons
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Créer mon VPS';
            submitBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            prevBtn.style.display = 'none';
            
          } catch (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Créer mon VPS';
            showError(submitBtn, 'Une erreur est survenue. Veuillez réessayer.');
          }
        }
      });
    }
  }

  function showSuccessMessage() {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>🎉 Félicitations !</h3>
        <p>Votre VPS gratuit sera créé dans les prochaines minutes.</p>
        <p>Vérifiez votre email pour les instructions de connexion.</p>
        <button class="cta-button">Fermer</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Add close functionality
    const closeBtn = modal.querySelector('button');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.remove();
        if (contactForm) {
          contactForm.reset();
          currentStep = 0;
          updateProgressSteps();
          showCurrentFormGroup();
        }
      });
    }

    // Create confetti effect
    createConfetti();
  }

  function createConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7AF', '#FF5252'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.opacity = Math.random().toString();
      document.body.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => confetti.remove(), 5000);
    }
  }

  // Floating chat button functionality
  const chatButton = document.querySelector('.chat-toggle');
  if (chatButton) {
    let chatWindow = null;
    
    chatButton.addEventListener('click', () => {
      if (chatWindow) {
        chatWindow.remove();
        chatWindow = null;
        chatButton.innerHTML = '<i class="fas fa-comments"></i>';
      } else {
        chatWindow = document.createElement('div');
        chatWindow.className = 'chat-window';
        chatWindow.innerHTML = `
          <div class="chat-header">
            <h3>Support Communautaire</h3>
            <button class="close-chat"><i class="fas fa-times"></i></button>
          </div>
          <div class="chat-messages">
            <div class="message system">
              Bienvenue sur le support communautaire de Swift-Host ! 
              Pour obtenir de l'aide rapidement, vous pouvez :
              <ul>
                <li>Consulter notre <a href="#faq">FAQ</a></li>
                <li>Rejoindre notre <a href="#discord">Discord</a></li>
                <li>Parcourir nos <a href="#tutorials">tutoriels</a></li>
              </ul>
            </div>
          </div>
          <div class="chat-input">
            <input type="text" placeholder="Tapez votre message..." disabled>
            <button disabled><i class="fas fa-paper-plane"></i></button>
          </div>
        `;
        document.body.appendChild(chatWindow);
        
        const closeBtn = chatWindow.querySelector('.close-chat');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            chatWindow.remove();
            chatWindow = null;
            chatButton.innerHTML = '<i class="fas fa-comments"></i>';
          });
        }
        
        chatButton.innerHTML = '<i class="fas fa-times"></i>';
      }
    });
  }

  // Add scroll-based animations for header
  let lastScroll = 0;
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        header.style.boxShadow = 'none';
        return;
      }
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      }
      
      lastScroll = currentScroll;
    });
  }

  // Add hover animations for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    const featureIcon = card.querySelector('.feature-icon');
    if (featureIcon) {
      card.addEventListener('mouseenter', () => {
        featureIcon.style.transform = 'scale(1.1) rotate(10deg)';
      });
      
      card.addEventListener('mouseleave', () => {
        featureIcon.style.transform = 'scale(1) rotate(0deg)';
      });
    }
  });

  function initializeServerVisualization() {
    const serverRack = document.querySelector('.server-rack');
    const serverUnits = document.querySelector('.server-units');
    
    if (!serverRack || !serverUnits) return;

    // Create server units
    for (let i = 0; i < 6; i++) {
      const unit = document.createElement('div');
      unit.className = 'server-unit';
      serverUnits.appendChild(unit);
    }

    // Add network lines animation
    const networkLines = document.createElement('div');
    networkLines.className = 'network-lines';
    serverRack.appendChild(networkLines);

    // Create animated network lines
    function createNetworkLine() {
      const line = document.createElement('div');
      line.className = 'network-line';
      line.style.left = Math.random() * 100 + '%';
      line.style.animationDelay = Math.random() * 2 + 's';
      networkLines.appendChild(line);

      // Remove line after animation
      setTimeout(() => line.remove(), 2000);
    }

    // Create network lines periodically
    setInterval(createNetworkLine, 200);

    // Add hover effect
    serverRack.addEventListener('mousemove', (e) => {
      const rect = serverRack.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const rotateY = -20 + (x - 0.5) * 10;
      const rotateX = 10 + (y - 0.5) * 10;
      
      serverRack.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    serverRack.addEventListener('mouseleave', () => {
      serverRack.style.transform = 'rotateY(-20deg) rotateX(10deg)';
    });
  }

  initializeServerVisualization();
});