# Mini Twitter

Mini Twitter é uma aplicação web desenvolvida com HTML, CSS e JavaScript puro (vanilla), que simula as principais funcionalidades do Twitter. O objetivo é permitir que usuários criem contas, façam login, publiquem postagens curtas e visualizem um feed, utilizando uma API REST pública para autenticação e gerenciamento dos dados.

## Funcionalidades
- Cadastro e login de usuários
- Publicação de postagens (limite de 280 caracteres)
- Visualização do feed de postagens
- Visualização e edição do perfil do usuário
- Persistência de autenticação via localStorage
- Interface responsiva e amigável

## Tecnologias Utilizadas
- HTML5
- CSS3 (Flexbox e responsividade)
- JavaScript ES6+ (sem frameworks)
- Consumo de API REST externa

## Como rodar o projeto localmente

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Edge, etc.)
- Não é necessário instalar Node.js ou servidores locais

### Passos
1. **Clone ou baixe este repositório:**
   - Via terminal:
     ```bash
     git clone https://github.com/seu-usuario/mini-twitter.git
     ```
   - Ou faça o download do ZIP pelo GitHub e extraia os arquivos.

2. **Acesse a pasta do projeto:**
   ```bash
   cd mini-twitter
   ```

3. **Abra o arquivo `index.html` no navegador:**
   - **Importante:** Abrir o arquivo diretamente pode causar erros de CORS ao consumir a API.
   - Recomenda-se rodar um servidor local, como:
     - **Live Server** (extensão do VSCode): Clique com o botão direito no `index.html` e selecione "Open with Live Server".
     - **Servidor Apache/Nginx**: Coloque os arquivos em uma pasta do servidor e acesse via `http://localhost`.
     - **Python HTTP Server**: No terminal, execute `python -m http.server` e acesse `http://localhost:8000`.

> **Observação:**
> O projeto utiliza uma API pública hospedada em [https://mini-twitter-api-vy9q.onrender.com/](https://mini-twitter-api-vy9q.onrender.com/). Não é necessário rodar backend localmente.

## Estrutura do Projeto
```
mini-twitter/
├── index.html
├── css/
│   ├── style.css
│   └── reset.css
├── js/
│   ├── controllers/
│   ├── views/
│   └── repositories/
└── assets/
    └── images/
```

## Dicas
- Para melhor experiência, utilize o projeto em tela cheia ou em dispositivos móveis.
- Caso a API esteja fora do ar, tente novamente mais tarde.

---
Desenvolvido para fins educacionais.
