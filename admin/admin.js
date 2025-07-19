// admin/admin.js

document.addEventListener('DOMContentLoaded', async () => {
    // Mesma API_BASE_URL do blog.js, mas sem o /posts no final,
    // pois as rotas de PUT/DELETE/POST de admin podem ser mais variadas.
    // Ou você pode manter /api/posts se suas rotas de admin também usam esse prefixo.
    // Vamos usar a base da API para ter flexibilidade.
    const API_BASE_URL = 'https://portfolio-blog-backend-z8mi.onrender.com/api'; // SEM /posts no final

    // --- Elementos HTML ---
    const adminPostsList = document.getElementById('adminPostsList');
    const createPostBtn = document.getElementById('createPostBtn');

    // Elementos do formulário (em new-post.html)
    const postForm = document.getElementById('postForm');
    const formTitle = document.getElementById('formTitle');
    const postTitleInput = document.getElementById('postTitle');
    const postSlugInput = document.getElementById('postSlug');
    const postAuthorInput = document.getElementById('postAuthor');
    const postSummaryInput = document.getElementById('postSummary');
    const postThumbnailInput = document.getElementById('postThumbnail');
    const postContentInput = document.getElementById('postContent');
    const cancelBtn = document.getElementById('cancelBtn');

    // --- Funções Principais ---

    // Função de Verificação de Autenticação (IMPORTANTE: REINTRODUZIDA AQUI!)
    function checkAuthAndRedirect() {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Função de Logout (IMPORTANTE: REINTRODUZIDA AQUI!)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        });
    }

    // Função para carregar a lista de posts no admin.html
    const loadAdminPosts = async () => {
        if (!adminPostsList) return; // Só executa se estiver na página admin.html

        // Verifica autenticação antes de carregar posts que possuem ações restritas
        if (!checkAuthAndRedirect()) return;

        adminPostsList.innerHTML = '<p>Carregando posts do admin...</p>';
        try {
            // Esta requisição GET /posts é pública, mas manteremos o token para consistência
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/posts`, {
                headers: {
                    'x-auth-token': token // Envia o token para autenticação das ações de admin
                }
            });
            
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    checkAuthAndRedirect();
                    return;
                }
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            const posts = await response.json();

            if (posts.length === 0) {
                adminPostsList.innerHTML = '<p>Nenhum post para gerenciar.</p>';
                return;
            }

            adminPostsList.innerHTML = '';
            posts.forEach(post => {
                const li = document.createElement('li');
                li.className = 'post-admin-item';
                li.innerHTML = `
                    <span class="post-admin-title">${post.title}</span>
                    <div class="post-admin-actions">
                        <button class="btn-edit" data-id="${post._id}">Editar</button> <button class="btn-delete" data-id="${post._id}">Excluir</button> </div>
                `;
                adminPostsList.appendChild(li);
            });

            // Adiciona listeners para os botões de Editar e Excluir
            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', (e) => {
                    const postId = e.target.dataset.id; // MUDANÇA: pega data-id
                    window.location.href = `new-post.html?id=${postId}`; // MUDANÇA: ?id=
                });
            });

            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', (e) => {
                    const postId = e.target.dataset.id; // MUDANÇA: pega data-id
                    if (confirm(`Tem certeza que deseja excluir o post (ID: ${postId})?`)) { // MUDANÇA: mensagem com ID
                        deletePost(postId); // MUDANÇA: passa ID
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao carregar posts para o admin:', error);
            adminPostsList.innerHTML = '<p>Não foi possível carregar os posts para o painel de administração.</p>';
        }
    };

    // Função para carregar dados de um post para edição em new-post.html
    const loadPostForEdit = async (postId) => { // MUDANÇA: espera ID
        if (!checkAuthAndRedirect()) return; // Verifica autenticação

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, { // MUDANÇA: usa ID na URL
                headers: {
                    'x-auth-token': token // Envia o token
                }
            });
            
            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    checkAuthAndRedirect();
                    return;
                }
                throw new Error(`Erro ao buscar post para edição! Status: ${response.status}`);
            }
            const post = await response.json();

            formTitle.textContent = `Editar Post: ${post.title}`;
            postTitleInput.value = post.title;
            postSlugInput.value = post.slug;
            postSlugInput.readOnly = true; // Slugs geralmente não são editáveis quando se edita um post existente
            postAuthorInput.value = post.author;
            postSummaryInput.value = post.summary;
            postThumbnailInput.value = post.thumbnail || '';
            postContentInput.value = post.content;

            // Armazena o ID do post globalmente para uso no PUT
            currentPostId = postId;

        } catch (error) {
            console.error('Erro ao carregar post para edição:', error);
            alert('Não foi possível carregar o post para edição.');
            // Opcional: Redirecionar de volta para a lista de admin
            window.location.href = 'admin.html';
        }
    };

    // Variável global para armazenar o ID do post em edição (para new-post.html)
    let currentPostId = null; 

    // Função para criar ou atualizar um post
    const handlePostFormSubmit = async (event) => {
        event.preventDefault();

        if (!checkAuthAndRedirect()) return; // Verifica autenticação

        const token = localStorage.getItem('adminToken');

        const postData = {
            title: postTitleInput.value,
            slug: postSlugInput.value,
            author: postAuthorInput.value,
            summary: postSummaryInput.value,
            thumbnail: postThumbnailInput.value,
            content: postContentInput.value
        };

        let url = `${API_BASE_URL}/posts`;
        let method = 'POST';

        if (currentPostId) { // Se estiver editando um post existente (tem ID)
            url = `${API_BASE_URL}/posts/${currentPostId}`; // MUDANÇA: usa ID na URL
            method = 'PUT';
            // Quando edita, não permite mudar o slug. Garante que o slug original é enviado.
            postData.slug = postSlugInput.value; 
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Envia o token JWT
                },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    checkAuthAndRedirect();
                    return;
                }
                const errorData = await response.json();
                throw new Error(`Falha ao ${currentPostId ? 'atualizar' : 'criar'} post: ${errorData.msg || response.statusText}`);
            }

            alert(`Post ${currentPostId ? 'atualizado' : 'criado'} com sucesso!`);
            window.location.href = 'admin.html'; // Redireciona de volta para a lista
        } catch (error) {
            console.error(`Erro ao ${currentPostId ? 'atualizar' : 'criar'} post:`, error);
            alert(`Erro ao ${currentPostId ? 'atualizar' : 'criar'} post: ${error.message}`);
        }
    };

    // Função para deletar um post
    const deletePost = async (postId) => { // MUDANÇA: espera ID
        if (!checkAuthAndRedirect()) return; // Verifica autenticação

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, { // MUDANÇA: usa ID na URL
                method: 'DELETE',
                headers: {
                    'x-auth-token': token // Envia o token
                }
            });

            if (!response.ok) {
                 if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('adminToken');
                    checkAuthAndRedirect();
                    return;
                }
                const errorData = await response.json();
                throw new Error(`Falha ao excluir post: ${errorData.msg || response.statusText}`);
            }

            alert('Post excluído com sucesso!');
            loadAdminPosts(); // Recarrega a lista após exclusão
        } catch (error) {
            console.error('Erro ao excluir post:', error);
            alert(`Erro ao excluir post: ${error.message}`);
        }
    };

    // --- Inicialização baseada na página ---
    if (adminPostsList) { // Estamos em admin.html
        if (checkAuthAndRedirect()) { // Verifica autenticação ao carregar a página
            loadAdminPosts();
        }
        createPostBtn.addEventListener('click', () => {
            window.location.href = 'new-post.html'; // Redireciona para o formulário de criação
        });
    }

    if (postForm) { // Estamos em new-post.html
        if (checkAuthAndRedirect()) { // Verifica autenticação ao carregar a página
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('id'); // MUDANÇA: pega 'id' da URL
            if (postId) {
                currentPostId = postId; // Armazena o ID globalmente
                loadPostForEdit(postId); // Se tem ID, carrega para edição
            } else {
                // Se não tem ID, é um novo post, então o slug não deve ser somente leitura
                postSlugInput.readOnly = false;
            }
        }
        postForm.addEventListener('submit', handlePostFormSubmit);
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'admin.html'; // Volta para a lista
        });
    }
});

// AQUI ABAIXO DEVE ESTAR SEU SCRIPT.JS GERAL SE ELE CONTIVER FUNÇÕES GLOBAS DO TEMA/NAVBAR
// <script src="../script.js"></script>