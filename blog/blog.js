// portfolio/blog/blog.js

document.addEventListener('DOMContentLoaded', async () => {
    // URL base da sua API de blog (onde seu backend Node.js está rodando)
    // Se você fez o deploy, use a URL de produção, ex: https://seu-blog-api.herokuapp.com
    const API_BASE_URL = 'https://portfolio-blog-backend-z8mi.onrender.com/api/posts'; // <-- CORREÇÃO AQUI!

    const postsContainer = document.getElementById('postsContainer');
    const blogPostContent = document.getElementById('blogPostContent');
    const postTitleTag = document.getElementById('post-title-tag'); // Para atualizar o <title> da página

    // NOVOS ELEMENTOS PARA COMENTÁRIOS (Adicionados no Passo 24)
    const commentsList = document.getElementById('commentsList'); // Onde os comentários serão exibidos
    const commentForm = document.getElementById('commentForm');   // O formulário de envio de comentários
    const commentAuthorInput = document.getElementById('commentAuthor'); // Campo de autor
    const commentContentInput = document.getElementById('commentContent'); // Campo de conteúdo

    // --- Função para carregar a LISTA de posts (para blog/index.html) ---
    const loadBlogPosts = async () => {
        if (!postsContainer) return; // Se não estiver na página de lista de posts, sai

        postsContainer.innerHTML = '<p>Carregando posts...</p>'; // Mensagem de carregamento

        try {
            const response = await fetch(API_BASE_URL); // Faz a requisição GET para sua API
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const posts = await response.json(); // Converte a resposta para JSON

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>Nenhum post encontrado no momento.</p>';
                return;
            }

            postsContainer.innerHTML = ''; // Limpa a mensagem de carregamento
            posts.forEach(post => {
                const postDate = new Date(post.publishedAt);
                const formattedDate = postDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

                const postCard = `
                    <div class="post-card" data-post-slug="${post.slug}">
                        <img src="${post.thumbnail || '../images/blog/default-thumb.jpg'}" alt="${post.title}">
                        <div class="post-card-content">
                            <h3>${post.title}</h3>
                            <p class="post-card-meta">Publicado em: ${formattedDate} por ${post.author}</p>
                            <p>${post.summary}</p>
                            <div class="post-card-actions">
                                <span class="like-display"><i class='bx bxs-heart'></i> ${post.likes || 0}</span>
                                <a href="post.html?slug=${post.slug}" class="btn">Ler Mais <i class='bx bx-right-arrow-alt'></i></a>
                            </div>
                        </div>
                    </div>
                `;
                postsContainer.innerHTML += postCard;
            });

        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            postsContainer.innerHTML = '<p>Não foi possível carregar os posts. Tente novamente mais tarde.</p>';
        }
    };

    // --- Função para carregar um post ESPECÍFICO (para blog/post.html) ---
    const loadSinglePost = async () => {
        if (!blogPostContent) return; // Se não estiver na página de um único post, sai

        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug'); // Pega o slug da URL (ex: ?slug=meu-primeiro-artigo)

        if (!slug) {
            blogPostContent.innerHTML = '<p>Post não especificado.</p>';
            if (postTitleTag) postTitleTag.textContent = 'Post Não Encontrado';
            return;
        }

        blogPostContent.innerHTML = '<p>Carregando post...</p>';

        try {
            const response = await fetch(`${API_BASE_URL}/${slug}`); // Requisição para /api/posts/:slug
            if (!response.ok) {
                if (response.status === 404) {
                    blogPostContent.innerHTML = '<p>O post que você está procurando não foi encontrado.</p>';
                    if (postTitleTag) postTitleTag.textContent = 'Post Não Encontrado';
                    return;
                }
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const post = await response.json();

            // Atualiza o título da página
            if (postTitleTag) postTitleTag.textContent = `${post.title} - Meu Blog`;

            const postDate = new Date(post.publishedAt);
            const formattedDate = postDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

            blogPostContent.innerHTML = `
                <article class="blog-post-article">
                    <h1>${post.title}</h1>
                    <p class="post-meta">
                        Publicado em: <span>${formattedDate}</span> |
                        Autor: ${post.author} |
                        Visualizações: ${post.views || 0}
                    </p>
                    ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.title}">` : ''}
                    <div class="post-content-html">${post.content}</div>
                    <div class="post-actions">
                        <button class="like-button" data-post-slug="${post.slug}"><i class='bx bx-heart'></i> <span class="like-count">${post.likes || 0}</span> Curtidas</button>
                        <button class="share-button" data-post-title="${post.title}" data-post-url="${window.location.href}">Compartilhar <i class='bx bx-share-alt'></i></button>
                    </div>
                </article>
            `;

            // Adiciona um listener para o botão de curtir
            const likeButton = blogPostContent.querySelector('.like-button');
            if (likeButton) {
                likeButton.addEventListener('click', () => handleLikePost(post.slug));
            }

            // Adiciona um listener para o botão de compartilhar
            const shareButton = blogPostContent.querySelector('.share-button');
            if (shareButton) {
                shareButton.addEventListener('click', () => handleSharePost(shareButton.dataset.postTitle, shareButton.dataset.postUrl));
            }

            // CHAMA A FUNÇÃO PARA CARREGAR E RENDERIZAR OS COMENTÁRIOS DESTE POST (Adicionado no Passo 24)
            await loadComments(slug); // <--- ESTA LINHA FOI ADICIONADA AQUI

        } catch (error) {
            console.error('Erro ao carregar post:', error);
            blogPostContent.innerHTML = '<p>Ocorreu um erro ao carregar o post. Por favor, tente novamente mais tarde.</p>';
            if (postTitleTag) postTitleTag.textContent = 'Erro ao Carregar Post';
        }
    };

    // --- Funções de Ação (Curtir e Compartilhar) ---
    const handleLikePost = async (slug) => {
        try {
            // Requisição PUT para a API de like (você precisará criar esta rota no backend depois)
            const response = await fetch(`${API_BASE_URL}/${slug}/like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Falha ao curtir: ${errorData.msg || response.statusText}`);
            }

            const updatedPost = await response.json();
            const likeCountSpan = document.querySelector(`.like-button[data-post-slug="${slug}"] .like-count`);
            if (likeCountSpan) {
                likeCountSpan.textContent = updatedPost.likes;
            }
            alert(`Você curtiu o post "${updatedPost.title}"! Total de curtidas: ${updatedPost.likes}`);

        } catch (error) {
            console.error('Erro ao curtir o post:', error);
            alert(`Erro ao curtir: ${error.message}`);
        }
    };

    const handleSharePost = (title, url) => {
        if (navigator.share) { // Web Share API (para navegadores modernos)
            navigator.share({
                title: title,
                url: url
            }).then(() => {
                console.log('Conteúdo compartilhado com sucesso!');
            }).catch(error => {
                console.error('Erro ao compartilhar:', error);
            });
        } else {
            // Fallback para navegadores que não suportam Web Share API
            navigator.clipboard.writeText(url)
                .then(() => {
                    alert(`Link copiado para a área de transferência: ${url}\nCompartilhe "${title}"`);
                })
                .catch(err => {
                    console.error('Falha ao copiar o link:', err);
                    alert('Não foi possível copiar o link. Por favor, copie manualmente: ' + url);
                });
        }
    };

    // --- Função para renderizar os comentários (Adicionado no Passo 24) ---
    const renderComments = (comments) => {
        if (!commentsList) return;

        commentsList.innerHTML = ''; // Limpa a lista existente

        if (comments.length === 0) {
            commentsList.innerHTML = '<p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
            return;
        }

        comments.forEach(comment => {
            const commentDate = new Date(comment.publishedAt);
            const formattedDate = commentDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

            const commentElement = `
                <div class="comment-item">
                    <p class="comment-author">${comment.author}</p>
                    <p class="comment-content">${comment.content}</p>
                    <p class="comment-date">Comentado em: ${formattedDate}</p>
                </div>
            `;
            commentsList.innerHTML += commentElement;
        });
    };

    // --- Função para carregar comentários de um post (chamada por loadSinglePost - Adicionado no Passo 24) ---
    const loadComments = async (slug) => {
        if (!commentsList) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${slug}/comments`);
            if (!response.ok) {
                throw new Error(`Erro HTTP ao carregar comentários! Status: ${response.status}`);
            }
            const comments = await response.json();
            renderComments(comments); // Renderiza os comentários
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            commentsList.innerHTML = '<p>Não foi possível carregar os comentários.</p>';
        }
    };

    // --- Função para enviar um novo comentário (Adicionado no Passo 24) ---
    const submitComment = async (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug'); // Pega o slug da URL do post

        const author = commentAuthorInput.value.trim();
        const content = commentContentInput.value.trim();

        if (!slug || !author || !content) {
            alert('Por favor, preencha todos os campos do comentário.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${slug}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ author, content })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Falha ao enviar comentário: ${errorData.msg || response.statusText}`);
            }

            const newComment = await response.json();
            alert('Comentário enviado com sucesso!');

            // Limpa o formulário
            commentAuthorInput.value = '';
            commentContentInput.value = '';

            // Recarrega os comentários para incluir o novo
            loadComments(slug);

        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            alert(`Erro ao enviar comentário: ${error.message}`);
        }
    };

    // --- Decide qual função carregar com base na URL ---
    // Se a URL for blog/index.html (ou apenas /blog/ no deploy), carrega a lista
    if (window.location.pathname.includes('/blog/index.html') || window.location.pathname.endsWith('/blog/')) {
        loadBlogPosts();
    }
    // Se a URL for blog/post.html?slug=..., carrega um único post
    else if (window.location.pathname.includes('/blog/post.html')) {
        loadSinglePost();
    }

    // --- NOVO: Adicionar listener ao formulário de comentário (Adicionado no Passo 24) ---
    if (commentForm) { // Garante que o formulário existe na página atual
        commentForm.addEventListener('submit', submitComment);
    }
});