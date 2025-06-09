import { UserRepository } from "../repositories/UserRepository.js";
import { StorageRepository } from "../repositories/StorageRepository.js";
import { ProfileView } from "../views/ProfileView.js";
import { PostController } from "./PostController.js";

export class ProfileController {
    /** @type {UserRepository} */
    userRepository;
    /** @type {StorageRepository} */
    storageRepository;
    /** @type {HTMLElement} */
    container;
    /** @type {ProfileView} */
    #profileView;

    constructor(container) {
        this.container = container;
        this.userRepository = new UserRepository();
        this.storageRepository = new StorageRepository();
        this.#profileView = new ProfileView(this);
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
            } else {
                this.#profileView.showError(result.error || 'Erro ao carregar perfil.');
            }
        } catch (e) {
            this.#profileView.showError('Não foi possível carregar o perfil.');
        }
    }

    async updateProfile(data) {
        const token = this.storageRepository.getItem('token');
        if (!token) return location.reload();
        try {
            const result = await this.userRepository.updateProfile(token, data.username, data.email);
            if (result.ok) {
                this.#profileView.render(result.user);
                this.storageRepository.setItem('user', JSON.stringify(result.user));
                this.#profileView.showSuccess('Perfil atualizado com sucesso!');
            } else {
                this.#profileView.showError(result.error || 'Erro ao atualizar perfil.');
            }
        } catch (e) {
            this.#profileView.showError('Não foi possível atualizar o perfil.');
        }
    }
}
