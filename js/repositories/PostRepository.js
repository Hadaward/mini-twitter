export class PostRepository {
    /**
     * @type {string}
     */
    baseUrl;

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Obtém todos os posts publicados.
     * @param {string} token 
     * @return {Promise<{ok: false, error: string} | {ok: true, posts: object[]}>}
     */
    async fetchAllPosts(token) {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const result = {
                ok: false
            };

            if (response.status === 401) {
                result.error = 'Token inválido ou expirado';
            } else if (response.status === 500) {
                result.error = 'Erro interno do servidor';
            } else {
                result.error = 'Erro desconhecido';
            }

            return result;
        }

        return {
            ok: true,
            posts: await response.json(),
            size: response.headers.get('Content-Length')
        };
    }

    async fetchAllPostsResponseSize(token) {
        const response = await fetch(this.baseUrl, {
            method: 'HEAD',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const result = {
                ok: false
            };

            if (response.status === 401) {
                result.error = 'Token inválido ou expirado';
            } else if (response.status === 500) {
                result.error = 'Erro interno do servidor';
            } else {
                result.error = 'Erro desconhecido';
            }

            return result;
        }

        return {
            ok: true,
            size: response.headers.get('Content-Length'),
        };
    }

    async fetchAllPostsResponseSize(token) {
        const response = await fetch(this.baseUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const result = {
                ok: false
            };

            if (response.status === 401) {
                result.error = 'Token inválido ou expirado';
            } else if (response.status === 500) {
                result.error = 'Erro interno do servidor';
            } else {
                result.error = 'Erro desconhecido';
            }

            return result;
        }

        return {
            ok: true,
            posts: await response.json(),
            size: response.headers.get('Content-Length')
        };
    }

    async createPost(token, content) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const result = {
                ok: false
            };

            if (response.status === 401) {
                result.error = 'Token inválido ou expirado';
            } else if (response.status === 500) {
                result.error = 'Erro interno do servidor';
            } else {
                result.error = 'Erro desconhecido';
            }

            return result;
        }

        return {
            ok: true,
            post: await response.json()
        };
    }

    async deletePost(token, postId) {
        const response = await fetch(`${this.baseUrl}/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const result = {
                ok: false
            };

            if (response.status === 401) {
                result.error = 'Token inválido ou expirado';
            } else if (response.status === 404) {
                result.error = 'Não foi possível encontrar ou excluir o post';
            } else if (response.status === 500) {
                result.error = 'Erro interno do servidor';
            } else {
                result.error = 'Erro desconhecido';
            }

            return result;
        }

        return { ok: true };
    }
}