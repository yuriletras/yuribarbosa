// portfolio/blog/blog.js

document.addEventListener('DOMContentLoaded', async () => {
    // URL base da sua API de blog (onde seu backend Node.js está rodando)
    // AQUI É A ÚNICA MUDANÇA: REMOVA O "/api/posts" DA URL BASE
    const API_BASE_URL = 'https://portfolio-blog-backend-z8mi.onrender.com'; // <--- CORREÇÃO AQUI!

    const postsContainer = document.getElementById('postsContainer');
    const blogPostContent = document.getElementById('blogPostContent');
    const postTitleTag = document.getElementById('post-title-tag');

    const commentsList = document.getElementById('commentsList');
    const commentForm = document.getElementById('commentForm');
    const commentAuthorInput = document.getElementById('commentAuthor');
    const commentContentInput = document.getElementById('commentContent');

    // --- Função para carregar a LISTA de posts (para blog/index.html) ---
    const loadBlogPosts = async () => {
        if (!postsContainer) return;

        postsContainer.innerHTML = '<p>Carregando posts...</p>';

        try {
            // AGORA ADICIONE O "/api/posts" AQUI NA CHAMADA FETCH
            const response = await fetch(`${API_BASE_URL}/api/posts`); // <--- CORREÇÃO AQUI!
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const posts = await response.json();

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>Nenhum post encontrado no momento.</p>';
                return;
            }

            postsContainer.innerHTML = '';
            posts.forEach(post => {
                const postDate = new Date(post.publishedAt);
                const formattedDate = postDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });

                const postCard = `
                    <div class="post-card" data-post-id="${post._id}">
                        <img src="${post.thumbnail || '../images/blog/default-thumb.jpg'}" alt="${post.title}">
                        <div class="post-card-content">
                            <h3>${post.title}</h3>
                            <p class="post-card-meta">Publicado em: ${formattedDate} por ${post.author}</p>
                            <p>${post.summary}</p>
                            <div class="post-card-actions">
                                <span class="like-display"><i class='bx bxs-heart'></i> ${post.likes || 0}</span>
                                <a href="post.html?id=${post._id}" class="btn">Ler Mais <i class='bx bx-right-arrow-alt'></i></a>
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
        if (!blogPostContent) return;

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        if (!postId) {
            blogPostContent.innerHTML = '<p>Post não especificado.</p>';
            if (postTitleTag) postTitleTag.textContent = 'Post Não Encontrado';
            return;
        }

        blogPostContent.innerHTML = '<p>Carregando post...</p>';

        try {
            // AGORA ADICIONE O "/api/posts" AQUI NA CHAMADA FETCH
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`); // <--- CORREÇÃO AQUI!
            if (!response.ok) {
                if (response.status === 404) {
                    blogPostContent.innerHTML = '<p>O post que você está procurando não foi encontrado.</p>';
                    if (postTitleTag) postTitleTag.textContent = 'Post Não Encontrado';
                    return;
                }
                if (response.status === 400) {
                    blogPostContent.innerHTML = '<p>O ID do post é inválido. Por favor, verifique o link.</p>';
                    if (postTitleTag) postTitleTag.textContent = 'ID Inválido';
                    return;
                }
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const post = await response.json();

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
                        <button class="like-button" data-post-id="${post._id}"><i class='bx bx-heart'></i> <span class="like-count">${post.likes || 0}</span> Curtidas</button>
                        <button class="share-button" data-post-title="${post.title}" data-post-url="${window.location.href}">Compartilhar <i class='bx bx-share-alt'></i></button>
                    </div>
                </article>
            `;

            const likeButton = blogPostContent.querySelector('.like-button');
            if (likeButton) {
                likeButton.addEventListener('click', () => handleLikePost(post._id));
            }

            const shareButton = blogPostContent.querySelector('.share-button');
            if (shareButton) {
                shareButton.addEventListener('click', () => handleSharePost(shareButton.dataset.postTitle, shareButton.dataset.postUrl));
            }

            await loadComments(postId);

        } catch (error) {
            console.error('Erro ao carregar post:', error);
            blogPostContent.innerHTML = '<p>Ocorreu um erro ao carregar o post. Por favor, tente novamente mais tarde.</p>';
            if (postTitleTag) postTitleTag.textContent = 'Erro ao Carregar Post';
        }
    };

    // --- Funções de Ação (Curtir e Compartilhar) ---
    const handleLikePost = async (postId) => {
        try {
            // AGORA ADICIONE O "/api/posts" AQUI NA CHAMADA FETCH
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, { // <--- CORREÇÃO AQUI!
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
            const likeCountSpan = document.querySelector(`.like-button[data-post-id="${postId}"] .like-count`);
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
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).then(() => {
                console.log('Conteúdo compartilhado com sucesso!');
            }).catch(error => {
                console.error('Erro ao compartilhar:', error);
            });
        } else {
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

    // --- Função para renderizar os comentários ---
    const renderComments = (comments) => {
        if (!commentsList) return;

        commentsList.innerHTML = '';

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

    // --- Função para carregar comentários de um post ---
    const loadComments = async (postId) => {
        if (!commentsList) return;

        try {
            // AGORA ADICIONE O "/api/posts" AQUI NA CHAMADA FETCH
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`); // <--- CORREÇÃO AQUI!
            if (!response.ok) {
                throw new Error(`Erro HTTP ao carregar comentários! Status: ${response.status}`);
            }
            const comments = await response.json();
            renderComments(comments);
        } catch (error) {
            console.error('Erro ao carregar comentários:', error);
            commentsList.innerHTML = '<p>Não foi possível carregar os comentários.</p>';
        }
    };

    // --- Função para enviar um novo comentário ---
    const submitComment = async (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');

        const author = commentAuthorInput.value.trim();
        const content = commentContentInput.value.trim();

        if (!postId || !author || !content) {
            alert('Por favor, preencha todos os campos do comentário e verifique se o post está carregado.');
            return;
        }

        try {
            // AGORA ADICIONE O "/api/posts" AQUI NA CHAMADA FETCH
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, { // <--- CORREÇÃO AQUI!
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

            commentAuthorInput.value = '';
            commentContentInput.value = '';

            loadComments(postId);

        } catch (error) {
            console.error('Erro ao enviar comentário:', error);
            alert(`Erro ao enviar comentário: ${error.message}`);
        }
    };

    if (window.location.pathname.includes('/blog/index.html') || window.location.pathname.endsWith('/blog/')) {
        loadBlogPosts();
    } else if (window.location.pathname.includes('/blog/post.html')) {
        loadSinglePost();
    }

    if (commentForm) {
        commentForm.addEventListener('submit', submitComment);
    }
});