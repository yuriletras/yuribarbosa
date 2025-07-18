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

    // Função para carregar a lista de posts no admin.html
    const loadAdminPosts = async () => {
        if (!adminPostsList) return; // Só executa se estiver na página admin.html

        adminPostsList.innerHTML = '<p>Carregando posts do admin...</p>';
        try {
            const response = await fetch(`${API_BASE_URL}/posts`); // Busca a lista de posts
            if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
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
                        <button class="btn-edit" data-slug="${post.slug}">Editar</button>
                        <button class="btn-delete" data-slug="${post.slug}">Excluir</button>
                    </div>
                `;
                adminPostsList.appendChild(li);
            });

            // Adiciona listeners para os botões de Editar e Excluir
            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', (e) => {
                    const slug = e.target.dataset.slug;
                    window.location.href = `new-post.html?slug=${slug}`; // Redireciona para edição
                });
            });

            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', (e) => {
                    const slug = e.target.dataset.slug;
                    if (confirm(`Tem certeza que deseja excluir o post "${slug}"?`)) {
                        deletePost(slug);
                    }
                });
            });

        } catch (error) {
            console.error('Erro ao carregar posts para o admin:', error);
            adminPostsList.innerHTML = '<p>Não foi possível carregar os posts para o painel de administração.</p>';
        }
    };

    // Função para carregar dados de um post para edição em new-post.html
    const loadPostForEdit = async (slug) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
            if (!response.ok) throw new Error(`Erro ao buscar post para edição! Status: ${response.status}`);
            const post = await response.json();

            formTitle.textContent = `Editar Post: ${post.title}`;
            postTitleInput.value = post.title;
            postSlugInput.value = post.slug;
            postSlugInput.readOnly = true; // Slugs geralmente não são editáveis
            postAuthorInput.value = post.author;
            postSummaryInput.value = post.summary;
            postThumbnailInput.value = post.thumbnail || '';
            postContentInput.value = post.content;

        } catch (error) {
            console.error('Erro ao carregar post para edição:', error);
            alert('Não foi possível carregar o post para edição.');
            // Opcional: Redirecionar de volta para a lista de admin
            window.location.href = 'admin.html';
        }
    };

    // Função para criar ou atualizar um post
    const handlePostFormSubmit = async (event) => {
        event.preventDefault();

        const isEditing = postSlugInput.readOnly; // Verifica se o campo slug é readOnly (estamos editando)
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_BASE_URL}/posts/${postSlugInput.value}` : `${API_BASE_URL}/posts`;

        const postData = {
            title: postTitleInput.value,
            slug: postSlugInput.value, // Slug não muda na edição
            author: postAuthorInput.value,
            summary: postSummaryInput.value,
            thumbnail: postThumbnailInput.value,
            content: postContentInput.value
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'criar'} post: ${errorData.msg || response.statusText}`);
            }

            alert(`Post ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
            window.location.href = 'admin.html'; // Redireciona de volta para a lista
        } catch (error) {
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'criar'} post:`, error);
            alert(`Erro ao ${isEditing ? 'atualizar' : 'criar'} post: ${error.message}`);
        }
    };

    // Função para deletar um post
    const deletePost = async (slug) => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${slug}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
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
        loadAdminPosts();
        createPostBtn.addEventListener('click', () => {
            window.location.href = 'new-post.html'; // Redireciona para o formulário de criação
        });
    }

    if (postForm) { // Estamos em new-post.html
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        if (slug) {
            loadPostForEdit(slug); // Se tem slug, carrega para edição
        } else {
            // Se não tem slug, é um novo post, então o slug não deve ser somente leitura
            postSlugInput.readOnly = false;
        }

        postForm.addEventListener('submit', handlePostFormSubmit);
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'admin.html'; // Volta para a lista
        });
    }
});