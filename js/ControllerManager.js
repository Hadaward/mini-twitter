/**
 * @type {Map<string, unknown>}
 */
const registeredControllers = new Map();

export default {
    registerController(name, controller) {
        registeredControllers.set(name, controller);
    },
    getController(name) {
        return registeredControllers.get(name);
    },
    unregisterController(name) {
        registeredControllers.delete(name);
    }
}