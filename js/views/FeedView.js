import { PostController } from "../controllers/PostController.js";

export class FeedView {
    /**
     * @type {PostController}
     */
    controller;

    #lastPostsCount = 0;

    constructor(controller) {
        this.controller = controller;
    }

    /**
     * @param {string|undefined} message 
     */
    showError(message) {
        const postsFeed = this.controller.container.querySelector('.posts-feed');
        postsFeed.innerHTML = '';

        const errorMessageElement = this.controller.container.querySelector('.error-message');
        errorMessageElement.classList.remove('hidden');

        const paragraph = errorMessageElement.querySelector('p');
        paragraph.textContent = message || 'Algo deu errado ao carregar o feed.';
    }

    async handleDeletePost(event, postElement, postId) {
        event.preventDefault();
        const deleteButton = event.currentTarget;
        deleteButton.disabled = true;
        deleteButton.innerHTML = `<span class="spinner red-spinner"></span>`;

        try {
            const success = await this.controller.deletePost(postId);
            
            if (success) {
                postElement.remove();
            }
        } catch (error) {
            alert('Erro ao excluir a postagem. Tente novamente.');
        } finally {
            deleteButton.disabled = false;
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Restaura o ícone do botão
        }
    }

    async onSubmitPost(event) {
        event.preventDefault();

        const content = this.controller.container.querySelector('.new-post-input').value.trim();
        const postButton = this.controller.container.querySelector('.publish-btn');
        postButton.disabled = true;

        if (content.length === 0) {
            postButton.disabled = false;
            return;
        }

        postButton.innerHTML = `<span class="spinner"></span>`;
        try {
            await this.controller.publishPost(content);
        } catch (error) {
            this.showError('Erro ao publicar a postagem. Tente novamente.');
        } finally {
            postButton.innerHTML = 'Publicar'; // Restaura o texto do botão
            postButton.disabled = false; // Habilita o botão novamente
            this.controller.container.querySelector('.new-post-input').value = ''; // Limpa o campo de entrada após a publicação
            this.controller.container.querySelector('.char-count').textContent = '0 / 280'; // Reseta o contador de caracteres
        }
    }

    /**
     * @param {object[]} posts 
     * @param {object|undefined} user
     */
    render() {
        this.controller.container.innerHTML = `
            <header class="header">
                <div class="container header-container">
                    <h1 class="logo">Mini Twitter</h1>
                    <div class="user-actions">
                        <button class="btn profile-btn">Meu Perfil</button>
                        <button class="btn logout-btn">Sair</button>
                    </div>
                </div>
            </header>

            <main class="container">
                <section class="new-post">
                    <textarea class="new-post-input" placeholder="No que você está pensando?" maxlength="280"></textarea>
                    <div class="new-post-footer">
                        <span class="char-count">0 / 280</span>
                        <button class="btn publish-btn">Publicar</button>
                    </div>
                </section>

                <section class="posts-feed">
                    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                        <span class="spinner"></span>
                    </div>
                </section>

                <div class="error-message hidden">
                    <p>Algo deu errado ao carregar o feed.</p>
                    <button class="btn try-again">Tentar novamente</button>
                </div>
            </main>
        `;

        const logoutButton = this.controller.container.querySelector('.logout-btn');
        logoutButton.addEventListener('click', () => this.controller.handleLogout());

        const profileButton = this.controller.container.querySelector('.profile-btn');
        profileButton.addEventListener('click', () => this.controller.showProfile());

        const publishButton = this.controller.container.querySelector('.publish-btn');
        publishButton.addEventListener('click', this.onSubmitPost.bind(this));

        const postContent = this.controller.container.querySelector('.new-post-input');
        const charCount = this.controller.container.querySelector('.char-count');

        postContent.addEventListener('input', () => {
            charCount.textContent = `${postContent.value.length} / 280`;
        });
    }

    renderPosts(posts, user) {
        const lastPostsCount = this.#lastPostsCount;
        const scrollPosition = this.controller.container.querySelector('.posts-feed').scrollTop;

        const postsFeed = this.controller.container.querySelector('.posts-feed');
        postsFeed.innerHTML = ''; // Limpa o feed antes de renderizar

        if (posts.length === 0) {
            postsFeed.innerHTML = '<p class="no-posts">Nenhuma postagem encontrada.</p>';
            return;
        }

        this.#lastPostsCount = posts.length;
        for (const post of posts) {
            this.addPost(post, user);
        }

        // Restaura a posição de rolagem se necessário baseado no scrollPosition e na diferença de quantidade de posts
        if (lastPostsCount > 0) {
            const newPostsCount = posts.length - lastPostsCount;
            postsFeed.scrollTop = scrollPosition + (newPostsCount * 100); // Ajuste o valor 100 conforme necessário para a altura dos posts
        } else {
            postsFeed.scrollTop = 0; // Rola para o topo se for a primeira renderização
        }
    }

    addPost(post, user, isNew = false) {
        const postsFeed = this.controller.container.querySelector('.posts-feed');

        const newPostElement = document.createElement('article');
        newPostElement.classList.add('post-card');
        newPostElement.innerHTML = `
            <div class="post-header">
                <div class="post-user">
                    <i class="fas fa-user user-icon"></i>
                    <div class="post-info">
                        <span class="user-name">${post.author.username}</span>
                        <span class="separator">•</span>
                        <span class="post-date">${new Date(post.createdAt).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</span>
                    </div>
                </div>
            </div>
            <hr class="separator-hr">
            <div class="post-content">
                <p>${post.content}</p>
            </div>
        `;
        
        if (user.id === post.author._id) {
            newPostElement.innerHTML += `
                <div class="post-actions"></div>
            `;

            const postActions = newPostElement.querySelector('.post-actions');

            const deleteButton = document.createElement('button');
            deleteButton.addEventListener('click', async (event) => {
                await this.handleDeletePost(event, newPostElement, post._id);
            });

            deleteButton.classList.add('delete-btn');
            deleteButton.title = 'Excluir postagem';
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

            postActions.appendChild(deleteButton);
        }

        if (isNew) {
            postsFeed.prepend(newPostElement);
        } else {
            postsFeed.append(newPostElement);
        }
    }
}
