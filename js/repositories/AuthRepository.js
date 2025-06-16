/**
 * Repositório responsável por autenticação de usuários.
 * Fornece métodos para login e registro, realizando requisições HTTP para a API.
 *
 * @class AuthRepository
 * @property {string} baseUrl - URL base da API de autenticação.
 */
export default class AuthRepository {
    /**
     * Cria uma instância do AuthRepository.
     * @param {string} baseUrl - URL base da API.
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Realiza o login de um usuário.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Promise<{ok: false, error: string} | {ok: true, user: object, token: string}>} Resultado da autenticação.
     */
    async login(email, password) {
        return this.#postAndHandle('/login', { email, password }, {
            401: 'Email ou senha inválidos',
            500: 'Erro interno do servidor',
            default: 'Erro desconhecido'
        });
    }

    /**
     * Registra um novo usuário.
     * @param {string} username - Nome de usuário.
     * @param {string} email - Email do usuário.
     * @param {string} password - Senha do usuário.
     * @returns {Promise<{ok: false, error: string} | {ok: true, user: object, token: string}>} Resultado do registro.
     */
    async register(username, email, password) {
        return this.#postAndHandle('/register', { username, email, password }, {
            400: 'Usuario ou email já existe',
            500: 'Erro interno do servidor',
            default: 'Erro desconhecido'
        });
    }

    /**
     * Método privado para realizar requisições POST e tratar respostas e erros.
     * @private
     * @param {string} endpoint - Endpoint da API.
     * @param {object} body - Corpo da requisição.
     * @param {object} errorMessages - Mapeamento de códigos de status para mensagens de erro.
     * @returns {Promise<{ok: false, error: string} | {ok: true, user: object, token: string}>}
     */
    async #postAndHandle(endpoint, body, errorMessages) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const error = errorMessages[response.status] || errorMessages.default || 'Erro desconhecido';
            return { ok: false, error };
        }

        const data = await response.json();
        return { ok: true, user: data.user, token: data.token };
    }
}