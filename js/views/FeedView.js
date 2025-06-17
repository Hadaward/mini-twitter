import ControllerManager from "../ControllerManager.js";

export default class FeedView {
    /**
     * Cria uma instância da FeedView.
     * @param {FeedController} feedController - Controlador de feed.
     * @param {HTMLElement} container - Elemento container para renderização.
     */
    constructor(feedController, container) {
        this.feedController = feedController;
        this.container = container;
    }

    #showErrorMessage(message) {
        const errorMessage = this.container.querySelector('.error-message');
        errorMessage.classList.remove('hidden');
        errorMessage.querySelector('p').textContent = message;
    }

    #hideErrorMessage() {
        const errorMessage = this.container.querySelector('.error-message');
        errorMessage.classList.add('hidden');
        errorMessage.querySelector('p').textContent = '';
    }

    async #onDeletePost(event, postElement, postId) {
        event.preventDefault();

        const deleteButton = event.currentTarget;
        deleteButton.disabled = true;
        deleteButton.innerHTML = `<span class="spinner" style="--spinner-color: #d9534f;"></span>`;

        try {
            await this.feedController.deletePost(postId);
            postElement.remove();
        } catch (error) {
            this.#showErrorMessage(error.message || "Erro ao excluir postagem");
            window.scrollTo(0, 0); // Rola para o topo da página para exibir a mensagem de erro
        } finally {
            deleteButton.disabled = false;
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Restaura o ícone do botão
        }
    }

    async #onPublishPost(event) {
        event.preventDefault();

        const textarea = this.container.querySelector('textarea');
        const content = textarea.value.trim();

        if (!content) {
            this.#showErrorMessage("O conteúdo do post não pode estar vazio.");
            return;
        }

        const postButton = this.container.querySelector('.action[data-action="publish-post"]');
        postButton.disabled = true;
        postButton.innerHTML = `<span class="spinner"></span>`;

        try {
            const post = await this.feedController.publishPost(content);
            textarea.value = '';
            this.#loadPosts();
            this.addPost(post, ControllerManager.getController("auth").getCurrentUser(), true);
        } catch (error) {
            this.#showErrorMessage(error.message || "Erro ao publicar post");
            window.scrollTo(0, 0);
        } finally {
            postButton.disabled = false;
            postButton.innerHTML = 'Publicar';
        }
    }

    async render() {
        this.container.innerHTML = `
            <header>
                <div class="container-md header-wrapper">
                    <h1 class="logo">Mini Twitter</h1>
                    <div class="user-actions">
                        <button class="action" data-action="view-profile">Meu Perfil</button>
                        <button class="action" data-action="logout">Sair</button>
                    </div>
                </div>
            </header>

            <main class="feed container-md">
                <section class="add-post">
                    <textarea placeholder="No que você está pensando?" maxlength="280"></textarea>
                    <div class="footer">
                        <span class="char-count">0 / 280</span>
                        <button class="action" data-action="publish-post">Publicar</button>
                    </div>
                </section>

                <div class="error-message hidden">
                    <p>Algo deu errado ao carregar o feed.</p>
                    <button class="action" data-action="try-again">Tentar novamente</button>
                </div>

                <section class="posts">
                    <div class="spinner-wrapper">
                        <span class="spinner"></span>
                    </div>
                </section>
            </main>
        `;

        this.container.querySelector('.action[data-action="logout"]').addEventListener('click', () => {
            ControllerManager.getController("auth").logout();
        });

        this.container.querySelector('.action[data-action="view-profile"]').addEventListener('click', async () => {
            await ControllerManager.getController("profile").views.profile.render();
        });

        this.container.querySelector('.action[data-action="publish-post"]').addEventListener('click', this.#onPublishPost.bind(this));

        this.container.querySelector('.action[data-action="try-again"]').addEventListener('click', async () => {
            this.#hideErrorMessage();
            await this.#loadPosts();
        });

        this.#loadPosts();
    }

    async #loadPosts() {
        try {
            const posts = await this.feedController.loadPosts();

            const postsSection = this.container.querySelector('.posts');
            postsSection.innerHTML = '';

            if (!posts || posts.length === 0) {
                postsSection.innerHTML = '<p class="no-posts">Nenhuma postagem encontrada.</p>';
                return;
            }

            const user = ControllerManager.getController("auth").getCurrentUser();

            for (const post of posts) {
                this.addPost(post, user);
            }
        } catch (error) {
            const postsSection = this.container.querySelector('.posts');
            postsSection.innerHTML = '';

            this.#showErrorMessage(error.message || "Erro ao carregar posts");
            return;
        }
    }

    addPost(post, user, isNew = false) {
        const postsFeed = this.container.querySelector('.feed .posts');

        const articleElement = document.createElement('article');
        articleElement.classList.add('post');

        articleElement.innerHTML = `
            <div class="header">
                <div class="user">
                    <i class="fas fa-user icon"></i>
                    <div class="info">
                        <span class="username">${post.author.username}</span>
                        <span class="separator">•</span>
                        <span class="created-at">${new Date(post.createdAt).toLocaleDateString('pt-BR', {
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
            <div class="content">
                <p>${post.content}</p>
            </div>
        `;

        if (user.id === post.author._id) {
            articleElement.innerHTML += `
                <div class="actions"></div>
            `;

            const postActions = articleElement.querySelector('.actions');

            const deleteButton = document.createElement('button');
            deleteButton.addEventListener('click', async (event) => {
                await this.#onDeletePost(event, articleElement, post._id);
            });

            deleteButton.classList.add('action');
            deleteButton.dataset.action = 'delete-post';
            deleteButton.title = 'Excluir postagem';
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

            postActions.appendChild(deleteButton);
        }

        if (isNew) {
            postsFeed.prepend(articleElement);
        } else {
            postsFeed.append(articleElement);
        }
    }
}