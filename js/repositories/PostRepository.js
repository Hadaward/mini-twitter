/**
 * Repositório responsável por operações relacionadas a posts no Mini-Twitter.
 * Fornece métodos para buscar, criar e deletar posts, realizando requisições HTTP para a API.
 *
 * @class PostRepository
 * @property {string} baseUrl - URL base da API de posts.
 */
export default class PostRepository {
    /**
     * Cria uma instância do PostRepository.
     * @param {string} baseUrl - URL base da API.
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Obtém todos os posts publicados.
     * @param {string} token - Token de autenticação.
     * @returns {Promise<{ok: false, error: string} | {ok: true, posts: object[]}>}
     */
    async fetchAllPosts(token) {
        return this.#request({
            endpoint: '',
            method: 'GET',
            token,
            errorMessages: {
                401: 'Token inválido ou expirado',
                500: 'Erro interno do servidor',
                default: 'Erro desconhecido'
            },
            parseJson: true
        });
    }

    /**
     * Obtém todos os posts do usuário autenticado.
     * @param {string} token - Token de autenticação.
     * @returns {Promise<{ok: false, error: string} | {ok: true, posts: object[]}>}
     */
    async fetchMyPosts(token) {
        return this.#request({
            endpoint: '/my-posts',
            method: 'GET',
            token,
            errorMessages: {
                401: 'Token inválido ou expirado',
                500: 'Erro interno do servidor',
                default: 'Erro desconhecido'
            },
            parseJson: true
        });
    }

    /**
     * Cria um novo post.
     * @param {string} token - Token de autenticação.
     * @param {string} content - Conteúdo do post.
     * @returns {Promise<{ok: false, error: string} | {ok: true, post: object}>}
     */
    async createPost(token, content) {
        return this.#request({
            endpoint: '',
            method: 'POST',
            token,
            body: { content },
            errorMessages: {
                401: 'Token inválido ou expirado',
                500: 'Erro interno do servidor',
                default: 'Erro desconhecido'
            },
            parseJson: true,
            responseKey: 'post'
        });
    }

    /**
     * Deleta um post pelo ID.
     * @param {string} token - Token de autenticação.
     * @param {string} postId - ID do post a ser deletado.
     * @returns {Promise<{ok: false, error: string} | {ok: true}>}
     */
    async deletePost(token, postId) {
        return this.#request({
            endpoint: `/${postId}`,
            method: 'DELETE',
            token,
            errorMessages: {
                401: 'Token inválido ou expirado',
                404: 'Não foi possível encontrar ou excluir o post',
                500: 'Erro interno do servidor',
                default: 'Erro desconhecido'
            }
        });
    }

    /**
     * Método privado para realizar requisições HTTP e tratar respostas e erros.
     * @private
     * @param {object} options - Opções da requisição.
     * @param {string} options.endpoint - Endpoint relativo à baseUrl.
     * @param {string} options.method - Método HTTP.
     * @param {string} options.token - Token de autenticação.
     * @param {object} [options.body] - Corpo da requisição (para POST).
     * @param {object} options.errorMessages - Mapeamento de códigos de status para mensagens de erro.
     * @param {boolean} [options.parseJson] - Se deve fazer o parse do JSON da resposta.
     * @param {string} [options.responseKey] - Chave do objeto de resposta para parse customizado.
     * @returns {Promise<object>} Resultado da requisição.
     */
    async #request({ endpoint, method, token, body, errorMessages, parseJson, responseKey }) {
        const headers = { 'Authorization': `Bearer ${token}` };
        if (body) headers['Content-Type'] = 'application/json';
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method,
            headers,
            ...(body && { body: JSON.stringify(body) })
        });

        if (!response.ok) {
            const error = errorMessages[response.status] || errorMessages.default || 'Erro desconhecido';
            return { ok: false, error };
        }

        const result = { ok: true };

        if (parseJson) {
            const data = await response.json();
            if (responseKey) {
                result[responseKey] = data;
            } else if (Array.isArray(data)) {
                result.posts = data;
            } else {
                Object.assign(result, data);
            }
        }
        return result;
    }
}
