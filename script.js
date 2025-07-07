

// Preloader animation
const name = "CHARAN";
const loader = document.getElementById("name-loader");
let index = 0;

function revealName() {
    if (index < name.length) {
        loader.textContent = name[index];
        index++;
        setTimeout(revealName, 400);
    }
}

window.addEventListener("load", () => {
    revealName();
    setTimeout(() => {
        document.getElementById("preloader").style.display = "none";
    }, 3500);
});

// Initialize Three.js scene
const initThreeJS = () => {
    const canvas = document.getElementById('three-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()),
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    
    // Sound effects functionality
    const clickSound = document.getElementById('clickSound');
    const hoverSound = document.getElementById('hoverSound');
    const successSound = document.getElementById('successSound');
    const toggleSound = document.getElementById('toggleSound');
    
    // Get sound preference from localStorage or default to true
    let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    
    // Play sound function
    const playSound = (soundElement) => {
        if (soundEnabled) {
            soundElement.currentTime = 0;
            soundElement.play().catch(e => console.log("Sound playback prevented:", e));
        }
    };
    
    // Play click sound for all interactive elements
    const playClickSound = () => playSound(clickSound);
    const playHoverSound = () => playSound(hoverSound);
    const playSuccessSound = () => playSound(successSound);
    const playToggleSound = () => playSound(toggleSound);
    
    // Add click sounds to all interactive elements
    const interactiveElements = [
        '.nav-links a',
        '.cta-button',
        '.project-link',
        '.view-certificate',
        '.footer-link',
        '.submit-btn',
        '.settings-btn',
        '.close-settings',
        '.theme-option',
        '.scroll-top',
        '.modal-close',
        '.hamburger'
    ];
    
    interactiveElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('click', playClickSound);
        });
    });
    
    // Add hover sounds to buttons and links
    const hoverElements = [
        '.cta-button',
        '.project-link',
        '.view-certificate',
        '.footer-link',
        '.submit-btn',
        '.nav-links a'
    ];
    
    hoverElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('mouseenter', playHoverSound);
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Scroll to top button
    const scrollTop = document.querySelector('.scroll-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTop.classList.add('active');
        } else {
            scrollTop.classList.remove('active');
        }
    });
    
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Certificate modal functionality
    const modalTriggers = document.querySelectorAll('.view-certificate');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const certificateId = trigger.getAttribute('data-certificate');
            const modal = document.getElementById(certificateId);
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            playSuccessSound();
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Animate elements when scrolling
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.fade-in');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('load', animateOnScroll);
    
    // Initialize animations
    animateOnScroll();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 3D tilt effect for hero image
    const heroImage = document.querySelector('.hero-image');
    
    if (heroImage) {
        heroImage.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        heroImage.addEventListener('mouseenter', () => {
            heroImage.style.transition = 'none';
        });
        
        heroImage.addEventListener('mouseleave', () => {
            heroImage.style.transition = 'transform 0.5s ease';
            heroImage.style.transform = 'rotateY(0) rotateX(0)';
        });
    }
    
    // Settings panel functionality
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsPanel = document.getElementById('settingsPanel');
    const closeSettings = document.getElementById('closeSettings');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const soundToggle = document.getElementById('soundToggle');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Toggle settings panel
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
    });
    
    closeSettings.addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });
    
    // Dark mode toggle
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (currentTheme === 'dark') {
        darkModeToggle.checked = true;
    } else {
        darkModeToggle.checked = false;
    }
    
    darkModeToggle.addEventListener('change', (e) => {
        playToggleSound();
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Sound toggle functionality
    soundToggle.checked = soundEnabled;
    soundToggle.addEventListener('change', (e) => {
        playToggleSound();
        soundEnabled = e.target.checked;
        localStorage.setItem('soundEnabled', soundEnabled);
    });
    
    // Theme color options
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === currentTheme) {
            option.classList.add('active');
        }
        
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            if (theme === 'dark') {
                darkModeToggle.checked = true;
            } else {
                darkModeToggle.checked = false;
            }
            
            playClickSound();
        });
    });
    
    // Contact form functionality
    const contactForm = document.getElementById('contactForm');
    
    // Load saved form data from localStorage
    const savedFormData = JSON.parse(localStorage.getItem('contactFormData')) || {};
    if (savedFormData) {
        document.getElementById('name').value = savedFormData.name || '';
        document.getElementById('email').value = savedFormData.email || '';
        document.getElementById('subject').value = savedFormData.subject || '';
        document.getElementById('message').value = savedFormData.message || '';
    }
    
    // Save form data to localStorage on input change
    contactForm.addEventListener('input', (e) => {
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        playSuccessSound();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Open default email client with form data
        const mailtoLink = `mailto:charanbalaji_neelampalli@srmap.edu.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage: ${message}`)}`;
        window.location.href = mailtoLink;
        
        // Clear form and localStorage after submission
        contactForm.reset();
        localStorage.removeItem('contactFormData');
    });
    
    // Prevent zooming
    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
            e.preventDefault();
        }
    });
    
    // Footer year setup
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Contact form submission handler
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const recipient = 'charanbalaji_neelampalli@srmap.edu.in';
        
        // Format email body
        const body = `Hello,\n\nMy name is ${name} and I wanted to reach out regarding:\n\n${message}\n\nBest regards,\n${name}\n${email}`;
        
        // Create mailto link
        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        document.getElementById('successMessage').style.display = 'block';
        
        // Clear form after a delay
        setTimeout(() => {
            document.getElementById('contactForm').reset();
            document.getElementById('successMessage').style.display = 'none';
        }, 5000);
    });
    
    // Date of Birth js
    const birthDate = new Date("2006-07-05");
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    document.querySelector('#age-value').textContent = `${age} Years`;
});
function toggleQRCode() {
    const container = document.getElementById('qrCodeContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}
(function () {
  /* Disable context menu (right click) */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  /* Block common DevTools / View‑Source shortcuts */
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.keyCode === 123) { e.preventDefault(); }

    // Ctrl+Shift+I / J / C   (Inspect / Console / Elements)
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
    }

    // Ctrl+U  (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
    }
  });
})();
// Smooth scroll to top
  const scrollBtn = document.querySelector('.scroll-top');

  scrollBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // Toggle visibility after 400 px
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('show', window.scrollY > 400);
  });
  