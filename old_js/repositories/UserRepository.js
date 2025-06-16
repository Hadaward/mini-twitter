export class UserRepository {
    /**
     * @type {string}
     */
    baseUrl;

    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getProfile(token) {
        try {
            const res = await fetch(`${this.baseUrl}/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) return { ok: false, error: 'Erro ao buscar perfil.' };
            const user = await res.json();
            return { ok: true, user };
        } catch {
            return { ok: false, error: 'Erro de conexão.' };
        }
    }

    async updateProfile(token, username, email) {
        try {
            const res = await fetch(`${this.baseUrl}/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim()
                })
            });

            if (!res.ok) {
                if (res.status === 400) {
                    return { ok: false, error: 'Nome de usuário ou email já está em uso.' };
                } else if (res.status === 401) {
                    return { ok: false, error: 'Não autorizado.' };
                } else if (res.status === 404) {
                    return { ok: false, error: 'Usuário não encontrado.' };
                } else {
                    return { ok: false, error: 'Erro ao atualizar perfil.' };
                }
            }

            const json = await res.json();
            return { ok: true, user: json.user };
        } catch {
            return { ok: false, error: 'Erro de conexão.' };
        }
    }
}
