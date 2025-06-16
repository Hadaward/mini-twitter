import AuthController from "../../controllers/AuthController.js";

/**
 * RegisterView
 *
 * View responsável pela tela de registro de novos usuários no Mini-Twitter.
 * Gerencia a renderização do formulário, validação dos campos e exibição de mensagens de erro.
 *
 * @class
 * @property {AuthController} authController - Controlador de autenticação associado à view.
 * @property {HTMLElement} container - Elemento container onde a view será renderizada.
 */
export default class RegisterView {
    /**
     * Cria uma instância da RegisterView.
     * @param {AuthController} authController - Controlador de autenticação.
     * @param {HTMLElement} container - Elemento container para renderização.
     */
    constructor(authController, container) {
        this.authController = authController;
        this.container = container;
    }

    /**
     * Esconde a mensagem de erro do formulário.
     * @private
     */
    #hideErrorMessage() {
        const errorMessage = this.#getErrorMessageElement();
        errorMessage.classList.add("hidden");
        errorMessage.textContent = "";
    }

    /**
     * Exibe uma mensagem de erro no formulário.
     * @private
     * @param {string} message - Mensagem de erro a ser exibida.
     */
    #showErrorMessage(message) {
        const errorMessage = this.#getErrorMessageElement();
        errorMessage.classList.remove("hidden");
        errorMessage.textContent = message;
    }

    /**
     * Retorna o elemento de mensagem de erro do formulário.
     * @private
     * @returns {HTMLElement}
     */
    #getErrorMessageElement() {
        return this.container.querySelector("#error-message");
    }

    /**
     * Retorna o botão de registro do formulário.
     * @private
     * @returns {HTMLButtonElement}
     */
    #getRegisterButton() {
        return this.container.querySelector(".auth-submit");
    }

    /**
     * Manipula o evento de envio do formulário de registro.
     * Valida os campos e executa o registro via AuthController.
     * @private
     * @param {Event} event - Evento de submit do formulário.
     */
    async #onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const { name, email, password, confirmPassword } = Object.fromEntries(formData);

        if (!name || !email || !password) {
            this.#showErrorMessage("Todos os campos são obrigatórios");
            return;
        }

        if (password !== confirmPassword) {
            this.#showErrorMessage("As senhas não coincidem");
            return;
        }

        this.#hideErrorMessage();

        const registerButton = this.#getRegisterButton();
        const originalButtonContent = registerButton.innerHTML;
        registerButton.disabled = true;
        registerButton.innerHTML = `<span class="spinner"></span>`;

        try {
            await this.authController.register(name, email, password);
        } catch (error) {
            this.#showErrorMessage(error.message || "Erro ao registrar usuário");
        } finally {
            registerButton.innerHTML = originalButtonContent;
            registerButton.disabled = false;
        }
    }

    /**
     * Renderiza a tela de registro no container associado.
     * Adiciona listeners para submit do formulário e troca para tela de login.
     */
    render() {
        this.container.innerHTML = `
            <main class="auth-wrapper">
                <img src="assets/twitter.png" alt="Logo Twitter" class="auth-logo">
                <h1 class="auth-title">Registrar no Mini Twitter</h1>
                <form class="container-sm auth-form">
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
                        <input type="password" id="confirm-password" name="confirmPassword" required>
                    </div>
                    <button type="submit" class="auth-submit">Registrar</button>
                    <div class="auth-error hidden" id="error-message"></div>
                    <div class="auth-alt-action">
                        <p>Já tem uma conta? <button type="button" id="show-login">Entrar</button></p>
                    </div>
                </form>
            </main>
        `;

        const form = this.container.querySelector('.auth-form');
        form.addEventListener('submit', this.#onSubmit.bind(this));

        const showLoginButton = this.container.querySelector("#show-login");
        showLoginButton.addEventListener("click", () => {
            this.authController.views.login.render();
        });
    }
}