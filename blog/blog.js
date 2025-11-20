// portfolio/blog/blog.js

// ==========================================================
// 1. CONFIGURAÇÃO DA API E VARIÁVEIS DE PAGINAÇÃO
// ==========================================================
const API_BASE_URL = 'https://portfolio-blog-backend-z8mi.onrender.com';

// Configuração de paginação
const PAGINATION_CONFIG = {
    postsPerPage: 6, // 6 posts por página (2 linhas de 3 no desktop)
    initialLoad: 6,  // Carrega 6 posts inicialmente
    loadMoreIncrement: 6 // Carrega mais 6 posts cada vez
};

// Estado da paginação
let currentPage = 1;
let allPosts = [];
let displayedPosts = 0;
let isLoading = false;

// ==========================================================
// 2. MOCK DATA PARA TRABALHOS (PORTFÓLIO - VIA CÓDIGO)
// ==========================================================

const MOCK_PROJECTS = [
    {
        _id: 'proj1',
        title: 'Estúdio Bloss - Website Institucional',
        summary: 'Imagine criar um site que precisa falar duas línguas fluentemente! Esse foi o desafio do Estúdio Bloss: desenvolver uma plataforma que transitasse perfeitamente entre português e inglês. A parte mais interessante? Fazer com que cada detalhe - desde o texto até a logo no footer - se adaptasse magicamente ao idioma escolhido, mantendo a essência visual intacta. O resultado? Uma experiência tão natural que o usuário nem percebe a complexidade portrás das cortinas.',
        thumbnail: '/img/ProjetoGaby.png',
        publishedAt: new Date('2024-03-15').toISOString(),
        author: 'Yuri Developer',
        category: 'projects',
        link: 'https://github.com/yuriletras/estudiobloss',
        technologies: ['HTML5', 'CSS3', 'JavaScript']
    },
    {
        _id: 'proj2',
        title: 'Meu Portfólio - Uma Janela do Meu Mundo',
        summary: 'Como contar sua história profissional sem parecer um currículo? Essa foi minha missão ao criar este portfólio. Queria que cada visitante sentisse que estava conversando comigo, não apenas vendo uma lista de projetos. A magia acontece no modo claro/escuro - como se o site respirasse junto com o usuário, adaptando-se ao seu conforto visual. E a melhor parte? Ver como pequenas animações e transições suaves podem transformar uma simples navegação em uma experiência memorável.',
        thumbnail: '/img/site_yuri.png',
        publishedAt: new Date('2024-06-10').toISOString(),
        author: 'Yuri Developer',
        category: 'projects',
        link: 'https://github.com/yuriletras/yuribarbosa',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design']
    },
    {
        _id: 'proj3',
        title: 'YB Tasks - O Organizador que Respeita seu Tempo',
        summary: 'Já imaginou ter um assistente pessoal para suas tarefas? O YB Tasks nasceu dessa vontade: criar um sistema que não apenas lista afazeres, mas entende a importância de cada um. A parte mais gratificante foi ver como a autenticação segura e o CRUD completo se transformaram em uma ferramenta que realmente melhora o dia a dia das pessoas. Do backend robusto com Node.js à interface intuitiva, cada linha de código foi pensada para fazer o usuário pensar: "Uau, isso é exatamente o que eu precisava!"',
        thumbnail: '/img/ytas.png',
        publishedAt: new Date('2024-09-20').toISOString(),
        author: 'Yuri Developer',
        category: 'projects',
        link: 'https://github.com/yuriletras/projeto-backend-tasks',
        technologies: ['Node.js', 'Express.js', 'MongoDB', 'HTML5', 'CSS3', 'JavaScript']
    },
    {
        _id: 'proj4',
        title: 'MB Arte - O Nascimento de Uma Identidade Digital',
        summary: 'Alguns projetos são especiais desde o primeiro esboço. O MB Arte é um deles - uma jornada de criação onde cada pixel conta uma história. Estou moldando não apenas um website, mas a identidade digital de um negócio que respira criatividade. É fascinante ver como as ideias ganham vida no código, criando uma experiência que vai muito além do visual. A cada linha escrita, sinto que estou construindo algo que fará os visitantes pensarem: "É exatamente assim que eu me imagino online!"',
        thumbnail: 'https://placehold.co/800x400/8e44ad/ffffff?text=MB+Arte+🎨',
        publishedAt: new Date('2025-01-15').toISOString(),
        author: 'Yuri Developer',
        category: 'projects',
        link: '#',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Design Responsivo'],
        status: 'em-andamento'
    }
];

