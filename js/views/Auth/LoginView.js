import AuthController from "../../controllers/AuthController.js";

/**
 * LoginView
 *
 * View responsável pela tela de login de usuários no Mini-Twitter.
 * Gerencia a renderização do formulário, validação dos campos e exibição de mensagens de erro.
 *
 * @class
 * @property {AuthController} authController - Controlador de autenticação associado à view.
 * @property {HTMLElement} container - Elemento container onde a view será renderizada.
 */
export default class LoginView {
    /**
     * Cria uma instância da LoginView.
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
     * Retorna o botão de login do formulário.
     * @private
     * @returns {HTMLButtonElement}
     */
    #getLoginButton() {
        return this.container.querySelector(".auth-submit");
    }

    /**
     * Manipula o evento de envio do formulário de login.
     * Valida os campos e executa o login via AuthController.
     * @private
     * @param {Event} event - Evento de submit do formulário.
     */
    async #onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const { email, password } = Object.fromEntries(formData);

        if (!email || !password) {
            this.#showErrorMessage("Todos os campos são obrigatórios");
            return;
        }

        this.#hideErrorMessage();

        const loginButton = this.#getLoginButton();
        const originalButtonContent = loginButton.innerHTML;
        loginButton.disabled = true;
        loginButton.innerHTML = `<span class=\"spinner\"></span>`;

        try {
            await this.authController.login(email, password);
        } catch (error) {
            this.#showErrorMessage(error.message || "Erro ao realizar login");
        } finally {
            loginButton.innerHTML = originalButtonContent;
            loginButton.disabled = false;
        }
    }

    /**
     * Renderiza a tela de login no container associado.
     * Adiciona listeners para submit do formulário e troca para tela de registro.
     */
    render() {
        this.container.innerHTML = `
            <main class="auth-wrapper">
                <img src="assets/twitter.png" alt="Logo Twitter" class="auth-logo">
                <h1 class="auth-title">Entrar no Mini Twitter</h1>
                <form class="container-sm auth-form">
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
                        <p>Não tem uma conta? <button type="button" class="show-register">Registrar</button></p>
                    </div>
                </form>
            </main>
        `;

        const form = this.container.querySelector('.auth-form');
        form.addEventListener('submit', this.#onSubmit.bind(this));

        const showRegisterButton = this.container.querySelector(".show-register");
        showRegisterButton.addEventListener("click", () => {
            this.authController.views.register.render();
        });
    }
}