// Animação de texto na seção Home
const textElement = document.querySelector('.text-animation');
const professions = ["Desenvolvedor", "Designer", "Programador"]; // Suas profissões para a animação
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

// Lógica para o menu hamburguer (abrir/fechar)
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x'); // Alterna o ícone de menu para 'X'
    navbar.classList.toggle('active'); // Alterna a classe 'active' para mostrar/esconder o menu
};

// Lógica para ativar o link de navegação conforme a rolagem da página
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150; // Ajusta o offset para quando a seção começa a ser visível
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    // Fecha o menu hamburguer ao rolar a página (melhora a usabilidade móvel)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// Lógica para enviar o formulário de contato via AJAX para o seu backend Node.js
const contactForm = document.getElementById('contactForm'); // Pega o formulário pelo ID

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