// ==========================================================
// 3. LÓGICA DO MENU OVERLAY
// ==========================================================
const setupMenuOverlay = () => {
    const menuText = document.getElementById('menuText');
    const fullMenuOverlay = document.getElementById('fullMenuOverlay');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuIcon = document.getElementById('menu-icon');

    const openMenu = () => {
        if (fullMenuOverlay) fullMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    };

    const closeMenu = () => {
        if (fullMenuOverlay) fullMenuOverlay.classList.remove('active');
        document.body.style.overflow = ''; 
    };

    if (menuText) menuText.addEventListener('click', openMenu);
    if (menuIcon) menuIcon.addEventListener('click', openMenu); 
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullMenuOverlay && fullMenuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });
};

// ==========================================================
// 4. SISTEMA DE PAGINAÇÃO PROFISSIONAL
// ==========================================================

/**
 * Cria o botão "Carregar Mais" com estilo profissional
 */
const createLoadMoreButton = () => {
    const loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'load-more-container';
    loadMoreContainer.innerHTML = `
        <button class="load-more-btn standard-btn">
            <span class="btn-text">Carregar Mais Projetos</span>
            <span class="btn-loading" style="display: none;">
                <i class='bx bx-loader-alt bx-spin'></i> Carregando...
            </span>
            <span class="btn-arrow">↓</span>
        </button>
    `;
    
    return loadMoreContainer;
};

/**
 * Mostra/oculta o botão "Carregar Mais" baseado na quantidade de posts
 */
const toggleLoadMoreButton = (totalPosts, displayedPosts) => {
    let loadMoreContainer = document.querySelector('.load-more-container');
    
    // Se ainda tem posts para carregar e não existe o botão, cria
    if (displayedPosts < totalPosts && !loadMoreContainer) {
        loadMoreContainer = createLoadMoreButton();
        const postsGrid = document.getElementById('posts-grid-container');
        if (postsGrid) {
            postsGrid.parentNode.insertBefore(loadMoreContainer, postsGrid.nextSibling);
            
            // Adiciona evento de clique
            const loadMoreBtn = loadMoreContainer.querySelector('.load-more-btn');
            loadMoreBtn.addEventListener('click', loadMorePosts);
        }
    }
    // Se não tem mais posts para carregar, remove o botão
    else if (displayedPosts >= totalPosts && loadMoreContainer) {
        loadMoreContainer.remove();
    }
};

/**
 * Atualiza o estado do botão "Carregar Mais"
 */
const updateLoadMoreButton = (isLoading) => {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    const btnText = loadMoreBtn.querySelector('.btn-text');
    const btnLoading = loadMoreBtn.querySelector('.btn-loading');
    const btnArrow = loadMoreBtn.querySelector('.btn-arrow');
    
    if (isLoading) {
        loadMoreBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        btnArrow.style.display = 'none';
    } else {
        loadMoreBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        btnArrow.style.display = 'inline';
    }
};

/**
 * Carrega mais posts quando o botão é clicado
 */
const loadMorePosts = async () => {
    if (isLoading) return;
    
    isLoading = true;
    updateLoadMoreButton(true);
    
    // Simula um delay de carregamento para melhor UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    currentPage++;
    const startIndex = displayedPosts;
    const endIndex = startIndex + PAGINATION_CONFIG.loadMoreIncrement;
    const postsToShow = allPosts.slice(startIndex, endIndex);
    
    // Renderiza os novos posts
    renderPostsBatch(postsToShow);
    
    displayedPosts += postsToShow.length;
    
    // Atualiza o botão
    isLoading = false;
    updateLoadMoreButton(false);
    
    // Verifica se ainda tem posts para carregar
    toggleLoadMoreButton(allPosts.length, displayedPosts);
    
    // Animações para os novos posts
    setTimeout(initImageAnimations, 100);
};

/**
 * Renderiza um lote de posts
 */
const renderPostsBatch = (posts) => {
    const postsGridContainer = document.getElementById('posts-grid-container');
    if (!postsGridContainer) return;
    
    posts.forEach(post => {
        const postCard = createPostCard(post);
        postsGridContainer.appendChild(postCard);
    });
};

/**
 * Cria o card de post individual
 */
