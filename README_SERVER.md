# Servidor Backend Local

Este projeto inclui um servidor Node.js que grava dados localmente no disco do seu servidor Linux.

## Como Iniciar o Servidor

1. Certifique-se de que todas as dependências estão instaladas:
```bash
npm install
```

2. Inicie o servidor backend:
```bash
node server.js
```

O servidor irá rodar em `http://localhost:3001`

## Estrutura de Dados

Os dados são guardados na pasta `save/` na raiz do projeto, com um arquivo JSON por utilizador:
- `save/username.json`

## Endpoints

- `POST /api/save` - Guarda dados do utilizador
- `GET /api/load/:username` - Carrega dados do utilizador

## Notas Importantes

- O servidor deve estar rodando para que as funcionalidades de "Guardar no Servidor" e "Carregar do Servidor" funcionem
- Os dados são armazenados localmente no servidor Linux, não em nuvem
- A pasta `save/` será criada automaticamente se não existir
