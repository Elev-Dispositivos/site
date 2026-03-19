document.addEventListener('DOMContentLoaded', function() {
    // Rastreador de Visitas Únicas por Sessão (TOPSTACK Security)
    async function trackVisit() {
        // Verifica se o Supabase e a configuração estão disponíveis
        if (!window.supabase || !window.supabaseConfig) return;

        const sessionKey = 'elev_session_tracked';
        let sessionId = sessionStorage.getItem(sessionKey);

        if (!sessionId) {
            // Nova sessão detectada (fechar e abrir o navegador limpa o sessionStorage)
            sessionId = (crypto && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now();
            sessionStorage.setItem(sessionKey, sessionId);

            try {
                const supabase = window.supabase.createClient(window.supabaseConfig.url, window.supabaseConfig.key);

                await supabase.rpc('log_visit', { 
                    p_session_id: sessionId,
                    p_url: window.location.href,
                    p_user_agent: navigator.userAgent
                });
            } catch (err) {
                // Falha silenciosa para não atrapalhar a experiência do usuário
                console.warn('Analytics offline');
            }
        }
    }
    trackVisit();

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Product Carousel
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    
    if (carouselItems.length && prevBtn && nextBtn) {
        let currentIndex = 0;
        
        function showSlide(index) {
            carouselItems.forEach(item => item.classList.remove('active'));
            
            if (index < 0) {
                currentIndex = carouselItems.length - 1;
            } else if (index >= carouselItems.length) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }
            
            carouselItems[currentIndex].classList.add('active');
        }
        
        prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
        });
        
        nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
        });
        
        // Auto slide every 5 seconds
        setInterval(() => {
            showSlide(currentIndex + 1);
        }, 5000);
    }
    
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
                
                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Animation for counter
    const counterElement = document.querySelector('.counter .number');
    
    if (counterElement) {
        const targetNumber = parseInt(counterElement.textContent);
        let currentNumber = 0;
        
        function animateCounter() {
            if (currentNumber < targetNumber) {
                currentNumber++;
                counterElement.textContent = currentNumber;
                setTimeout(animateCounter, 100);
            }
        }
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counterElement);
    }
});