const createPostCard = (post) => {
    const postDate = new Date(post.publishedAt);
    const formattedDate = postDate.toLocaleDateString('pt-BR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    let thumbnailUrl = post.thumbnail;
    if (post.thumbnail && !post.thumbnail.startsWith('http') && post.category === 'articles') {
        thumbnailUrl = `${API_BASE_URL}${post.thumbnail}`;
    } else if (!post.thumbnail) {
        thumbnailUrl = 'https://placehold.co/800x400/ffdaa5/333333?text=Imagem+Padrao';
    }

    const postCard = document.createElement('a');
    postCard.className = 'post-card';
    postCard.setAttribute('data-category', post.category);
    
    if (post.category === 'articles') {
        postCard.href = `post.html?id=${post._id}`;
    } else if (post.category === 'projects') {
        postCard.href = `post.html?project=${post._id}`;
    }
    
    const tagText = post.category === 'articles' ? 'Artigo' : 'Trabalho';
    
    postCard.innerHTML = `
        <div class="post-image-container">
            <img src="${thumbnailUrl}" alt="${post.title}" class="post-image" loading="lazy">
        </div>
        <div class="post-info">
            <span class="post-tag">${tagText}</span>
            <h3 class="post-title-card">${post.title}</h3>
            <p class="post-excerpt">${post.summary}</p>
            <div class="post-meta">
                <span>${formattedDate}</span>
                <span>por ${post.author || 'Autor Desconhecido'}</span>
            </div>
        </div>
    `;
    
    return postCard;
};

// ==========================================================
// 5. FUNÇÕES DE INTERAÇÃO COM O BACKEND E UI (EXISTENTES)
// ==========================================================

const updateLikeCountUI = (likes) => {
    const likeCountElement = document.querySelector('.post-interactions .like-count');
    if (likeCountElement) {
        likeCountElement.textContent = `(${likes})`;
    }
};

const likePost = async (postId) => {
    const likeBtn = document.querySelector('.like-btn');
    if (!likeBtn) return;
    likeBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
            method: 'PUT'
        });

        if (response.ok) {
            const updatedPost = await response.json();
            updateLikeCountUI(updatedPost.likes);
            likeBtn.classList.add('liked');
        } else {
            console.error('Erro ao dar like.', response.status);
        }
    } catch (error) {
        console.error('Falha ao dar like:', error);
    } finally {
        likeBtn.disabled = false;
    }
};

const renderComments = (comments) => {
    const commentsList = document.querySelector('.comments-list');
    const commentsTitle = document.querySelector('.post-comments-section h2');

    if (!commentsList || !commentsTitle) return;

    commentsTitle.textContent = `Comentários (${comments.length})`;
    commentsList.innerHTML = '';
    
    comments.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));

    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="comment-text">Nenhum comentário ainda. Seja o primeiro a comentar!</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentDate = new Date(comment.publishedAt || comment.createdAt).toLocaleDateString('pt-BR');
        
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        commentItem.innerHTML = `
            <div class="comment-author">${comment.author || 'Anônimo'} <span class="comment-date">em ${commentDate}</span></div>
            <p class="comment-text">${comment.content}</p>
        `;
        commentsList.appendChild(commentItem);
    });
};

const loadComments = async (postId) => {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;

    commentsList.innerHTML = '<p class="comment-text">Carregando comentários...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar comentários: ${response.status}`);
        }
        const comments = await response.json();
        
        renderComments(comments);

    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        document.querySelector('.post-comments-section h2').textContent = 'Comentários';
        commentsList.innerHTML = `<p class="comment-text">Não foi possível carregar os comentários. Tente novamente mais tarde.</p>`;
    }
};

const handleCommentSubmit = async (event, postId) => {
    event.preventDefault();
    
    const form = event.target;
    const authorInput = form.querySelector('input[type="text"]');
    const contentTextarea = form.querySelector('textarea');
    
    const author = authorInput ? authorInput.value : 'Anônimo';
    const content = contentTextarea ? contentTextarea.value : '';

    if (!content.trim()) return;
    
    const submitBtn = form.querySelector('.submit-comment-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, content })
        });
        
        if (response.ok) {
            form.reset();
            loadComments(postId);
        } else {
            console.error('Erro ao enviar comentário.', response.status);
        }
    } catch (error) {
        console.error('Falha ao enviar comentário:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Comentário';
    }
};

const handleShareClick = () => {
    const postUrl = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                const shareBtn = document.querySelector('.share-btn');
                const originalText = shareBtn.innerHTML;
                shareBtn.innerHTML = "<i class='bx bx-check-circle'></i> Link Copiado!";
                setTimeout(() => {
                    shareBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Erro ao copiar URL:', err);
                prompt("Copie o URL do post:", postUrl);
            });
    } else {
        prompt("Copie o URL do post:", postUrl);
    }
};

