document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica para Alternância de Tema (Modo Claro/Escuro) ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body; // Referência ao elemento <body>

    // Verifica a preferência de tema salva no localStorage
    const savedTheme = localStorage.getItem('theme');

    // Aplica o tema salvo na inicialização da página
    if (savedTheme) {
        body.classList.add(savedTheme); // Adiciona a classe 'light-theme' ou 'dark-theme' se for o tema salvo
        // Atualiza o ícone com base no tema carregado
        if (savedTheme === 'light-theme') {
            themeToggle.classList.remove('bx-moon');
            themeToggle.classList.add('bx-sun'); // Ícone de sol para tema claro
        } else {
            themeToggle.classList.remove('bx-sun');
            themeToggle.classList.add('bx-moon'); // Ícone de lua para tema escuro
        }
    } else {
        // Se não houver preferência salva, define o tema escuro como padrão e o ícone de lua
        body.classList.remove('light-theme'); // Garante que o tema escuro é o padrão visualmente
        themeToggle.classList.remove('bx-sun');
        themeToggle.classList.add('bx-moon');
        // Opcional: Salvar 'dark-theme' como padrão inicial se não houver preferência
        // localStorage.setItem('theme', 'dark-theme');
    }

    // Adiciona o event listener para o clique no botão de alternância
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme'); // Alterna a classe 'light-theme' no body

        // Atualiza o ícone e salva a preferência
        if (body.classList.contains('light-theme')) {
            themeToggle.classList.remove('bx-moon');
            themeToggle.classList.add('bx-sun');
            localStorage.setItem('theme', 'light-theme'); // Salva 'light-theme'
        } else {
            themeToggle.classList.remove('bx-sun');
            themeToggle.classList.add('bx-moon');
            localStorage.setItem('theme', 'dark-theme'); // Salva 'dark-theme'
        }
    });

    // --- Lógica para enviar o formulário de contato via AJAX para o seu backend Node.js ---
    const contactForm = document.getElementById('contactForm'); // Pega o formulário pelo ID

    // Verifica se o formulário de contato existe na página antes de adicionar o event listener
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)

            const formData = new FormData(contactForm); // Coleta todos os dados do formulário
            const formProps = Object.fromEntries(formData); // Converte FormData para um objeto simples (chave:valor)

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Informa ao backend que estamos enviando JSON
                    },
                    body: JSON.stringify(formProps) // Converte o objeto JavaScript em uma string JSON
                });

                // Verifica se a resposta do servidor foi bem-sucedida (status 2xx)
                if (response.ok) {
                    const data = await response.json(); // Analisa a resposta JSON do backend
                    alert(data.msg); // Exibe a mensagem de sucesso (ex: "Mensagem enviada com sucesso!")
                    contactForm.reset(); // Limpa todos os campos do formulário após o envio
                } else {
                    const errorData = await response.json(); // Pega a mensagem de erro do backend
                    alert(errorData.msg || 'Erro desconhecido ao enviar mensagem.'); // Exibe a mensagem de erro
                }
            } catch (error) {
                console.error('Erro de rede ou ao enviar mensagem:', error);
                alert('Ocorreu um erro na comunicação com o servidor. Por favor, tente novamente mais tarde.');
            }
        });
    } else {
        console.warn("Elemento 'contactForm' não encontrado. O script de envio de formulário não será ativado.");
    }

    // --- Lógica para o menu hamburguer (abrir/fechar) ---
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.onclick = () => {
            menuIcon.classList.toggle('bx-x'); // Alterna o ícone de menu para 'X'
            navbar.classList.toggle('active'); // Alterna a classe 'active' para mostrar/esconder o menu
        };
    } else {
        console.warn("Elementos de menu (menuIcon ou navbar) não encontrados.");
    }

    // --- Lógica para o botão "Ver Todos" na seção Portfólio e integração com AutoScroll ---
    const portfolioContainerById = document.getElementById('portfolioContainer');
    const viewAllProjectsBtn = document.getElementById('viewAllProjectsBtn');

    // Variável para controlar a animação de auto-scroll
    let animationFrameId;

    // Função para iniciar a rolagem automática
    function startAutoScroll() {
        // Apenas inicia se o container estiver no modo de rolagem (sem a classe 'show-all')
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

    // Função para parar a rolagem automática
    function stopAutoScroll() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null; // Zera a ID do frame de animação
        }
    }

    // Inicializa a rolagem automática se o container existir e não estiver no modo 'show-all'
    if (portfolioContainerById) {
        // Pausa ao passar o mouse, e só retoma se não estiver no modo "Ver Todos"
        portfolioContainerById.addEventListener('mouseenter', stopAutoScroll);
        portfolioContainerById.addEventListener('mouseleave', () => {
            if (!portfolioContainerById.classList.contains('show-all')) {
                startAutoScroll();
            }
        });
        // Inicia a rolagem automática na carga inicial
        startAutoScroll();
    }

    if (portfolioContainerById && viewAllProjectsBtn) {
        viewAllProjectsBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Impede o comportamento padrão do link

            portfolioContainerById.classList.toggle('show-all');

            if (portfolioContainerById.classList.contains('show-all')) {
                viewAllProjectsBtn.textContent = 'Ver Menos';
                stopAutoScroll(); // Para a rolagem automática quando mostra todos
                // Opcional: Se quiser que ele role para o topo da seção de portfólio
                // quando você clica em "Ver Todos", descomente a linha abaixo.
                // document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
            } else {
                viewAllProjectsBtn.textContent = 'Ver Todos';
                // Reinicia a rolagem automática quando volta ao modo de rolagem
                startAutoScroll();
            }
        });
    } else {
        console.warn("Elementos 'portfolioContainer' ou 'viewAllProjectsBtn' não encontrados. A funcionalidade 'Ver Todos' não será ativada.");
    }

    // --- Lógica para o Modal de Habilidades e Filtragem de Categorias (INTEGRADO) ---
    const skillItems = document.querySelectorAll('.skill-item');
    const skillModal = document.getElementById('skillModal');
    const modalSkillTitle = document.getElementById('skillModalTitle');
    const modalSkillDescription = document.getElementById('skillModalDescription');
    const skillModalCloseBtn = document.querySelector('.skill-modal-close-btn');

    // Mapeamento de detalhes das habilidades (ADICIONADO VERCEL)
    // ATENÇÃO: Certifique-se que este objeto está completo com TODAS as suas habilidades
    // e as descrições que você quer que apareçam no modal.
    const skillDetails = {
        html: { title: 'HTML5', description: 'Domínio em HTML5 para estruturação semântica e acessível de conteúdo web, focando em estruturação, acessibilidade e SEO para garantir uma base sólida e performática.' },
        css: { title: 'CSS3', description: 'Criação de estilos responsivos e visualmente atraentes, utilizando CSS3 para design moderno, animações e transições fluidas, garantindo compatibilidade entre navegadores.' },
        javascript: { title: 'JavaScript', description: 'Experiência em lógica de programação e desenvolvimento de funcionalidades interativas para a web, incluindo manipulação do DOM, requisições assíncronas e otimização de performance.' },
        react: { title: 'React', description: 'Construção de interfaces de usuário modernas e eficientes com a biblioteca React.js, aplicando conceitos de componentes, estado, hooks e gerenciamento de dados.' },
        bootstrap: { title: 'Bootstrap', description: 'Utilização do framework Bootstrap para desenvolvimento front-end rápido e responsivo, criando layouts adaptáveis e componentes pré-estilizados de forma eficiente.' },
        git: { title: 'Git', description: 'Controle de versão de projetos com Git, gerenciando histórico de código, ramificações (branches), fusões (merges) e resolução de conflitos para trabalho em equipe.' },
        github: { title: 'GitHub', description: 'Plataforma de colaboração para versionamento de código e gerenciamento de projetos em equipe, incluindo criação de repositórios, pull requests e issues tracking.' },
        figma: { title: 'Figma', description: 'Criação de designs de interface de usuário (UI) e protótipos interativos para web e mobile, com foco em usabilidade e experiência do usuário (UX).' },
        nodejs: { title: 'Node.js', description: 'Desenvolvimento de aplicações back-end escaláveis e APIs com Node.js, utilizando Express.js para criação de rotas, middlewares e integração com bancos de dados.' },
        java: { title: 'Java', description: 'Programação orientada a objetos para aplicações robustas e sistemas empresariais, com experiência em Spring Boot, APIs RESTful e integração com sistemas legados.' },
        vercel: { title: 'Vercel', description: 'Plataforma de deployment para sites e aplicações web, com foco em front-ends modernos e Serverless Functions. Oferece deploy contínuo e CDN global, facilitando a entrega rápida de aplicações.' } // Adicionei a descrição para Vercel
    };


    if (skillItems.length > 0 && skillModal && modalSkillTitle && modalSkillDescription && skillModalCloseBtn) {
        skillItems.forEach(item => {
            item.addEventListener('click', () => {
                const skillId = item.dataset.skillId;
                const details = skillDetails[skillId];

                if (details) {
                    modalSkillTitle.textContent = details.title;
                    modalSkillDescription.textContent = details.description;

                    skillModal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Impede a rolagem do body quando o modal está aberto
                } else {
                    console.warn(`Detalhes da habilidade com ID '${skillId}' não encontrados no objeto skillDetails.`);
                }
            });
        });

        // Fechar o modal ao clicar no botão 'X'
        skillModalCloseBtn.addEventListener('click', () => {
            skillModal.classList.remove('active');
            document.body.style.overflow = ''; // Restaura a rolagem do body
        });

        // Fechar o modal ao clicar fora do conteúdo do modal
        skillModal.addEventListener('click', (event) => {
            if (event.target === skillModal) {
                skillModal.classList.remove('active');
                document.body.style.overflow = ''; // Restaura a rolagem do body
            }
        });

        // Fechar o modal ao pressionar a tecla ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && skillModal.classList.contains('active')) {
                skillModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

    } else {
        console.warn("Elementos essenciais do modal de habilidades ou skill items ausentes. A funcionalidade de modal de habilidades não será ativada.");
    }

    // --- Lógica para filtrar habilidades por categoria (NOVO BLOCO) ---
    const categoryButtons = document.querySelectorAll('.category-btn');
    const skillGrids = document.querySelectorAll('.skills-grid');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Remove a classe 'active-skills-grid' de todos os grids de habilidades
            skillGrids.forEach(grid => grid.classList.remove('active-skills-grid'));

            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');

            // Pega a categoria do botão clicado (ex: 'frontend', 'backend', 'devops')
            const targetCategory = button.dataset.category;

            // Encontra o grid de habilidades correspondente e adiciona a classe 'active-skills-grid'
            const targetGrid = document.getElementById(`${targetCategory}-skills`);
            if (targetGrid) {
                targetGrid.classList.add('active-skills-grid');
            }
        });
    });

    // Garante que o grid de 'frontend' esteja ativo ao carregar a página
    // Isso é importante caso você não tenha 'active-skills-grid' no HTML inicial
    const initialActiveGrid = document.getElementById('frontend-skills');
    if (initialActiveGrid && !initialActiveGrid.classList.contains('active-skills-grid')) {
        initialActiveGrid.classList.add('active-skills-grid');
    }

}); // Fim de DOMContentLoaded para tudo que depende do DOM

