import { UserRepository } from "../repositories/UserRepository.js";
import { StorageRepository } from "../repositories/StorageRepository.js";
import { ProfileView } from "../views/ProfileView.js";
import { PostController } from "./PostController.js";
import { PostRepository } from "../repositories/PostRepository.js";
import gateways from "../gateways.js";
import { AuthController } from "./AuthController.js";

export class ProfileController {
    /** @type {UserRepository} */
    userRepository;
    /** @type {StorageRepository} */
    storageRepository;
    /** @type {PostRepository} */
    postsRepository;
    /** @type {HTMLElement} */
    container;
    /** @type {ProfileView} */
    #profileView;

    constructor(container) {
        this.container = container;
        this.userRepository = new UserRepository(gateways.USERS_URL);
        this.storageRepository = new StorageRepository();
        this.postsRepository = new PostRepository(gateways.POSTS_URL);
        this.#profileView = new ProfileView(this);
    }

    handleLogout() {
        this.storageRepository.clear();
        new AuthController(this.container).showLoginView();
    }

    async deletePost(postId) {
        const token = this.storageRepository.getItem('token');
        if (!token) return location.reload();

        try {
            const result = await this.postsRepository.deletePost(token, postId);
            return result.ok;
        } catch (error) {
            console.error('Erro ao excluir post:', error);
            alert('Não foi possível excluir o post.');
        }
    }

    async showFeed() {
        await new PostController(this.container).showFeedView();
    }

    async showProfileView() {
        const token = this.storageRepository.getItem('token');
        if (!token) return location.reload();
        try {
            const result = await this.userRepository.getProfile(token);
            if (result.ok) {
                this.#profileView.render(result.user);
                await this.#loadProfilePosts();
            } else {
                this.#profileView.showError(result.error || 'Erro ao carregar perfil.');
            }
        } catch (e) {
            this.#profileView.showError('Não foi possível carregar o perfil.');
        }
    }

    async #loadProfilePosts() {
        const token = this.storageRepository.getItem('token');
        if (!token) return location.reload();
        try {
            const result = await this.postsRepository.fetchMyPosts(token);
            if (result.ok) {
                this.#profileView.renderPosts(result.posts);
            } else {
                this.#profileView.showError(result.error || 'Erro ao carregar postagens.');
            }
        } catch (e) {
            this.#profileView.showError('Não foi possível carregar as postagens.');
        }
    }

    async updateProfile(data) {
        const token = this.storageRepository.getItem('token');
        if (!token) return location.reload();
        try {
            const result = await this.userRepository.updateProfile(token, data.username, data.email);
            if (result.ok) {
                this.#profileView.render(result.user);
                this.storageRepository.setItem('user', JSON.stringify({
                    id: result.user._id,
                    ...result.user
                }));
                this.#profileView.showSuccess('Perfil atualizado com sucesso!');
                this.#loadProfilePosts(); // Recarrega as postagens após atualização do perfil
            } else {
                this.#profileView.showError(result.error || 'Erro ao atualizar perfil.');
            }
        } catch (e) {
            this.#profileView.showError('Não foi possível atualizar o perfil.');
        }
    }
}
