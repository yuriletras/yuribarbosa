document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para Alternância de Tema (Modo Claro/Escuro) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'light-theme') {
            themeToggle.classList.remove('bx-moon');
            themeToggle.classList.add('bx-sun');
        } else {
            themeToggle.classList.remove('bx-sun');
            themeToggle.classList.add('bx-moon');
        }
    } else {
        body.classList.remove('light-theme');
        themeToggle.classList.remove('bx-sun');
        themeToggle.classList.add('bx-moon');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            themeToggle.classList.remove('bx-moon');
            themeToggle.classList.add('bx-sun');
            localStorage.setItem('theme', 'light-theme');
        } else {
            themeToggle.classList.remove('bx-sun');
            themeToggle.classList.add('bx-moon');
            localStorage.setItem('theme', 'dark-theme');
        }
    });

    // --- Lógica para enviar o formulário de contato ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const formProps = Object.fromEntries(formData);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formProps)
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.msg);
                    contactForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(errorData.msg || 'Erro desconhecido ao enviar mensagem.');
                }
            } catch (error) {
                console.error('Erro de rede ou ao enviar mensagem:', error);
                alert('Ocorreu um erro na comunicação com o servidor. Por favor, tente novamente mais tarde.');
            }
        });
    }

    // --- Lógica para o menu hamburguer (ATUALIZADA) ---
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        // Função para fechar o menu
        const closeMenu = () => {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
            document.body.style.overflow = ''; // Restaura o scroll
        };

        // Abrir/fechar menu
        menuIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
            
            // Desabilita scroll do body quando menu está aberto
            if (navbar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Fechar ao clicar em links
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
                closeMenu();
            }
        });

        // Fechar ao rolar
        window.addEventListener('scroll', () => {
            if (navbar.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // --- Lógica para o botão "Ver Todos" na seção Portfólio ---
    const portfolioContainerById = document.getElementById('portfolioContainer');
    const viewAllProjectsBtn = document.getElementById('viewAllProjectsBtn');
    let animationFrameId;

    function startAutoScroll() {
        if (portfolioContainerById && !portfolioContainerById.classList.contains('show-all')) {
            animationFrameId = requestAnimationFrame(function autoScroll() {
                if (portfolioContainerById.scrollLeft >= (portfolioContainerById.scrollWidth - portfolioContainerById.clientWidth)) {
                    portfolioContainerById.scrollLeft = 0;
                } else {
                    portfolioContainerById.scrollLeft += 0.5;
                }
                animationFrameId = requestAnimationFrame(autoScroll);
            });
        }
    }

    function stopAutoScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    if (portfolioContainerById) {
        portfolioContainerById.addEventListener('mouseenter', stopAutoScroll);
        portfolioContainerById.addEventListener('mouseleave', () => {
            if (!portfolioContainerById.classList.contains('show-all')) {
                startAutoScroll();
            }
        });
        startAutoScroll();
    }

    if (portfolioContainerById && viewAllProjectsBtn) {
        viewAllProjectsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            portfolioContainerById.classList.toggle('show-all');
            viewAllProjectsBtn.textContent = portfolioContainerById.classList.contains('show-all') ? 'Ver Menos' : 'Ver Todos';
            portfolioContainerById.classList.contains('show-all') ? stopAutoScroll() : startAutoScroll();
        });
    }

    // --- Lógica para o Modal de Habilidades ---
    const skillItems = document.querySelectorAll('.skill-item');
    const skillModal = document.getElementById('skillModal');
    const modalSkillTitle = document.getElementById('skillModalTitle');
    const modalSkillDescription = document.getElementById('skillModalDescription');
    const skillModalCloseBtn = document.querySelector('.skill-modal-close-btn');

    const skillDetails = {
        html: { title: 'HTML5', description: 'Domínio em HTML5 para estruturação semântica e acessível de conteúdo web.' },
        css: { title: 'CSS3', description: 'Criação de estilos responsivos e visualmente atraentes.' },
        javascript: { title: 'JavaScript', description: 'Experiência em lógica de programação e desenvolvimento de funcionalidades interativas.' },
        react: { title: 'React', description: 'Construção de interfaces de usuário modernas e eficientes.' },
        bootstrap: { title: 'Bootstrap', description: 'Utilização do framework Bootstrap para desenvolvimento front-end rápido.' },
        git: { title: 'Git', description: 'Controle de versão de projetos com Git.' },
        github: { title: 'GitHub', description: 'Plataforma de colaboração para versionamento de código.' },
        figma: { title: 'Figma', description: 'Criação de designs de interface de usuário.' },
        nodejs: { title: 'Node.js', description: 'Desenvolvimento de aplicações back-end escaláveis.' },
        java: { title: 'Java', description: 'Programação orientada a objetos para aplicações robustas.' },
        vercel: { title: 'Vercel', description: 'Plataforma de deployment para sites e aplicações web.' }
    };

    if (skillItems.length > 0 && skillModal) {
        skillItems.forEach(item => {
            item.addEventListener('click', () => {
                const skillId = item.dataset.skillId;
                const details = skillDetails[skillId];
                if (details) {
                    modalSkillTitle.textContent = details.title;
                    modalSkillDescription.textContent = details.description;
                    skillModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        skillModalCloseBtn.addEventListener('click', () => {
            skillModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        skillModal.addEventListener('click', (event) => {
            if (event.target === skillModal) {
                skillModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && skillModal.classList.contains('active')) {
                skillModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // --- Lógica para filtrar habilidades por categoria ---
    const categoryButtons = document.querySelectorAll('.category-btn');
    const skillGrids = document.querySelectorAll('.skills-grid');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            skillGrids.forEach(grid => grid.classList.remove('active-skills-grid'));
            button.classList.add('active');
            const targetGrid = document.getElementById(`${button.dataset.category}-skills`);
            if (targetGrid) targetGrid.classList.add('active-skills-grid');
        });
    });

    // Garante que o grid de 'frontend' esteja ativo ao carregar
    const initialActiveGrid = document.getElementById('frontend-skills');
    if (initialActiveGrid && !initialActiveGrid.classList.contains('active-skills-grid')) {
        initialActiveGrid.classList.add('active-skills-grid');
    }
});

// --- Animação de texto na seção Home ---
const textElement = document.querySelector('.text-animation');
if (textElement) {
    const professions = ["Desenvolvedor Frontend", "Desenvolvedor Backend", "UI/UX Designer", "Desenvolvedor Fullstack"];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentProfession = professions[professionIndex];
        if (isDeleting) {
            textElement.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentProfession.length + 1) {
            setTimeout(() => isDeleting = true, 1500);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
        }

        setTimeout(typeText, isDeleting ? 50 : 100);
    }
    typeText();
}

// --- Lógica para ativar o link de navegação conforme a rolagem e Sticky Header ---
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let header = document.querySelector('header');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (id && navLinks.length > 0 && top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                const currentNavLink = document.querySelector('header nav a[href*=' + id + ']');
                if (currentNavLink) currentNavLink.classList.add('active');
            });
        }
    });

    if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
    }
};

