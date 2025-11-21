document.addEventListener('DOMContentLoaded', () => {

    /**
     * ====================================
     * FORÇA ROLAGEM PARA O TOPO
     * ====================================
     */
    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });

    /**
     * ====================================
     * VARIÁVEIS DO MENU OVERLAY
     * ====================================
     */
    const menuOverlay = document.getElementById('fullMenuOverlay');
    const menuText = document.getElementById('menuText');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuIcon = document.querySelector('.bx-menu');
    const menuLinks = document.querySelectorAll('.full-navbar a');

    // Função para gerenciar o destaque ativo no menu overlay
    const setActiveMenuOverlay = (targetHref) => {
        menuLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.full-navbar a[href="${targetHref}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log(`✅ Link ativo definido: ${targetHref}`);
        } else {
            console.log(`❌ Link não encontrado para: ${targetHref}`);
        }
    };

    /**
     * ====================================
     * LÓGICA DO MENU OVERLAY
     * ====================================
     */
    const openMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
            
            if (window.location.hash === '#home' || window.location.hash === '') {
                setActiveMenuOverlay('#home');
            }
        }
    };

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = ''; 
        }
    };

    menuText?.addEventListener('click', openMenu);
    closeMenuBtn?.addEventListener('click', closeMenu);
    menuIcon?.addEventListener('click', openMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetHref = link.getAttribute('href');
            setActiveMenuOverlay(targetHref);
            closeMenu();
        });
    });

    /**
     * ====================================
     * ANIMAÇÃO DE IMAGENS COM SCROLL
     * ====================================
     */
    function initImageAnimations() {
        const images = document.querySelectorAll('.scroll-image');
        
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

    /**
     * ====================================
     * ANIMAÇÃO DA LOGO - ENHANCEMENT
     * ====================================
     */
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

    /**
     * ====================================
     * SCROLL REVEAL – ANIMAÇÃO DE ENTRADA
     * ====================================
     */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observar todos os elementos com animação
    document.querySelectorAll('.scroll-element').forEach(el => {
        observer.observe(el);
    });

    /**
     * ====================================
     * SCROLL TO TOP + HEADER STICKY
     * ====================================
     */
    const scrollToTopBtn = document.querySelector('.scroll-to-top-btn');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        header?.classList.toggle('sticky', window.scrollY > 100);
        scrollToTopBtn?.classList.toggle('show', window.scrollY > 300);
    });

    scrollToTopBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveMenuOverlay('#home');
    });

    /**
     * ====================================
     * BOTÃO "ROLE PARA BAIXO" - CORRIGIDO
     * ====================================
     */
    function initScrollDownButtons() {
        const scrollDownBtn = document.querySelector('.home .scroll-down-btn');
        const introSection = document.querySelector('.intro-trabalho');
        
        if (!scrollDownBtn || !introSection) {
            console.log('❌ Elementos da seta não encontrados');
            return;
        }
        
        console.log('✅ Seta scroll-down encontrada, inicializando...');
        
        // Clique na seta
        scrollDownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🎯 Clicou na seta, rolando para intro-trabalho...');
            introSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });

        // Controle de visibilidade da seta - FUNCIONANDO IGUAL CONTATO
        function updateScrollButtonVisibility() {
            const introRect = introSection.getBoundingClientRect();
            
            // Se a seção intro estiver visível na tela (70% da altura da viewport)
            if (introRect.top <= window.innerHeight * 0.7) {
                scrollDownBtn.classList.add('hidden');
                scrollDownBtn.classList.remove('visible');
            } else {
                scrollDownBtn.classList.add('visible');
                scrollDownBtn.classList.remove('hidden');
            }
        }

        // Atualizar na rolagem com throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateScrollButtonVisibility, 10);
        });
        
        // Atualizar no resize
        window.addEventListener('resize', updateScrollButtonVisibility);
        
        // Atualizar inicial
        updateScrollButtonVisibility();
        
        console.log('🎯 Controle da seta scroll-down inicializado com sucesso!');
    }

    /**
     * ====================================
     * NAVEGAÇÃO POR TECLAS (KEYBOARD NAVIGATION)
     * ====================================
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Navegação por teclado apenas quando o menu não está aberto
            if (menuOverlay && menuOverlay.classList.contains('active')) return;
            
            switch(e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    document.querySelector('.intro-trabalho')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'Home':
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'End':
                    e.preventDefault();
                    window.scrollTo({ 
                        top: document.documentElement.scrollHeight, 
                        behavior: 'smooth' 
                    });
                    break;
            }
        });
    }

    /**
     * ====================================
     * OTIMIZAÇÃO DE PERFORMANCE - SCROLL
     * ====================================
     */
    let globalScrollTimeout;
    let isScrolling = false;

    function initScrollOptimizations() {
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                isScrolling = true;
                setTimeout(() => {
                    isScrolling = false;
                }, 100);
            }

            clearTimeout(globalScrollTimeout);
            globalScrollTimeout = setTimeout(() => {
                // Código que roda após o scroll parar
                // Pode ser usado para lazy loading ou outras otimizações
            }, 100);
        });
    }

    /**
     * ====================================
     * PREVENIR COMPORTAMENTOS INDESEJADOS
     * ====================================
     */
    function initPreventDefaultBehaviors() {
        // Prevenir zoom com Ctrl + Scroll
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
                e.preventDefault();
            }
        });

        // Prevenir arrastar imagens
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
        });
    }

    /**
     * ====================================
     * COMPATIBILIDADE MOBILE
     * ====================================
     */
    function initMobileCompatibility() {
        // Touch events passivos para melhor performance
        document.addEventListener('touchstart', function() {}, { passive: true });
        document.addEventListener('touchmove', function() {}, { passive: true });
        
        // Prevenir bounce no iOS quando menu aberto
        document.body.addEventListener('touchmove', function(e) {
            if (menuOverlay && menuOverlay.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    /**
     * ====================================
     * CARREGAMENTO DE IMAGENS OTIMIZADO
     * ====================================
     */
    function initImageLoading() {
        window.addEventListener('load', () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', function() {
                        this.classList.add('loaded');
                    });
                    
                    // Fallback para erro de carregamento
                    img.addEventListener('error', function() {
                        console.warn('Erro ao carregar imagem:', this.src);
                        this.classList.add('load-error');
                    });
                }
            });
        });
    }

    /**
     * ====================================
     * DETECÇÃO DE RECURSOS DO NAVEGADOR
     * ====================================
     */
    function initFeatureDetection() {
        // Verificar suporte a backdrop-filter (para efeitos de vidro)
        if (!CSS.supports('backdrop-filter', 'blur(10px)') && 
            !CSS.supports('-webkit-backdrop-filter', 'blur(10px)')) {
            document.body.classList.add('no-backdrop-filter');
        }

        // Verificar suporte a Intersection Observer
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver não suportado - animações desativadas');
            document.querySelectorAll('.scroll-element, .scroll-image').forEach(el => {
                el.classList.add('show-element', 'visible');
            });
        }
    }

    /**
     * ====================================
     * INICIALIZAÇÃO DE TODOS OS MÓDULOS
     * ====================================
     */
    function initAllModules() {
        initImageAnimations();
        initLogoAnimation();
        initScrollDownButtons();
        initKeyboardNavigation();
        initScrollOptimizations();
        initPreventDefaultBehaviors();
        initMobileCompatibility();
        initImageLoading();
        initFeatureDetection();
        
        console.log('🎯 Todos os módulos JavaScript inicializados com sucesso!');
    }

    // Inicializar quando o DOM estiver pronto
    initAllModules();
    
    // ⬇️ ATIVAÇÃO INICIAL AO CARREGAR
    setActiveMenuOverlay(window.location.hash || '#home');

    /**
     * ====================================
     * TRATAMENTO DE ERROS GLOBAL
     * ====================================
     */
    window.addEventListener('error', (e) => {
        console.error('Erro global capturado:', e.error);
    });

    /**
     * ====================================
     * DEBUG HELPER (apenas desenvolvimento)
     * ====================================
     */
    if (window.location.search.includes('debug=true')) {
        console.log('🔧 Modo debug ativado');
        
        // Log de performance inicial
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
        });
    }
});

// Adicione isso ao seu arquivo JavaScript existente
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY;
    
    if (scrollY > 100) { // Após 100px de scroll
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});