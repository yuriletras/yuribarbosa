/**
 * TRANSITIONS.JS - Sistema de transições suaves entre seções
 * Compatível com todas as páginas do portfólio
 * @version 1.0.0
 */

class ScrollTransitions {
    constructor() {
        this.sections = [];
        this.currentSection = null;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.observer = null;
        
        this.init();
    }

    init() {
        console.log('🎯 Inicializando sistema de transições...');
        
        // Coletar todas as seções com scroll
        this.sections = Array.from(document.querySelectorAll('.scroll-section'));
        
        if (this.sections.length === 0) {
            console.warn('⚠️ Nenhuma seção .scroll-section encontrada');
            return;
        }

        this.setupIntersectionObserver();
        this.setupScrollListeners();
        this.setupResizeListener();
        this.initializeFirstSection();
        
        console.log(`✅ Sistema de transições inicializado com ${this.sections.length} seções`);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px', // 20% de margem para ativação mais suave
            threshold: 0
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleSectionActivation(entry.target);
                } else {
                    this.handleSectionDeactivation(entry.target);
                }
            });
        }, observerOptions);

        // Observar todas as seções
        this.sections.forEach(section => {
            this.observer.observe(section);
        });
    }

    handleSectionActivation(section) {
        if (this.currentSection === section) return;
        
        // Remover classe ativa da seção anterior
        if (this.currentSection) {
            this.currentSection.classList.remove('active');
        }
        
        // Ativar nova seção
        section.classList.add('active');
        this.currentSection = section;
        
        console.log(`🎯 Seção ativa: ${section.dataset.section || 'sem-id'}`);
        
        // Disparar evento customizado
        this.dispatchSectionChangeEvent(section);
        
        // Controlar visibilidade das setas scroll-down
        this.updateScrollDownButtons();
    }

    handleSectionDeactivation(section) {
        // Apenas remove a classe se não for a seção atual
        if (this.currentSection !== section) {
            section.classList.remove('active');
        }
    }

    dispatchSectionChangeEvent(section) {
        const event = new CustomEvent('sectionChange', {
            detail: {
                section: section,
                sectionId: section.id,
                sectionData: section.dataset.section
            }
        });
        document.dispatchEvent(event);
    }

    setupScrollListeners() {
        let scrollDirection = 0;
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (this.isScrolling) return;
            
            this.isScrolling = true;
            
            // Determinar direção do scroll
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 1 : -1;
            lastScrollY = currentScrollY;
            
            // Otimização de performance
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 100);
            
            // Atualizar elementos baseados no scroll
            this.updateElementsOnScroll();
        }, { passive: true });
    }

    updateElementsOnScroll() {
        // Atualizar botões scroll-down
        this.updateScrollDownButtons();
        
        // Atualizar header baseado no scroll
        this.updateHeaderOnScroll();
    }

    updateScrollDownButtons() {
        const scrollDownButtons = document.querySelectorAll('.scroll-down-btn');
        
        scrollDownButtons.forEach(btn => {
            const targetId = btn.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (!targetSection) return;
            
            const rect = targetSection.getBoundingClientRect();
            const isTargetVisible = rect.top <= window.innerHeight * 0.7;
            
            if (isTargetVisible) {
                btn.classList.add('hidden');
                btn.classList.remove('visible');
            } else {
                btn.classList.add('visible');
                btn.classList.remove('hidden');
            }
        });
    }

    updateHeaderOnScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    setupResizeListener() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Recalcular posições das seções no resize
        if (this.currentSection) {
            this.observer.unobserve(this.currentSection);
            this.observer.observe(this.currentSection);
        }
    }

    initializeFirstSection() {
        // Ativar a primeira seção visível ou a primeira da página
        const firstVisibleSection = this.sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.top <= window.innerHeight * 0.8;
        });

        const sectionToActivate = firstVisibleSection || this.sections[0];
        
        if (sectionToActivate) {
            this.handleSectionActivation(sectionToActivate);
        }
    }

    // Métodos públicos para controle externo
    goToSection(sectionId) {
        const targetSection = document.getElementById(sectionId) || 
                            document.querySelector(`[data-section="${sectionId}"]`);
        
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    getCurrentSection() {
        return this.currentSection;
    }

    getAllSections() {
        return this.sections;
    }

    // Destruir instância (para SPA)
    destroy() {
        if (this.observer) {
            this.sections.forEach(section => {
                this.observer.unobserve(section);
            });
        }
        
        window.removeEventListener('scroll', this.updateElementsOnScroll);
        window.removeEventListener('resize', this.handleResize);
        
        console.log('🗑️ Sistema de transições destruído');
    }
}

/**
 * Sistema de animação de elementos no scroll
 */
class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.images = [];
        this.animationObserver = null;
        
        this.init();
    }

    init() {
        this.setupElementAnimations();
        this.setupImageAnimations();
    }

    setupElementAnimations() {
        this.elements = Array.from(document.querySelectorAll('.scroll-element'));
        
        if (this.elements.length === 0) return;

        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-element');
                    elementObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => {
            elementObserver.observe(element);
        });
    }

    setupImageAnimations() {
        this.images = Array.from(document.querySelectorAll('.scroll-image'));
        
        if (this.images.length === 0) return;

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

        this.images.forEach(image => {
            imageObserver.observe(image);
        });
    }

    // Forçar animação de elementos específicos
    animateElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.classList.add('show-element'));
    }

    // Resetar animações (para recarregamento)
    resetAnimations() {
        this.elements.forEach(el => el.classList.remove('show-element'));
        this.images.forEach(img => img.classList.remove('visible'));
        
        // Re-inicializar observadores
        setTimeout(() => this.init(), 100);
    }
}

/**
 * Inicialização global do sistema
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se estamos em um ambiente com suporte necessário
    if (!('IntersectionObserver' in window)) {
        console.warn('⚠️ IntersectionObserver não suportado - animações desativadas');
        
        // Fallback: mostrar todos os elementos
        document.querySelectorAll('.scroll-element, .scroll-image').forEach(el => {
            el.classList.add('show-element', 'visible');
        });
        return;
    }

    // Inicializar sistemas
    window.scrollTransitions = new ScrollTransitions();
    window.scrollAnimations = new ScrollAnimations();

    // Adicionar classe de suporte ao body
    document.body.classList.add('transitions-enabled');

    console.log('🚀 Sistema de transições e animações carregado com sucesso!');
});

/**
 * Utilitários globais para controle das transições
 */
window.PageTransitions = {
    // Navegar para uma seção específica
    navigateTo: (sectionId) => {
        if (window.scrollTransitions) {
            window.scrollTransitions.goToSection(sectionId);
        }
    },
    
    // Obter seção atual
    getCurrentSection: () => {
        return window.scrollTransitions ? window.scrollTransitions.getCurrentSection() : null;
    },
    
    // Recarregar animações
    reloadAnimations: () => {
        if (window.scrollAnimations) {
            window.scrollAnimations.resetAnimations();
        }
    },
    
    // Desativar/ativar transições
    toggleTransitions: (enabled) => {
        if (enabled) {
            document.body.classList.remove('no-transitions');
        } else {
            document.body.classList.add('no-transitions');
        }
    }
};

// Export para módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScrollTransitions, ScrollAnimations, PageTransitions };
}