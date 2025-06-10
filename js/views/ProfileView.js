import { ProfileController } from '../controllers/ProfileController.js';

export class ProfileView {
    /** @type {ProfileController} */
    controller;
    constructor(controller) {
        this.controller = controller;
    }

    render(user) {
        this.controller.container.innerHTML = `
            <header class="header">
                <div class="container header-container">
                    <h1 class="logo">Mini Twitter</h1>
                    <div class="user-actions">
                        <button class="btn feed-btn" id="back-feed">Feed</button>
                        <button class="btn logout-btn">Sair</button>
                    </div>
                </div>
            </header>
            <main class="profile-container">
                <section class="profile-info-card">
                    <h1 class="profile-title">Meu Perfil</h1>
                    <form class="profile-form">
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
                        <button type="submit" class="profile-submit">Salvar</button>
                        <div class="profile-message" id="profile-message"></div>
                    </form>
                </section>
                <div class="profile-posts-section">
                    <h2 class="profile-posts-title">Minhas Postagens</h2>
                    <section class="posts-feed profile-posts-list">
                        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                            <span class="spinner"></span>
                        </div>
                    </section>
                </div>
            </main>
        `;
        const form = this.controller.container.querySelector('.profile-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                username: form.username.value,
                email: form.email.value
            };
            this.controller.updateProfile(data);
        });
        const backBtn = this.controller.container.querySelector('#back-feed');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.controller.showFeed();
            });
        }
        const logoutBtn = this.controller.container.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.controller.handleLogout();
            });
        }
    }

    renderPosts(posts = []) {
        const postsList = this.controller.container.querySelector('.profile-posts-list');
        if (!postsList) return;
        if (posts.length === 0) {
            postsList.innerHTML = '<p class="profile-no-posts">Você ainda não publicou nada.</p>';
            return;
        }
        postsList.innerHTML = '';

        for (const post of posts) {
            this.addPost(postsList, post);
        }
    }

    addPost(container, post) {
        const article = document.createElement('article');
        article.className = 'post-card';

        article.innerHTML = `
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
            <div class="post-actions"></div>
        `;

        const postActions = article.querySelector('.post-actions');

        const deleteButton = document.createElement('button');
        deleteButton.addEventListener('click', async (event) => {
            await this.handleDeletePost(event, article, post._id);
        });

        deleteButton.classList.add('delete-btn');
        deleteButton.title = 'Excluir postagem';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

        postActions.appendChild(deleteButton);

        container.appendChild(article);
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

    showError(msg) {
        const el = this.controller.container.querySelector('#profile-message');
        if (el) {
            el.textContent = msg;
            el.style.color = '#e0245e';
        }
    }

    showSuccess(msg) {
        const el = this.controller.container.querySelector('#profile-message');
        if (el) {
            el.textContent = msg;
            el.style.color = '#00adb5';
        }
    }
}
