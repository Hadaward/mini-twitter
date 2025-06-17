import AuthController from "./controllers/AuthController.js";
import FeedController from "./controllers/FeedController.js";
import ControllerManager from "./ControllerManager.js";
import ProfileController from "./controllers/ProfileController.js";

/**
 * Inicializa a aplicação Mini-Twitter.
 * Responsável por registrar controladores e renderizar a view inicial.
 *
 * @function initializeApp
 * @param {HTMLElement} root - Elemento raiz da aplicação.
 */
function initializeApp(root) {
    const authController = new AuthController(root);
    const feedController = new FeedController(root);

    ControllerManager.registerController("auth", authController);
    ControllerManager.registerController("feed", feedController);
    ControllerManager.registerController("profile", new ProfileController(root));

    if (!authController.isLoggedIn()) {
        authController.views.login.render();
    } else {
        feedController.views.feed.render();
    }
}

// Ponto de entrada da aplicação
const root = document.querySelector("#root");
initializeApp(root);