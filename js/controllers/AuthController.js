import ControllerManager from "../ControllerManager.js";
import gateways from "../gateways.js";
import AuthRepository from "../repositories/AuthRepository.js";
import LoginView from "../views/Auth/LoginView.js";
import RegisterView from "../views/Auth/RegisterView.js";

/**
 * AuthController
 *
 * Controlador responsável por gerenciar autenticação de usuários no Mini-Twitter.
 * Interage com o AuthRepository para login e registro, além de gerenciar views de autenticação.
 *
 * @class
 * @property {AuthRepository} #authRepository - Instância do repositório de autenticação.
 * @property {object} views - Views de autenticação (login e registro).
 */
export default class AuthController {
    #authRepository;

    /**
     * Cria uma instância do AuthController.
     * @param {HTMLElement} container - Elemento container para renderização das views.
     */
    constructor(container) {
        this.#authRepository = new AuthRepository(gateways.AUTH_URL);
        this.views = {
            login: new LoginView(this, container),
            register: new RegisterView(this, container)
        };
    }

    /**
     * Verifica se o usuário está autenticado.
     * @returns {boolean} True se o token está presente no localStorage.
     */
    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    /**
     * Obtém os dados do usuário atual.
     * @returns {object|null} Retorna os dados do usuário atual ou null se não estiver autenticado.
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    /**
     * Realiza o logout do usuário.
     * Remove o token e os dados do usuário do localStorage e renderiza a view de login.
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.views.login.render();
    }

    /**
     * Realiza o login do usuário.
     * Salva token e dados do usuário no localStorage em caso de sucesso.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @throws {Error} Se o login falhar.
     * @returns {Promise<void>}
     */
    async login(email, password) {
        const response = await this.#authRepository.login(email, password);

        if (!response.ok) {
            throw new Error(response.error || 'Login failed');
        }

        this.#saveSession(response.user, response.token);
        ControllerManager.getController("feed").views.feed.render(); // Renderiza o feed após login
    }

    /**
     * Realiza o registro de um novo usuário.
     * Salva token e dados do usuário no localStorage em caso de sucesso.
     * @param {string} username - Nome de usuário.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @throws {Error} Se o registro falhar.
     * @returns {Promise<void>}
     */
    async register(username, email, password) {
        const response = await this.#authRepository.register(username, email, password);

        if (!response.ok) {
            throw new Error(response.error || 'Registration failed');
        }

        this.#saveSession(response.user, response.token);
        ControllerManager.getController("feed").views.feed.render(); // Renderiza o feed após registro
    }

    /**
     * Salva dados do usuário e token no localStorage.
     * @private
     * @param {object} user - Dados do usuário.
     * @param {string} token - Token de autenticação.
     */
    #saveSession(user, token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    }
}