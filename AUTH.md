# Configuracao NextAuth GitHub

## Variaveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Como obter credenciais GitHub OAuth

1. Acesse: https://github.com/settings/developers
2. Clique em "New OAuth App"
3. Preencha:
   - Application name: DevHub
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. Clique em "Register application"
5. Copie o Client ID e Client Secret

## Contexto de Autenticacao

O projeto utiliza `AuthContext` para gerenciar o estado de autenticacao:

```tsx
import { useAuth } from "./context/AuthContext";

function Component() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  // ...
}
```

### Propriedades disponiveis:

- `user`: Dados do usuario (name, email, image, github)
- `isAuthenticated`: Boolean indicando se esta autenticado
- `isLoading`: Boolean indicando carregamento
- `login()`: Inicia autenticacao com GitHub
- `logout()`: Encerra sessao

### Providers configurados:

- `SessionProvider` (NextAuth) envolve toda a aplicacao
- `AuthProvider` (customizado) gerencia estado local

Ambos estao configurados em `src/app/providers.tsx`