// ==========================================================
// 6. FUNÇÃO PARA SCROLL DOWN
// ==========================================================

const setupScrollDownButton = () => {
    const scrollDownBtn = document.querySelector('.scroll-down-btn');
    
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = scrollDownBtn.getAttribute('data-next');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
};

// ==========================================================
// 7. ANIMAÇÕES DE SCROLL REVEAL
// ==========================================================

const initScrollAnimations = () => {
    const elementsToAnimate = document.querySelectorAll('.blog-title, .blog-subtitle, .heading-line-minimal');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    elementsToAnimate.forEach(el => scrollObserver.observe(el));
};

// ==========================================================
// 8. ANIMAÇÃO DE IMAGEM COM CARREGAMENTO
// ==========================================================

const initImageAnimations = () => {
    const blogImage = document.querySelector('.blog-intro-img');
    
    if (blogImage) {
        if (blogImage.complete) {
            blogImage.classList.add('loaded');
        } else {
            blogImage.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    }

    // Observer para imagens dos posts
    const postImages = document.querySelectorAll('.post-image');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
                imageObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    postImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        imageObserver.observe(img);
    });
};

// ==========================================================
// 9. LÓGICA DE RENDERIZAÇÃO DA PÁGINA COM PAGINAÇÃO
// ==========================================================

const fetchArticles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        if (!response.ok) {
            console.error(`Erro HTTP ao buscar Artigos: ${response.status}`);
            return [];
        }
        const posts = await response.json();
        return posts.map(post => ({ ...post, category: 'articles' })); 
    } catch (error) {
        console.error('Falha ao carregar artigos do backend:', error);
        return [];
    }
};

const loadBlogPosts = async (filter = 'all') => {
    const postsGridContainer = document.getElementById('posts-grid-container');
    if (!postsGridContainer) return;

    // Remove botão "Carregar Mais" anterior se existir
    const existingLoadMore = document.querySelector('.load-more-container');
    if (existingLoadMore) {
        existingLoadMore.remove();
    }

    postsGridContainer.innerHTML = '<p style="text-align: center; color: var(--text-color);">Carregando conteúdo...</p>';

    try {
        // Reseta o estado da paginação
        currentPage = 1;
        displayedPosts = 0;
        isLoading = false;

        // Carrega artigos e projetos
        const articles = await fetchArticles();
        const projects = MOCK_PROJECTS;

        // Combina e filtra
        let combinedPosts = [...articles, ...projects];
        
        const filteredPosts = combinedPosts.filter(post => {
            if (filter === 'all') return true;
            return post.category && post.category.toLowerCase() === filter;
        });

        // Ordena por data
        filteredPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Atualiza posts globais
        allPosts = filteredPosts;

        postsGridContainer.innerHTML = '';

        if (filteredPosts.length === 0) {
            postsGridContainer.innerHTML = '<p style="text-align: center; color: var(--text-color);">Nenhum post encontrado para este filtro.</p>';
            return;
        }
        
        // Carrega posts iniciais
        const initialPosts = filteredPosts.slice(0, PAGINATION_CONFIG.initialLoad);
        renderPostsBatch(initialPosts);
        
        displayedPosts = initialPosts.length;

        // Mostra/oculta botão "Carregar Mais"
        toggleLoadMoreButton(filteredPosts.length, displayedPosts);

        // Inicializa animações
        setTimeout(initImageAnimations, 100);

    } catch (error) {
        console.error('Erro ao carregar posts:', error);
        postsGridContainer.innerHTML = '<p style="text-align: center; color: var(--text-color);">Erro ao carregar os posts. Tente novamente mais tarde.</p>';
    }
};

// ==========================================================
// 10. LÓGICA DE RENDERIZAÇÃO DO POST INDIVIDUAL (post.html)
// ==========================================================

const setupPostInteractions = (postId, initialLikes) => {
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => likePost(postId));
        updateLikeCountUI(initialLikes);
    }

    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShareClick);
    }
    
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => handleCommentSubmit(e, postId));
    }

    loadComments(postId);
};

