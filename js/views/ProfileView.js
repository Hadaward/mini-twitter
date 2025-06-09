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
                        <button class="btn feed-btn">Feed</button>
                        <button class="btn logout-btn">Sair</button>
                    </div>
                </div>
            </header>
            <main class="profile-container">
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
                    <div class="profile-message hidden"></div>
                </form>
            </main>
        `;
        const form = this.controller.container.querySelector('.profile-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const errorMessage = this.controller.container.querySelector('.profile-message');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
                errorMessage.textContent = '';
            }

            const submitButton = this.controller.container.querySelector('.profile-submit');
            submitButton.disabled = true;
            const originalButtonContent = submitButton.innerHTML;

            submitButton.innerHTML = `<span class="spinner"></span>`;

            try {
                await this.controller.updateProfile({
                    username: form.username.value,
                    email: form.email.value
                });
            } catch (error) {
                this.showError('Erro ao atualizar perfil. Tente novamente mais tarde.');
            } finally {
                submitButton.innerHTML = originalButtonContent;
                submitButton.disabled = false;
            }
        });
        const backBtn = this.controller.container.querySelector('.feed-btn');
        if (backBtn) {
            backBtn.addEventListener('click', async () => {
                await this.controller.showFeed();
            });
        }
        const logoutBtn = this.controller.container.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.controller.handleLogout();
            });
        }
    }

    showError(msg) {
        const el = this.controller.container.querySelector('.profile-message');
        if (el) {
            el.classList.remove('hidden');
            el.textContent = msg;
            el.style.color = '#e0245e';
        }
    }

    showSuccess(msg) {
        const el = this.controller.container.querySelector('.profile-message');
        if (el) {
            el.classList.remove('hidden');
            el.textContent = msg;
            el.style.color = '#00adb5';
        }
    }
}
