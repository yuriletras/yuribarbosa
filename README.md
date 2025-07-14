# 🚀 Meu Portfólio Pessoal

Bem-vindo ao repositório do meu portfólio pessoal! Este projeto foi desenvolvido para exibir minhas habilidades, projetos e informações de contato de forma interativa e visualmente atraente.

## ✨ Visão Geral

Este portfólio serve como uma vitrine digital, destacando minha jornada, experiência e o que eu posso oferecer. Ele é responsivo, garantindo uma excelente experiência de usuário em diversos dispositivos.

## 🌟 Funcionalidades Principais

* **Seção Início:** Uma introdução sobre mim com uma foto marcante.
* **Sobre Mim:** Detalhes sobre minha trajetória, paixões e o download do meu currículo.
* **Minhas Habilidades:** Uma visão geral das tecnologias e competências que domino.
* **Meus Projetos (Portfólio):** Uma galeria dinâmica dos meus trabalhos mais relevantes.
* **Entre em Contato:** Formulário de contato fácil de usar para comunicação direta, **com backend dedicado para envio de e-mails**.
* **Tema Claro/Escuro:** Alternância de temas para uma experiência de visualização personalizada.
* **Responsividade:** Design adaptável para desktop, tablet e mobile.
* **Animações Suaves:** Transições e efeitos visuais para uma navegação fluida.
* **Proteção de Imagens:** Recursos básicos para dificultar a cópia de imagens.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

### Frontend
* **HTML5:** Estrutura semântica e acessível do conteúdo.
* **CSS3:** Estilização e design responsivo, incluindo variáveis CSS para temas.
* **JavaScript:** Interatividade, animações e lógica de UI.
* **Boxicons:** Biblioteca de ícones vetoriais.
* **Google Fonts:** Para tipografia personalizada (`Montserrat`).

### Backend (Formulário de Contato)
* **Node.js:** Ambiente de execução JavaScript para o servidor.
* **Express.js:** Framework web para construir a API REST do servidor.
* **Nodemailer:** Biblioteca para envio de e-mails através do servidor SMTP (usado com Yahoo Mail).
* **Dotenv:** Para gerenciamento seguro de variáveis de ambiente.
* **CORS:** Configurado para permitir requisições do frontend para o backend.

## 📂 Estrutura do Projeto

A organização do projeto segue uma estrutura clara e modular para facilitar a manutenção e futuras expansões:

![Estrutura](https://github.com/yuriletras/yuribarbosa/blob/main/img/pastas.PNG?raw=true)

Você está absolutamente correto novamente! Peço desculpas pela confusão persistente. Eu acabei inserindo o bloco de código dentro de outro bloco de código, o que o impediu de renderizar como Markdown.

Aqui está apenas a estrutura de pastas, formatada corretamente em um bloco de código Markdown desta vez:



**Observações:** No ambiente Windows, algumas extensões de arquivo podem estar ocultas por padrão. `index` refere-se a `index.html`, `package` a `package.json`, `script` a `script.js`, `server` a `server.js` e `style` a `style.css`.

## 🚀 Como Executar Localmente

Siga estas instruções para ter uma cópia local do projeto em execução:

### Frontend
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SeuNomeDeUsuario/NomeDoSeuRepositorio.git](https://github.com/SeuNomeDeUsuario/NomeDoSeuRepositorio.git)
    # Ex: git clone [https://github.com/YuriBarbosa/meu-portfolio.git](https://github.com/YuriBarbosa/meu-portfolio.git)
    ```
2.  **Navegue até o diretório do projeto:**
    ```bash
    cd NomeDoSeuRepositorio
    ```
3.  **Abra o `index` (ou `index.html`):**
    Basta abrir o arquivo `index` (ou `index.html` se a extensão estiver visível) em seu navegador de preferência.

### Backend (Formulário de Contato)
O formulário de contato requer um servidor Node.js para enviar e-mails.

1.  **Navegue até o diretório raiz do projeto:**
    ```bash
    cd NomeDoSeuRepositorio
    ```
    (Como `server`, `package` e `node_modules` estão na raiz, você não precisa entrar em uma subpasta `backend` para os comandos NPM).
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Crie um arquivo `.env`:**
    Crie um arquivo chamado `.env` na pasta raiz do projeto (ao lado de `server` / `server.js`) e adicione suas credenciais do Yahoo Mail:
    ```
    EMAIL_USER=seu_email_yahoo@yahoo.com
    EMAIL_PASS=sua_senha_de_aplicativo_yahoo # Use uma senha de aplicativo se o 2FA estiver ativado!
    PORT=3001 # Ou outra porta que preferir
    ```
    **Importante:** Nunca envie o arquivo `.env` para o GitHub. Ele deve ser ignorado pelo Git (adicione `.env` ao seu `.gitignore` na raiz do projeto).

4.  **Inicie o servidor:**
    ```bash
    node server # ou node server.js se a extensão for necessária
    ```
    O servidor estará rodando em `http://localhost:3001` (ou a porta que você configurou).

5.  **Ajuste o frontend para apontar para o backend local (para testes):**
    No seu arquivo `script` (ou `js/script.js` se já tiver mudado) do frontend, localize a URL onde você faz a requisição `fetch` para o backend e altere-a temporariamente para `http://localhost:3001/send-email` (lembre-se de reverter para a URL de produção antes de fazer o deploy final do frontend!).

## 📸 Demonstração do Site

Aqui estão algumas capturas de tela para você ter uma ideia de como o portfólio se parece:

### Visualização Desktop - Seção Início

![Captura de tela da seção Início em desktop](https://github.com/yuriletras/yuribarbosa/blob/main/img/tela%20de%20inicio.PNG?raw=true)

### Visualização Mobile - Menu Hamburger

![Captura de tela do menu mobile](https://github.com/yuriletras/yuribarbosa/blob/main/img/menu%20mobile.PNG?raw=true)

### Visualização Desktop - Seção Projetos

![Captura de tela da seção Projetos em desktop](https://github.com/yuriletras/yuribarbosa/blob/main/img/meus%20projetos.PNG?raw=true)

### Visualização Tema Claro

![Captura de tela do tema claro](https://github.com/yuriletras/yuribarbosa/blob/main/img/tema%20claro.PNG?raw=true)

## 📧 Contato

Sinta-se à vontade para entrar em contato através do meu portfólio ou pelas minhas redes sociais.

* **LinkedIn:** [LinkedIn](https://www.linkedin.com/in/yuri-basi)
* **GitHub:** [Seu Perfil no GitHub]([https://github.com/yuriletras/)

---
![Captura de tela da seção Projetos em desktop](https://github.com/yuriletras/yuribarbosa/blob/main/img/marca%20dagua%202%20(4).png?raw=true)
