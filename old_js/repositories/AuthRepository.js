export class AuthRepository {
    /**
     * @type {string}
     */
    baseUrl;

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Realiza o login de um usuário.
     * @param {string} email - O email do usuário.
     * @param {string} password - A senha do usuário.
     * @return {Promise<{ok: false, error: string} | {ok: true, user: object, token: string}>}
     */
    async login(email, password) {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const result = {
                ok: false
            };

            if (response.status === 401) {
                result.error = 'Email ou senha inválidos';
            } else if (response.status === 500) {
                result.error = 'Erro interno do servidor';
            } else {
                result.error = 'Erro desconhecido';
            }

            return result;
        }

        const data = await response.json();

        return {
            ok: true,
            user: data.user,
            token: data.token
        }
    }

    /**
     * Registra um novo usuário.
     * @param {string} username - O nome de usuário do novo usuário.
     * @param {string} email - O email do novo usuário.
     * @param {string} password - A senha do novo usuário.
     * @return {Promise<{ok: false, error: string} | {ok: true, user: object, token: string}>}
     */
    async register(username, email, password) {
        const response = await fetch(`${this.baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        if (!response.ok) {
            const result = {
                ok: false
            };

            if (response.status === 400) {
                result.error = 'Usuario ou email já existe';
            } else if (response.status === 500) {
                result.error = 'Erro interno do servidor';
            } else {
                result.error = 'Erro desconhecido';
            }

            return result;
        }

        const data = await response.json();

        return {
            ok: true,
            user: data.user,
            token: data.token
        };
    }
}