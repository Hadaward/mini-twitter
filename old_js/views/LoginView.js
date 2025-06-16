import { AuthController } from "../controllers/AuthController.js";

export class LoginView {
    /**
     * @type {AuthController}
     */
    controller;

    /**
     * @param {AuthController} controller 
     */
    constructor(controller) {
        this.controller = controller;
    }

    showError(message) {
        const errorMessageElement = this.controller.container.querySelector('#error-message');
        errorMessageElement.textContent = message;
        errorMessageElement.classList.remove('hidden');
    }

    hideError() {
        const errorMessageElement = this.controller.container.querySelector('#error-message');
        errorMessageElement.textContent = '';
        errorMessageElement.classList.add('hidden');
    }

    async #onSubmit(event) {
        event.preventDefault();

        const email = this.controller.container.querySelector('#email').value;
        const password = this.controller.container.querySelector('#password').value;

        this.hideError();

        const loginButton = this.controller.container.querySelector('.auth-submit');
        loginButton.disabled = true;
        
        const originalButtonContent = loginButton.innerHTML;
        loginButton.innerHTML = `<span class="spinner"></span>`;

        try {
            await this.controller.handleLoginRequest(email, password);
        } finally {
            loginButton.innerHTML = originalButtonContent;
            loginButton.disabled = false;
        }
        return;
    }

    render() {
        this.controller.container.innerHTML = `
            <main class="auth-container">
                <img src="assets/twitter.png" alt="Logo Twitter" class="auth-logo">
                <h1 class="auth-title">Entrar no Mini Twitter</h1>
                <form class="auth-form">
                    <div class="auth-field">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="auth-field">
                        <label for="password">Senha:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="auth-submit">Entrar</button>
                    <div class="auth-error hidden" id="error-message"></div>
                    <div class="auth-alt-action">
                        <p>Não tem uma conta? <button type="button" id="go-register">Registrar</button></p>
                    </div>
                </form>
                <footer class="auth-credits">
                    <small>
                        <a href="https://www.flaticon.com/br/icones-gratis/twitter" target="_blank" rel="noopener noreferrer" title="twitter ícones">
                            Twitter ícones criados por Pixel perfect - Flaticon
                        </a>
                    </small>
                </footer>
            </main>
        `;

        const form = this.controller.container.querySelector('.auth-form');
        form.addEventListener('submit', this.#onSubmit.bind(this));

        const registerButton = this.controller.container.querySelector('#go-register');
        registerButton.addEventListener('click', () => {
            this.controller.showRegisterView();
        });
    }
}