const loadSinglePost = async () => {
    const postContentContainer = document.getElementById('post-content-container');
    if (!postContentContainer) return;

    postContentContainer.innerHTML = '<p style="text-align: center; color: var(--text-color);">Carregando conteúdo...</p>';

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const projectId = urlParams.get('project');

    if (!postId && !projectId) {
        postContentContainer.innerHTML = '<h1>Post não encontrado.</h1>';
        return;
    }

    try {
        let post;
        let isProject = false;
        
        if (projectId) {
            post = MOCK_PROJECTS.find(proj => proj._id === projectId);
            if (!post) {
                throw new Error('Projeto não encontrado.');
            }
            isProject = true;
        } else {
            const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`);
            if (!response.ok) {
                throw new Error('Erro ao carregar o post.');
            }
            post = await response.json();
            isProject = false;
        }

        document.title = `${post.title} | Yuri Portfólio`;
        
        let thumbnailUrl = post.thumbnail;
        if (post.thumbnail && !post.thumbnail.startsWith('http') && !isProject) {
            thumbnailUrl = `${API_BASE_URL}${post.thumbnail}`;
        } else if (!post.thumbnail) {
            thumbnailUrl = 'https://placehold.co/1200x400/ffdaa5/333333?text=Imagem+Padrao';
        }

        const postDate = new Date(post.publishedAt);
        const formattedPostDate = postDate.toLocaleDateString('pt-BR');

        let postContent = '';
        if (isProject) {
            postContent = `
                <div class="project-content">
                    <p><strong>Resumo:</strong> ${post.summary}</p>
                    <p><strong>Link do Projeto:</strong> <a href="${post.link}" target="_blank">${post.link}</a></p>
                    <div class="project-actions">
                        <a href="${post.link}" target="_blank" class="action-btn">
                            <i class='bx bx-link-external'></i> Ver Projeto
                        </a>
                        <a href="blog.html" class="action-btn">
                            <i class='bx bx-left-arrow-alt'></i> Voltar ao Portfólio
                        </a>
                    </div>
                </div>
            `;
        } else {
            postContent = post.content || '<p>Conteúdo não disponível.</p>';
        }

        const postHtml = `
            <img src="${thumbnailUrl}" alt="${post.title}" class="post-header-image">
            <h1 class="post-full-title">${post.title}</h1>
            <p class="post-full-meta">Por ${post.author || 'Autor Desconhecido'} em ${formattedPostDate}</p>
            
            <div class="post-full-content">
                ${postContent}
            </div>
            
            <div class="back-button-container">
                <a href="blog.html" class="action-btn">
                    <i class='bx bx-left-arrow-alt'></i> Voltar para Todas as Publicações
                </a>
            </div>
        `;
        postContentContainer.innerHTML = postHtml;
        
        if (isProject) {
            const postInteractions = document.querySelector('.post-interactions');
            const postComments = document.querySelector('.post-comments-section');
            
            if (postInteractions) postInteractions.style.display = 'none';
            if (postComments) postComments.style.display = 'none';
        } else {
            setupPostInteractions(postId, post.likes || 0);
        }

        setTimeout(initImageAnimations, 100);

    } catch (error) {
        console.error("Falha ao carregar o post:", error);
        postContentContainer.innerHTML = '<p>Erro ao carregar o post. Tente novamente mais tarde.</p>';
    }
};

// ==========================================================
// 11. INICIALIZAÇÃO E LÓGICA DE FILTRO (ATUALIZADA)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    
    setupMenuOverlay();
    setupScrollDownButton();
    initScrollAnimations();
    initImageAnimations();
    
    // Lógica para o botão Scroll-to-Top
    const scrollBtn = document.querySelector('.scroll-to-top-btn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const currentPath = window.location.pathname;

    // Se a página é a de listagem (blog.html)
    if (currentPath.includes('blog.html')) {
        
        const blogContentSection = document.querySelector('.blog-content-section');
        
        let postsGridContainer = document.getElementById('posts-grid-container');
        if (!postsGridContainer && blogContentSection) {
            postsGridContainer = document.createElement('div');
            postsGridContainer.id = 'posts-grid-container';
            postsGridContainer.className = 'posts-grid';
            
            const blogFilters = document.querySelector('.blog-filters');
            if (blogFilters) {
                blogFilters.insertAdjacentElement('afterend', postsGridContainer);
            } else {
                blogContentSection.appendChild(postsGridContainer);
            }
        }

        const filterButtons = document.querySelectorAll('.filter-btn');

        // Adiciona eventos aos botões de filtro
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                loadBlogPosts(filterValue);
            });
        });

        // Chamada inicial para carregar TODOS os posts
        loadBlogPosts('all');

    } 
    // Se a página é a de post individual (post.html)
    else if (currentPath.includes('post.html')) {
        loadSinglePost();
    }
});