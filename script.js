// Ativar o menu mobile
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Fechar o menu ao clicar em um link
document.querySelectorAll('.navbar a').forEach(link => {
    link.onclick = () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    };
});

// Efeito de escrita na Home
const typed = new Typed('.text-animation', {
    strings: ['Desenvolvedor', 'Full-Stack', 'Inovador'],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true,
});

// Lógica de animação na rolagem usando Intersection Observer
const pageContents = document.querySelectorAll('.page-content');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-animate');
        } else {
            entry.target.classList.remove('show-animate');
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1
});

pageContents.forEach(element => {
    observer.observe(element);
});

// Ativar link da navbar na rolagem e sticky header
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });

    // Sticky header
    let header = document.querySelector('.header');
    header.classList.toggle('sticky', window.scrollY > 100);
};

// Modal de Habilidades
const skillModal = document.getElementById('skillModal');
const closeSkillModal = document.querySelector('.skill-modal-close-btn');
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('click', (event) => {
        const skillId = event.currentTarget.dataset.skillId;
        const skillDetails = getSkillDetails(skillId);
        document.getElementById('skillModalTitle').innerText = skillDetails.title;
        document.getElementById('skillModalDescription').innerText = skillDetails.description;
        skillModal.classList.add('show');
    });
});

closeSkillModal.onclick = () => {
    skillModal.classList.remove('show');
};

skillModal.onclick = (e) => {
    if (e.target.classList.contains('skill-modal')) {
        skillModal.classList.remove('show');
    }
};

function getSkillDetails(skillId) {
    const details = {
        html: {
            title: 'HTML',
            description: 'Conhecimento aprofundado em HTML5 para estruturar páginas web de forma semântica e acessível.'
        },
        css: {
            title: 'CSS',
            description: 'Experiência em CSS3 e pré-processadores como SASS, criando layouts modernos e responsivos.'
        },
        javascript: {
            title: 'JavaScript',
            description: 'Domínio em JavaScript puro (ES6+) para construir funcionalidades dinâmicas e interativas.'
        },
        react: {
            title: 'React',
            description: 'Habilidade na biblioteca React para criar interfaces de usuário reutilizáveis e escaláveis.'
        },
        bootstrap: {
            title: 'Bootstrap',
            description: 'Utilização do framework Bootstrap para agilizar o desenvolvimento de designs responsivos.'
        },
        figma: {
            title: 'Figma',
            description: 'Criação de protótipos e designs de interface de usuário (UI) e experiência de usuário (UX) utilizando Figma.'
        },
        nodejs: {
            title: 'Node.js',
            description: 'Desenvolvimento de aplicações e APIs de backend com Node.js e o framework Express.js.'
        },
        java: {
            title: 'Java',
            description: 'Experiência com a linguagem Java para desenvolvimento de aplicações desktop e backend robustas.'
        },
        git: {
            title: 'Git',
            description: 'Utilização de Git para controle de versão, colaboração em equipe e gestão de código-fonte.'
        },
        github: {
            title: 'GitHub',
            description: 'Colaboração em projetos, hospedagem de repositórios e gestão de issues no GitHub.'
        },
        vercel: {
            title: 'Vercel',
            description: 'Hospedagem e deploy de aplicações web de forma contínua e eficiente utilizando a plataforma Vercel.'
        }
    };
    return details[skillId] || { title: 'Habilidade', description: 'Descrição da habilidade.' };
}

// Botões de categorias de habilidades
const categoryButtons = document.querySelectorAll('.category-btn');
const skillsGrids = document.querySelectorAll('.skills-grid');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        const category = button.dataset.category;
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        skillsGrids.forEach(grid => {
            if (grid.id.includes(category)) {
                grid.classList.add('active-skills-grid');
            } else {
                grid.classList.remove('active-skills-grid');
            }
        });
    });
});

// Modal de Projetos
const projectModal = document.getElementById('projectModal');
const closeProjectModal = document.querySelector('.project-modal-close-btn');
const portfolioBoxes = document.querySelectorAll('.portfolio-box');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalDescription = document.getElementById('projectModalDescription');
const projectModalImage = document.getElementById('projectModalImage');
const projectModalLink = document.getElementById('projectModalLink');
const projectModalRepo = document.getElementById('projectModalRepo');
const projectModalDetailedReportText = document.getElementById('projectModalDetailedReportText');
const projectModalGallery = document.getElementById('projectModalGallery');

portfolioBoxes.forEach(box => {
    box.addEventListener('click', (event) => {
        const project = event.currentTarget;
        projectModalTitle.innerText = project.dataset.projectTitle;
        projectModalDescription.innerText = project.dataset.projectDescription;
        projectModalImage.src = project.dataset.projectImg;
        projectModalLink.href = project.dataset.projectLink;
        projectModalRepo.href = project.dataset.projectRepo;
        projectModalDetailedReportText.innerText = project.dataset.projectDetailedReport;

        projectModalGallery.innerHTML = '';
        ['projectImg1', 'projectImg2', 'projectImg3'].forEach(imgData => {
            if (project.dataset[imgData]) {
                const img = document.createElement('img');
                img.src = project.dataset[imgData];
                img.alt = `Gallery image for ${project.dataset.projectTitle}`;
                img.classList.add('gallery-thumbnail');
                projectModalGallery.appendChild(img);
            }
        });

        projectModal.classList.add('show');
    });
});

closeProjectModal.onclick = () => {
    projectModal.classList.remove('show');
};

projectModal.onclick = (e) => {
    if (e.target.classList.contains('project-modal-overlay')) {
        projectModal.classList.remove('show');
    }
};

// Lidar com a troca de imagem no modal de projeto
projectModalGallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        projectModalImage.src = e.target.src;
    }
});

// Scroll to Top button
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Lógica de formulário de contato
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    fetch(contactForm.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        contactForm.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocorreu um erro ao enviar a mensagem.');
    });
});