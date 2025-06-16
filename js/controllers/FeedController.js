import ControllerManager from "../ControllerManager.js";
import gateways from "../gateways.js";
import PostRepository from "../repositories/PostRepository.js";
import FeedView from "../views/FeedView.js";

/**
 * FeedController
 *
 * Controlador responsável por gerenciar operações do feed de posts no Mini-Twitter.
 * Interage com o PostRepository para buscar, criar e deletar posts.
 *
 * @class
 * @property {PostRepository} #postRepository - Instância do repositório de posts.
 * @property {object} views - Views de feed.
 */
export default class FeedController {
    #postRepository;

    /**
     * Cria uma instância do FeedController.
     * @param {HTMLElement} container - Elemento container para renderização das views.
     */
    constructor(container) {
        this.#postRepository = new PostRepository(gateways.POSTS_URL);

        this.views = {
            feed: new FeedView(this, container)
        };
    }

    async publishPost(content) {
        const authController = ControllerManager.getController("auth");

        if (!authController.isLoggedIn()) {
            this.views.feed.renderLogin();
            return;
        }

        const token = localStorage.getItem("token");

        const response = await this.#postRepository.createPost(token, content);
        if (!response.ok) {
            throw new Error(response.error || "Erro ao publicar post");
        }

        return response.post;
    }

    async deletePost(postId) {
        const authController = ControllerManager.getController("auth");

        if (!authController.isLoggedIn()) {
            this.views.feed.renderLogin();
            return;
        }

        const token = localStorage.getItem("token");

        const response = await this.#postRepository.deletePost(token, postId);
        if (!response.ok) {
            throw new Error(response.error || "Erro ao deletar post");
        }
    }

    async loadPosts() {
        const authController = ControllerManager.getController("auth");

        if (!authController.isLoggedIn()) {
            this.views.feed.renderLogin();
            return;
        }

        const token = localStorage.getItem("token");

        const response = await this.#postRepository.fetchAllPosts(token);
        if (!response.ok) {
            throw new Error(response.error || "Erro ao carregar posts");
        }

        return response.posts;
    }
}