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
// BOTÃO "ROLE PARA BAIXO" - CORRIGIDO (SISTEMA ATUALIZADO)
// ====================================
function updateScrollButtons() {
    const scrollButtons = document.querySelectorAll('.scroll-down-btn');
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    scrollButtons.forEach(button => {
        const targetSection = button.closest('.about-section');
        const nextSection = targetSection.nextElementSibling;
        
        // Se não há próxima seção ou o usuário está perto do final da página
        if (!nextSection || (scrollPosition + windowHeight) >= (documentHeight - 100)) {
            button.classList.add('hidden');
            button.classList.remove('visible');
        } else {
            // Mostra a seta apenas se a seção atual estiver visível
            const sectionTop = targetSection.offsetTop;
            const sectionBottom = sectionTop + targetSection.offsetHeight;
            
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionBottom - 200) {
                button.classList.add('visible');
                button.classList.remove('hidden');
            } else {
                button.classList.add('hidden');
                button.classList.remove('visible');
            }
        }
    });
}

// Event listeners para os botões de scroll
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

    // Inicializar o sistema de visibilidade das setas
    updateScrollButtons();
    
    // Atualizar durante o scroll
    window.addEventListener('scroll', function() {
        updateScrollButtons();
    });

    // Atualizar quando a janela for redimensionada
    window.addEventListener('resize', function() {
        updateScrollButtons();
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
// HEADER SCROLL EFFECT
// ====================================
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) { // Após 100px de scroll
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ====================================
// INICIALIZAÇÃO DAS ANIMAÇÕES
// ====================================
document.addEventListener('DOMContentLoaded', function() {
    initImageAnimations();
    initLogoAnimation();
    
    // Inicializar o sistema de setas imediatamente
    setTimeout(updateScrollButtons, 100);
});

// ====================================
// FALLBACK PARA NAVEGADORES MAIS ANTIGOS
// ====================================
if (!Element.prototype.closest) {
    Element.prototype.closest = function(selector) {
        let el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    };
}