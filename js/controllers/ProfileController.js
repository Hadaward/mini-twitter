import { UserRepository } from "../repositories/UserRepository.js";
import ProfileView from "../views/ProfileView.js";
import gateways from "../gateways.js";
import ControllerManager from "../ControllerManager.js";
import PostRepository from "../repositories/PostRepository.js";

/**
 * Controller responsável por gerenciar as operações de perfil do usuário,
 * incluindo atualização de dados, carregamento de perfil e postagens, e exclusão de posts.
 */
export default class ProfileController {
    /**
     * Instância do repositório de usuários
     * @type {UserRepository}
     */
    #userRepository;
    /**
     * Instância do repositório de postagens
     * @type {PostRepository}
     */
    #postRepository;

    /**
     * Views associadas ao controller
     * @type {{ profile: ProfileView }}
     */
    views;

    /**
     * Cria uma nova instância do ProfileController
     * @param {HTMLElement} container - Elemento container para renderização da view
     */
    constructor(container) {
        this.#userRepository = new UserRepository(gateways.USERS_URL);
        this.#postRepository = new PostRepository(gateways.POSTS_URL);
        this.views = {
            profile: new ProfileView(this, container)
        };
    }

    /**
     * Verifica se o usuário está autenticado e retorna o token JWT.
     * Se não estiver autenticado, redireciona para a tela de login.
     * @private
     * @returns {string|null} Token JWT ou null se não autenticado
     */
    #getAuthToken() {
        const authController = ControllerManager.getController("auth");
        if (!authController.isLoggedIn()) {
            if (authController.views && authController.views.login) {
                authController.views.login.render();
            }
            return null;
        }
        return localStorage.getItem("token");
    }

    /**
     * Atualiza o perfil do usuário autenticado.
     * Lança erro caso a atualização falhe.
     * @param {string} username - Novo nome de usuário
     * @param {string} email - Novo email
     * @returns {Promise<object>} Resultado da atualização
     * @throws {Error} Caso a atualização falhe
     */
    async updateProfile(username, email) {
        const token = this.#getAuthToken();
        if (!token) return;
        const response = await this.#userRepository.updateProfile(token, username, email);
        if (!response.ok) {
            throw new Error(response.error || "Erro ao atualizar perfil");
        }
        return response;
    }

    /**
     * Carrega o perfil do usuário autenticado.
     * Lança erro caso a requisição falhe.
     * @returns {Promise<object>} Perfil do usuário
     * @throws {Error} Caso a requisição falhe
     */
    async loadProfile() {
        const token = this.#getAuthToken();
        if (!token) return;
        const response = await this.#userRepository.getProfile(token);
        if (!response.ok) {
            throw new Error(response.error || "Erro ao carregar perfil");
        }
        return response;
    }

    /**
     * Carrega as postagens do usuário autenticado.
     * Lança erro caso a requisição falhe.
     * @returns {Promise<Array>} Lista de posts do usuário
     * @throws {Error} Caso a requisição falhe
     */
    async loadProfilePosts() {
        const token = this.#getAuthToken();
        if (!token) return;
        const response = await this.#postRepository.fetchMyPosts(token);
        if (!response.ok) {
            throw new Error(response.error || "Erro ao carregar perfil");
        }
        return response.posts;
    }

    /**
     * Exclui uma postagem do usuário autenticado.
     * Lança erro caso a exclusão falhe.
     * @param {string} postId - ID da postagem
     * @returns {Promise<void>}
     * @throws {Error} Caso a exclusão falhe
     */
    async deletePost(postId) {
        const token = this.#getAuthToken();
        if (!token) return;
        const response = await this.#postRepository.deletePost(token, postId);
        if (!response.ok) {
            throw new Error(response.error || "Erro ao deletar post");
        }
    }
}