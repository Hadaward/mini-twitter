import { AuthController } from "../controllers/AuthController.js";

export class RegisterView {
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

        const name = this.controller.container.querySelector('#name').value;
        const email = this.controller.container.querySelector('#email').value;
        const password = this.controller.container.querySelector('#password').value;
        const confirmPassword = this.controller.container.querySelector('#confirm-password').value;

        if (password !== confirmPassword) {
            this.showError('As senhas não coincidem');
            return;
        }

        if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
            this.showError('Todos os campos são obrigatórios');
            return;
        }
        
        this.hideError();
        
        const registerButton = this.controller.container.querySelector('.auth-submit');
        registerButton.disabled = true;

        const originalButtonContent = registerButton.innerHTML;
        registerButton.innerHTML = `<span class="spinner"></span>`;

        try {
            await this.controller.handleRegisterRequest(name, email, password);
        } finally {
            registerButton.innerHTML = originalButtonContent;
            registerButton.disabled = false;
        }
    }

    render() {
        this.controller.container.innerHTML = `
            <main class="auth-container">
                <h1 class="auth-title">Registrar no Mini Twitter</h1>
                <form class="auth-form">
                    <div class="auth-field">
                        <label for="name">Nome de usuário:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="auth-field">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="auth-field">
                        <label for="password">Senha:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <div class="auth-field">
                        <label for="confirm-password">Confirmação de Senha:</label>
                        <input type="password" id="confirm-password" name="confirm-password" required>
                    </div>
                    <button type="submit" class="auth-submit">Registrar</button>
                    <div class="auth-error hidden" id="error-message"></div>
                    <div class="auth-alt-action">
                        <p>Já tem uma conta? <button type="button" id="go-login">Entrar</button></p>
                    </div>
                </form>
            </main>
        `;

        const form = this.controller.container.querySelector('.auth-form');
        form.addEventListener('submit', this.#onSubmit.bind(this));

        const loginButton = this.controller.container.querySelector('#go-login');
        loginButton.addEventListener('click', () => {
            this.controller.showLoginView();
        });
    }
}