import ControllerManager from "../ControllerManager.js";

export default class ProfileView {
    constructor(profileController, container) {
        this.profileController = profileController;
        this.container = container;
    }

    #showPostsErrorMessage(message) {
        const errorMessage = this.container.querySelector('.error-message');
        errorMessage.classList.remove('hidden');
        errorMessage.querySelector('p').textContent = message;
    }

    #hidePostsErrorMessage() {
        const errorMessage = this.container.querySelector('.error-message');
        errorMessage.classList.add('hidden');
        errorMessage.querySelector('p').textContent = '';
    }

    #showProfileMessage(message, isError = false) {
        const profileMessage = this.container.querySelector('.profile-message');
        profileMessage.classList.remove('hidden');
        profileMessage.textContent = message;
        profileMessage.style.color = isError ? '#e0245e' : '#00adb5';
    }

    #hideProfileMessage() {
        const profileMessage = this.container.querySelector('.profile-message');
        profileMessage.classList.add('hidden');
        profileMessage.textContent = '';
    }

    async #onUpdateProfile(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const { username, email } = Object.fromEntries(formData);

        console.log("Atualizando perfil com:", { username, email });

        if (!username || !email) {
            this.#showProfileMessage("Todos os campos são obrigatórios.", true);
            return;
        }

        const updateButton = this.container.querySelector('.action[data-action="update-profile"]');

        updateButton.disabled = true;
        updateButton.innerHTML = `<span class="spinner"></span>`;

        this.#hideProfileMessage();

        try {
            await this.profileController.updateProfile(username, email);
            this.#showProfileMessage("Perfil atualizado com sucesso!");
        } catch (error) {
            this.#showProfileMessage(error.message || "Erro ao atualizar perfil", true);
            window.scrollTo(0, 0); // Rola para o topo da página para exibir a mensagem de erro
        }
        finally {
            updateButton.disabled = false;
            updateButton.innerHTML = 'Salvar'; // Restaura o texto do botão
        }
    }

    async #loadProfile() {
        try {
            return await this.profileController.loadProfile();
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            this.container.innerHTML = `
            <header>
                <div class="container-md header-wrapper">
                    <h1 class="logo">Mini Twitter</h1>
                    <div class="user-actions">
                        <button class="action" data-action="view-feed">Voltar ao Feed</button>
                        <button class="action" data-action="logout">Sair</button>
                    </div>
                </div>
            </header>

            <main class="profile-wrapper">
                <section class="container-sm container-md card">
                    <div class="error-message">Erro ao carregar perfil: ${error.message}</div>
                </section>
            </main>
            `;
            return;
        }
    }

    async #onDeletePost(event, postElement, postId) {
        event.preventDefault();

        const deleteButton = event.currentTarget;
        deleteButton.disabled = true;
        deleteButton.innerHTML = `<span class="spinner" style="--spinner-color: #d9534f;"></span>`;

        try {
            await this.profileController.deletePost(postId);
            postElement.remove();
        } catch (error) {
            this.#showPostsErrorMessage(error.message || "Erro ao excluir postagem");
            window.scrollTo(0, 0); // Rola para o topo da página para exibir a mensagem de erro
        } finally {
            deleteButton.disabled = false;
            deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Restaura o ícone do botão
        }
    }

    async render() {
        const user = await this.#loadProfile();
        if (!user) return;

        this.container.innerHTML = `
            <header>
                <div class="container-md header-wrapper">
                    <h1 class="logo">Mini Twitter</h1>
                    <div class="user-actions">
                        <button class="action" data-action="view-feed">Voltar ao Feed</button>
                        <button class="action" data-action="logout">Sair</button>
                    </div>
                </div>
            </header>

            <main class="profile-wrapper">
                <section class="container-sm card">
                    <h1 class="title">Meu Perfil</h1>

                    <form class="container-sm profile-form">
                        <div class="profile-field">
                            <label for="username">Nome de usuário</label>
                            <input type="text" id="username" name="username" value="${user.username}" required />
                        </div>
                        <div class="profile-field">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" value="${user.email}" required />
                        </div>
                        <div class="profile-field">
                            <label>Data de criação</label>
                            <input type="text" value="${new Date(user.createdAt).toLocaleString()}" disabled />
                        </div>
                        <button type="submit" class="action" data-action="update-profile">Salvar</button>
                        <div class="profile-message hidden"></div>
                    </form>
                </section>
            </main>

            <main class="feed container-md">
                <div class="error-message hidden">
                    <p>Algo deu errado ao carregar os seus posts.</p>
                    <button class="action" data-action="try-again">Tentar novamente</button>
                </div>

                <section class="posts">
                    <div class="spinner-wrapper">
                        <span class="spinner"></span>
                    </div>
                </section>
            </main
        `;

        this.container.querySelector('.profile-form').addEventListener('submit', this.#onUpdateProfile.bind(this));

        this.container.querySelector('.action[data-action="logout"]').addEventListener('click', () => {
            ControllerManager.getController("auth").logout();
        });

        this.container.querySelector('.action[data-action="view-feed"]').addEventListener('click', async () => {
            await ControllerManager.getController("feed").views.feed.render();
        });

        this.container.querySelector('.action[data-action="try-again"]').addEventListener('click', async () => {
            this.#hidePostsErrorMessage();
            await this.#loadProfilePosts();
        });

        await this.#loadProfilePosts();
    }

    async #loadProfilePosts() {
        try {
            const posts = await this.profileController.loadProfilePosts();

            const postsSection = this.container.querySelector('.posts');
            postsSection.innerHTML = '';

            if (!posts || posts.length === 0) {
                postsSection.innerHTML = '<p class="no-posts">Nenhuma postagem encontrada.</p>';
                return;
            }

            for (const post of posts) {
                this.addPost(post);
            }
        } catch (error) {
            const postsSection = this.container.querySelector('.posts');
            postsSection.innerHTML = '';

            this.#showPostsErrorMessage(error.message || "Erro ao carregar posts");
            return;
        }
    }

    addPost(post) {
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

        postsFeed.append(articleElement);
    }
}