// --- Animação de texto na seção Home (mantida fora do DOMContentLoaded para otimização,
// já que o textElement pode ser rapidamente acessível) ---
const textElement = document.querySelector('.text-animation');

// Somente tenta rodar a animação se o elemento .text-animation existir
if (textElement) {
    const professions = ["Desenvolvedor Frontend", "Desenvolvedor Backend", "UI/UX Designer", "Desenvolvedor Fullstack"]; // Suas profissões para a animação
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
            setTimeout(() => isDeleting = true, 1500); // Espera antes de deletar o texto
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length; // Passa para a próxima profissão
        }

        const typingSpeed = isDeleting ? 50 : 100; // Velocidade de digitação e deleção
        setTimeout(typeText, typingSpeed);
    }

    typeText(); // Inicia a animação ao carregar a página
} else {
    console.warn("Elemento '.text-animation' não encontrado. A animação de texto não será ativada.");
}


// --- Lógica para ativar o link de navegação conforme a rolagem da página e Sticky Header ---
// Mantida fora do DOMContentLoaded, pois 'window.onscroll' é um evento global e não depende
// diretamente do DOM carregar, mas sim da existência dos elementos que ele manipula.
// As verificações de 'if (element)' já garantem a segurança.
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let header = document.querySelector('header');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150; // Ajusta o offset para quando a seção começa a ser visível
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        // Verifica se o ID da seção existe e se os navLinks foram encontrados
        if (id && navLinks.length > 0 && top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                // Adicionado verificação para garantir que o link existe antes de adicionar a classe
                const currentNavLink = document.querySelector('header nav a[href*=' + id + ']');
                if (currentNavLink) {
                    currentNavLink.classList.add('active');
                }
            });
        }
    });

    // --- Sticky navbar (Cabeçalho fixo ao rolar) ---
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
    } else {
        console.warn("Elemento 'header' não encontrado.");
    }

    // --- Fecha o menu hamburguer ao rolar a página (melhora a usabilidade móvel) ---
    // Apenas se o menu estiver ativo
    if (menuIcon && navbar && menuIcon.classList.contains('bx-x')) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    }
};