// --- Project Modal Logic (ATUALIZADO) ---
const portfolioBoxes = document.querySelectorAll('.portfolio-box');
const projectModal = document.getElementById('projectModal');
const projectModalCloseBtn = document.querySelector('.project-modal-close-btn'); // Cuidado com a classe, se mudou no HTML do modal
const projectModalImage = document.getElementById('projectModalImage');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalDescription = document.getElementById('projectModalDescription');
const projectModalLink = document.getElementById('projectModalLink');
const projectModalRepo = document.getElementById('projectModalRepo'); // NOVO: Elemento para o link do repositório
const projectModalGallery = document.getElementById('projectModalGallery'); // NOVO: Container da galeria de imagens
const projectModalDetailedReportText = document.getElementById('projectModalDetailedReportText'); // NOVO: Elemento para o relatório detalhado

if (projectModal && projectModalCloseBtn) {
    portfolioBoxes.forEach(box => {
        box.addEventListener('click', () => {
            // Preenche os campos existentes
            projectModalImage.src = box.dataset.projectImg;
            projectModalTitle.textContent = box.dataset.projectTitle;
            projectModalDescription.textContent = box.dataset.projectDescription;
            projectModalLink.href = box.dataset.projectLink;
            projectModalLink.style.display = box.dataset.projectLink && box.dataset.projectLink !== '#' ? 'inline-flex' : 'none'; // Usa 'inline-flex' para combinar com o CSS do botão

            // NOVO: Preenche o link do repositório
            const repoLink = box.dataset.projectRepo;
            if (projectModalRepo) { // Verifica se o elemento existe no HTML do modal
                projectModalRepo.href = repoLink;
                projectModalRepo.style.display = repoLink && repoLink !== '#' ? 'inline-flex' : 'none';
            }

            // NOVO: Preenche as imagens adicionais (galeria)
            if (projectModalGallery) {
                projectModalGallery.innerHTML = ''; // Limpa as imagens anteriores
                const images = [];
                if (box.dataset.projectImg1) images.push(box.dataset.projectImg1);
                if (box.dataset.projectImg2) images.push(box.dataset.projectImg2);
                if (box.dataset.projectImg3) images.push(box.dataset.projectImg3);

                images.forEach(imgSrc => {
                    const imgElement = document.createElement('img');
                    imgElement.src = imgSrc;
                    imgElement.alt = `Detalhe do Projeto ${box.dataset.projectTitle}`;
                    projectModalGallery.appendChild(imgElement);
                });
            }

            // NOVO: Preenche o relatório detalhado
            if (projectModalDetailedReportText) {
                projectModalDetailedReportText.textContent = box.dataset.projectDetailedReport || 'Nenhum relatório detalhado disponível para este projeto.';
            }

            // Exibe o modal
            projectModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede a rolagem do body
        });
    });

    projectModalCloseBtn.addEventListener('click', () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// --- Bloqueio de ações do usuário (opcional) ---
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && ['c', 'u'].includes(e.key)) e.preventDefault();
    if (e.key === 'F12') e.preventDefault();
});

// --- NOVO: Lógica para o Botão Voltar ao Topo ---
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Função para mostrar/esconder o botão
window.onscroll = function() {
    // Mostra o botão se a rolagem for maior que 200px (ou outro valor de sua escolha)
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
};

// Adiciona evento de clique para rolar para o topo (suavemente)
// O 'href="#home"' já faz uma rolagem padrão, mas esta é mais suave
scrollToTopBtn.addEventListener("click", function(e) {
    e.preventDefault(); // Impede o comportamento padrão do link
    window.scrollTo({
        top: 0,
        behavior: "smooth" // Rola suavemente
    });
});
// --- Fim da Lógica do Botão Voltar ao Topo ---