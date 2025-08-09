// portfolio/blog/blog.js

// Escopo global para a URL da API
const API_BASE_URL = 'https://portfolio-blog-backend-z8mi.onrender.com';

// Função para adicionar um like
window.likePost = async (postId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
            method: 'PUT'
        });

        if (response.ok) {
            const updatedPost = await response.json();
            const likeCountElement = document.querySelector('.like-count');
            if (likeCountElement) {
                likeCountElement.textContent = updatedPost.likes;
            }
        } else {
            console.error('Erro ao dar like.', response.status);
            alert('Não foi possível dar like. Verifique a conexão com o servidor.');
        }
    } catch (error) {
        console.error('Falha ao dar like:', error);
    }
};

// Função para carregar a LISTA de posts (para blog/index.html)
const loadBlogPosts = async () => {
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;

    postsContainer.innerHTML = '<p>Carregando posts...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const posts = await response.json();

        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>Nenhum post encontrado no momento.</p>';
            return;
        }
        
        posts.forEach(post => {
            const postDate = new Date(post.publishedAt);
            const formattedDate = postDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
            
            let thumbnailUrl = '';
            if (post.thumbnail && !post.thumbnail.startsWith('http')) {
                thumbnailUrl = `${API_BASE_URL}${post.thumbnail}`;
            } else if (post.thumbnail) {
                thumbnailUrl = post.thumbnail;
            } else {
                thumbnailUrl = '../images/blog/default-thumb.jpg';
            }

            const postCard = `
                <a href="post.html?id=${post._id}" class="blog-post-card">
                    <img src="${thumbnailUrl}" alt="${post.title}">
                    <div class="blog-post-card-content">
                        <h3>${post.title}</h3>
                        <p class="post-card-meta">Publicado em: ${formattedDate} por ${post.author}</p>
                        <p>${post.summary}</p>
                        <div class="blog-post-card-footer">
                            <span class="read-more-btn">Ler Mais <i class='bx bx-right-arrow-alt'></i></span>
                        </div>
                    </div>
                </a>
            `;
            postsContainer.innerHTML += postCard;
        });

    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        postsContainer.innerHTML = '<p>Não foi possível carregar os posts. Tente novamente mais tarde.</p>';
    }
};

// Função para carregar um POST INDIVIDUAL (para blog/post.html)
const loadSinglePost = async () => {
    const postContentContainer = document.getElementById('postContent');
    if (!postContentContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        postContentContainer.innerHTML = '<h1>Post não encontrado.</h1>';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o post.');
        }
        const post = await response.json();

        document.title = `${post.title} - Blog`;
        
        let thumbnailUrl = '';
        if (post.thumbnail && !post.thumbnail.startsWith('http')) {
            thumbnailUrl = `${API_BASE_URL}${post.thumbnail}`;
        } else if (post.thumbnail) {
            thumbnailUrl = post.thumbnail;
        } else {
            thumbnailUrl = '../images/blog/default-thumb.jpg';
        }

        const postDate = new Date(post.publishedAt);
        const formattedPostDate = postDate.toLocaleDateString('pt-BR');

        const postHtml = `
            <img src="${thumbnailUrl}" alt="${post.title}" class="post-main-image">
            <h1>${post.title}</h1>
            <p class="post-meta">Por ${post.author} em ${formattedPostDate}</p>
            <div class="post-content-html">${post.content}</div>
            <div class="post-actions">
                <button class="like-button" data-post-id="${post._id}"><i class='bx bx-like'></i><span class="like-count">${post.likes}</span> Likes</button>
            </div>
        `;
        postContentContainer.innerHTML = postHtml;
        
        const likeButton = document.querySelector('.like-button');
        if (likeButton) {
            likeButton.addEventListener('click', () => {
                likePost(likeButton.dataset.postId);
            });
        }

        loadComments(postId);

    } catch (error) {
        console.error("Falha ao carregar o post:", error);
        postContentContainer.innerHTML = '<p>Erro ao carregar o post. Tente novamente mais tarde.</p>';
    }
};

// Função para carregar comentários (seção de comentários)
const loadComments = async (postId) => {
    const commentsSection = document.getElementById('commentsSection');
    if (!commentsSection) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar comentários: ${response.status}`);
        }
        let comments = await response.json();

        // Ordenar comentários do mais recente ao mais antigo
        comments.sort((a, b) => {
            const dateA = new Date(a.publishedAt || a.createdAt);
            const dateB = new Date(b.publishedAt || b.createdAt);
            return dateB - dateA;
        });

        // Gerar o HTML do formulário primeiro
        let commentsHtml = `
            <div class="comment-form-container">
                <h3>Deixe um comentário</h3>
                <form id="commentForm">
                    <input type="hidden" id="postId" value="${postId}">
                    <input type="text" id="commentAuthor" placeholder="Seu nome" required>
                    <textarea id="commentContent" placeholder="Seu comentário..." required></textarea>
                    <button type="submit" class="btn">Enviar Comentário</button>
                </form>
            </div>
            
            <div class="comments-section">
                <h3>Comentários (${comments.length})</h3>
                <div class="comments-list">
        `;

        if (comments.length === 0) {
            commentsHtml += '<p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        } else {
            comments.forEach(comment => {
                const commentDate = new Date(comment.publishedAt || comment.createdAt).toLocaleDateString('pt-BR');
                commentsHtml += `
                    <div class="comment-item">
                        <div class="comment-header">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-date">em ${commentDate}</span>
                        </div>
                        <p class="comment-content">${comment.content}</p>
                    </div>
                `;
            });
        }
        
        commentsHtml += `
                </div>
            </div>
        `;

        commentsSection.innerHTML = commentsHtml;

        document.getElementById('commentForm').addEventListener('submit', handleCommentSubmit);

    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        commentsSection.innerHTML = `
            <h2>Comentários</h2>
            <p>Não foi possível carregar os comentários. Tente novamente mais tarde.</p>
        `;
    }
};

// Função para lidar com o envio do formulário de comentários
const handleCommentSubmit = async (event) => {
    event.preventDefault();
    
    const form = event.target;
    const postId = form.elements.postId.value;
    const author = form.elements.commentAuthor.value;
    const content = form.elements.commentContent.value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ author, content })
        });
        
        if (response.ok) {
            form.reset();
            loadComments(postId);
        } else {
            console.error('Erro ao enviar comentário.', response.status);
            alert('Não foi possível enviar o comentário. Tente novamente.');
        }
    } catch (error) {
        console.error('Falha ao enviar comentário:', error);
        alert('Falha na conexão. Tente novamente.');
    }
};


// ----------------------------------------
// NOVA FUNÇÃO PARA O BOTÃO "IR PARA O TOPO"
// ----------------------------------------
const setupScrollToTopButton = () => {
    const scrollBtn = document.querySelector('.scroll-to-top-btn');

    if (scrollBtn) {
        // Mostra/esconde o botão com base na posição da rolagem
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Mostra o botão após rolar 300px
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        // Adiciona a funcionalidade de rolagem suave ao clicar no botão
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};


// Lógica de inicialização: Verifica a URL e chama as funções apropriadas
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/blog/index.html') || currentPath.endsWith('/blog/')) {
        loadBlogPosts();
    } else if (currentPath.includes('/blog/post.html')) {
        loadSinglePost();
    }

    // Chamada para inicializar o botão "ir para o topo"
    setupScrollToTopButton();
});