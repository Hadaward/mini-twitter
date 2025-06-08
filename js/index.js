import { AuthController } from "./controllers/AuthController.js";
import { PostController } from "./controllers/PostController.js";
import { StorageRepository } from "./repositories/StorageRepository.js";

const app = document.querySelector('#root');
const storageRepository = new StorageRepository();

if (storageRepository.getItem('token')) {
    const postController = new PostController(app);
    postController.showFeedView();
} else {
    const authController = new AuthController(app);
    authController.showLoginView();
}