// Bloqueia o clique com o botão direito em todo o documento
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Opcional: Bloqueia a combinação Ctrl+C / Cmd+C para cópia de texto
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'c' || e.metaKey && e.key === 'c') { // Ctrl+C ou Cmd+C
        e.preventDefault();
    }
});

// Opcional: Bloqueia a combinação Ctrl+U / Cmd+U para ver o código fonte
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'u' || e.metaKey && e.key === 'u') { // Ctrl+U ou Cmd+U
        e.preventDefault();
    }
});

// Opcional: Bloqueia a tecla F12 (para abrir ferramentas de desenvolvedor)
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        e.preventDefault();
    }
});

// --- Project Modal Logic ---
const portfolioBoxes = document.querySelectorAll('.portfolio-box');
const projectModal = document.getElementById('projectModal');
const projectModalCloseBtn = document.querySelector('.project-modal-close-btn');
const projectModalImage = document.getElementById('projectModalImage');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalDescription = document.getElementById('projectModalDescription');
const projectModalLink = document.getElementById('projectModalLink');

portfolioBoxes.forEach(box => {
    box.addEventListener('click', () => {
        // Obter dados do projeto do data-attributes
        const imgSrc = box.dataset.projectImg;
        const title = box.dataset.projectTitle;
        const description = box.dataset.projectDescription;
        const link = box.dataset.projectLink;

        // Preencher o modal com os dados
        projectModalImage.src = imgSrc;
        projectModalImage.alt = title; // Boa prática para acessibilidade
        projectModalTitle.textContent = title;
        projectModalDescription.textContent = description;
        projectModalLink.href = link;

        // Mostrar o botão "Ver Projeto" apenas se houver um link válido
        if (link && link !== '#') {
            projectModalLink.style.display = 'inline-block';
        } else {
            projectModalLink.style.display = 'none'; // Esconde se não houver link
        }

        // Adicionar classe 'active' para exibir o modal
        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita scroll da página principal
    });
});

// Fechar modal ao clicar no 'x'
projectModalCloseBtn.addEventListener('click', () => {
    projectModal.classList.remove('active');
    document.body.style.overflow = ''; // Restaura scroll da página
});

// Fechar modal ao clicar fora do conteúdo do modal
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) { // Verifica se o clique foi no overlay, não no conteúdo
        projectModal.classList.remove('active');
        document.body.style.overflow = ''; // Restaura scroll da página
    }
});

// Fechar modal ao pressionar ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});