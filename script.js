// script.js

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

    // --- Lógica para o Modal de Habilidades ---
    const skillItems = document.querySelectorAll('.skill-item');
    const skillModal = document.getElementById('skill-modal');
    const modalSkillTitle = document.getElementById('modal-skill-title');
    const modalSkillDescription = document.getElementById('modal-skill-description');
    const skillModalCloseBtn = document.querySelector('.skill-modal-close-btn');
    const fullSkillDescriptionsContainer = document.getElementById('full-skill-descriptions'); // Onde estão as descrições completas

    if (skillItems.length > 0 && skillModal && modalSkillTitle && modalSkillDescription && skillModalCloseBtn && fullSkillDescriptionsContainer) {
        skillItems.forEach(item => {
            item.addEventListener('click', (event) => {
                // Verifica se o clique foi no botão "Ver Detalhes" ou em qualquer parte do skill-item
                const readMoreBtn = item.querySelector('.read-more-btn');
                
                // Se o clique foi no "Ver Detalhes" ou no skill-item em si (mas não no p.skill-description)
                // Usamos `!event.target.classList.contains('skill-description')` para evitar abrir o modal
                // se o clique foi especificamente no pequeno resumo (p)
                if (readMoreBtn && (readMoreBtn.contains(event.target) || event.target === item || event.target.tagName === 'H3' || event.target.tagName === 'I')) {
                    const skillId = item.dataset.skillId; // Pega o ID da habilidade do data-attribute
                    if (skillId) {
                        const fullDescriptionElement = fullSkillDescriptionsContainer.querySelector(`#desc-${skillId}`);

                        if (fullDescriptionElement) {
                            const title = fullDescriptionElement.querySelector('h4') ? fullDescriptionElement.querySelector('h4').textContent : '';
                            const description = fullDescriptionElement.querySelector('p') ? fullDescriptionElement.querySelector('p').textContent : '';

                            modalSkillTitle.textContent = title;
                            modalSkillDescription.textContent = description;
                            skillModal.classList.add('active'); // Adiciona a classe 'active' para mostrar o modal
                            document.body.style.overflow = 'hidden'; // Impede a rolagem do body quando o modal está aberto

                            // Opcional: Remover a classe 'active' do skill-item quando o modal abre
                            // item.classList.remove('active'); // Se você tinha uma classe 'active' para mostrar o resumo curto
                        } else {
                            console.warn(`Descrição completa para a habilidade com ID '${skillId}' não encontrada.`);
                        }
                    } else {
                        console.warn("Skill item sem 'data-skill-id'. Não é possível abrir o modal.");
                    }
                } else if (event.target.classList.contains('skill-description')) {
                    // Se o clique foi no breve resumo (p.skill-description), faz o toggle da classe 'active'
                    // Isso mantém a funcionalidade original de mostrar/esconder o breve resumo se você ainda a quiser.
                    item.classList.toggle('active');
                    skillItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
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
            if (event.target === skillModal) { // Se o clique foi no overlay (o próprio modal), não no conteúdo
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
        console.warn("Elementos do modal de habilidades não encontrados ou skill items ausentes. A funcionalidade de modal de habilidades não será ativada.");
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