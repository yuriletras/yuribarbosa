// ====================================
// FORÇA ROLAGEM PARA O TOPO
// ====================================
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// ====================================
// ANIMAÇÃO DE IMAGENS COM SCROLL - NOVA FUNCIONALIDADE
// ====================================
function initImageAnimations() {
    const images = document.querySelectorAll('.about-paragraph-img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                imageObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });

    images.forEach(image => {
        imageObserver.observe(image);
    });
}

// ====================================
// ANIMAÇÃO DA LOGO - ENHANCEMENT
// ====================================
function initLogoAnimation() {
    const logo = document.querySelector('.header .logo');
    const logoImg = document.querySelector('.header .logo img');
    
    if (!logo || !logoImg) return;
    
    // Adicionar feedback tátil no mobile
    logo.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    logo.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Prevenir comportamento padrão de arrastar a imagem
    logoImg.addEventListener('dragstart', function(e) {
        e.preventDefault();
    });
}

// ====================================
// SCROLL REVEAL
// ====================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.intro-heading, .about-subheading, .heading-line-minimal, .intro-paragraph')
    .forEach(el => observer.observe(el));

// ====================================
// SCROLL TO TOP
// ====================================
const scrollTopBtn = document.querySelector('.scroll-to-top-btn');
window.addEventListener('scroll', () => {
    scrollTopBtn?.classList.toggle('show', window.scrollY > 300);
});
scrollTopBtn?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ====================================
// MENU OVERLAY - CORRIGIDO
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    const menuOverlay = document.getElementById('fullMenuOverlay');
    const menuIcon = document.getElementById('menu-icon');
    const menuText = document.getElementById('menuText');
    const closeBtn = document.getElementById('closeMenuBtn');

    const toggleMenu = () => {
        menuOverlay?.classList.toggle('active');
        document.body.style.overflow = menuOverlay?.classList.contains('active') ? 'hidden' : '';
    };

    menuIcon?.addEventListener('click', toggleMenu);
    menuText?.addEventListener('click', toggleMenu);
    closeBtn?.addEventListener('click', toggleMenu);
    
    // Fecha o menu ao clicar em qualquer link
    document.querySelectorAll('.full-navbar a').forEach(a => {
        a.addEventListener('click', toggleMenu);
    });
});

// ====================================
// BOTÃO "ROLE PARA BAIXO" - CORRIGIDO
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-down-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// Esconde o botão quando a última seção está visível
window.addEventListener('scroll', () => {
    const lastSection = document.querySelector('.final-section');
    const btns = document.querySelectorAll('.scroll-down-btn');
    
    if (!lastSection) return;
    
    const rect = lastSection.getBoundingClientRect();

    btns.forEach(btn => {
        const section = btn.closest('.about-section');
        if (section && section.classList.contains('final-section')) {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        } else if (rect.top <= window.innerHeight * 0.8) {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        } else {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    });
});

// ====================================
// SCROLL SNAP COMPATIBILIDADE
// ====================================
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, 100);
    }
});

// ====================================
// PREVENIR COMPORTAMENTOS INDESEJADOS
// ====================================
document.addEventListener('keydown', (e) => {
    // Prevenir zoom com Ctrl + Scroll
    if (e.ctrlKey) {
        e.preventDefault();
    }
});

// ====================================
// OTIMIZAÇÃO DE PERFORMANCE
// ====================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        // Código que roda após o scroll parar
    }, 100);
});

// ====================================
// COMPATIBILIDADE MOBILE
// ====================================
document.addEventListener('touchstart', function() {}, { passive: true });

// ====================================
// CARREGAMENTO DE IMAGENS
// ====================================
window.addEventListener('load', () => {
    // Garante que todas as imagens carregaram
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
});

// ====================================
// INICIALIZAÇÃO DAS ANIMAÇÕES
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    initImageAnimations();
    initLogoAnimation(); // ← ADICIONADO AQUI
});