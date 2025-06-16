import gateways from "../gateways.js";
import { AuthRepository } from "../repositories/AuthRepository.js";
import { StorageRepository } from "../repositories/StorageRepository.js";
import { LoginView } from "../views/LoginView.js";
import { RegisterView } from "../views/RegisterView.js";
import { PostController } from "./PostController.js";

export class AuthController {
    /**
     * @type {LoginView}
     */
    #loginView;

    /**
     * @type {RegisterView}
     */
    #registerView;

    /**
     * @type {StorageRepository}
     */
    storageRepository;

    /**
     * @type {AuthRepository}
     */
    authRepository;
    /**
     * @type {HTMLElement}
     */
    container;

    /**
     * @param {HTMLElement} container 
     */
    constructor(container) {
        this.container = container;

        this.authRepository = new AuthRepository(gateways.AUTH_URL);
        this.storageRepository = new StorageRepository();

        this.#loginView = new LoginView(this);
        this.#registerView = new RegisterView(this);
    }

    showLoginView() {
        this.#loginView.render();
    }

    showRegisterView() {
        this.#registerView.render();
    }

    async handleLoginRequest(email, password) {
        const result = await this.authRepository.login(email, password);

        if (result.ok) {
            // Armazenar o token e o usuário no localStorage
            this.storageRepository.clear(); // Limpa o armazenamento local antes de armazenar novos dados
            this.storageRepository.setItem('token', result.token);
            this.storageRepository.setItem('user', JSON.stringify(result.user));
            new PostController(this.container).showFeedView(); // Redireciona para a página de feed após o login bem-sucedido
        } else {
            // Exibir mensagem de erro
            this.#loginView.showError(result.error);
        }
    }

    async handleRegisterRequest(name, email, password) {
        const result = await this.authRepository.register(name, email, password);

        if (result.ok) {
            // Armazenar o token e o usuário no localStorage
            this.storageRepository.setItem('token', result.token);
            this.storageRepository.setItem('user', JSON.stringify(result.user));
            new PostController(this.container).showFeedView(); // Redireciona para a página de feed após o registro bem-sucedido
        } else {
            // Exibir mensagem de erro
            this.#registerView.showError(result.error);
        }
    }
}