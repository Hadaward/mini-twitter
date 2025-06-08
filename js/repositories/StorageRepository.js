/**
 * Classe responsável por gerenciar o armazenamento local do navegador.
 */
export class StorageRepository {
    constructor() {
        this.storage = window.localStorage;
    }
    
    /**
     * Recupera um item do armazenamento local.
     * @param {string} key - A chave do item a ser recuperado.
     * @returns {string|null} O valor do item armazenado ou null se não existir.
     */
    getItem(key) {
        return this.storage.getItem(key);
    }
    
    /**
     * Armazena um item no armazenamento local.
     * @param {string} key - A chave sob a qual o item será armazenado.
     * @param {string} value - O valor a ser armazenado.
     */
    setItem(key, value) {
        this.storage.setItem(key, value);
    }

    /**
     * Remove um item do armazenamento local.
     * @param {string} key - A chave do item a ser removido.
     */
    removeItem(key) {
        this.storage.removeItem(key);
    }

    /**
     * Limpa todo o armazenamento local.
     */
    clear() {
        this.storage.clear();
    }
}