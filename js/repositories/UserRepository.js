// Classe responsável por operações relacionadas ao usuário na API
export class UserRepository {
    /**
     * URL base da API
     * @type {string}
     */
    baseUrl;

    /**
     * Inicializa o repositório com a URL base da API
     * @param {string} baseUrl
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Realiza uma requisição à API
     * @param {string} endpoint - Caminho do endpoint
     * @param {object} options - Opções do fetch
     * @param {string} [defaultError] - Mensagem de erro padrão
     * @returns {Promise<object>} Resultado da requisição
     */
    async #request(endpoint, options = {}, defaultError = 'Erro de conexão.') {
        try {
            const res = await fetch(`${this.baseUrl}${endpoint}`, options);
            if (!res.ok) return { ok: false, error: this.getErrorMessage(res) };
            const data = await res.json();
            return { ok: true, ...data };
        } catch {
            return { ok: false, error: defaultError };
        }
    }

    /**
     * Retorna mensagem de erro baseada no status da resposta
     * @param {Response} res
     * @returns {string}
     */
    getErrorMessage(res) {
        switch (res.status) {
            case 400:
                return 'Nome de usuário ou email já está em uso.';
            case 401:
                return 'Não autorizado.';
            case 404:
                return 'Usuário não encontrado.';
            default:
                return 'Erro ao processar requisição.';
        }
    }

    /**
     * Busca o perfil do usuário autenticado
     * @param {string} token - Token JWT
     * @returns {Promise<object>} Perfil do usuário ou erro
     */
    async getProfile(token) {
        return this.#request('/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        }, 'Erro ao buscar perfil.');
    }

    /**
     * Atualiza o perfil do usuário autenticado
     * @param {string} token - Token JWT
     * @param {string} username - Novo nome de usuário
     * @param {string} email - Novo email
     * @returns {Promise<object>} Resultado da atualização
     */
    async updateProfile(token, username, email) {
        return this.#request('/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username.trim(),
                email: email.trim()
            })
        }, 'Erro ao atualizar perfil.');
    }
}
