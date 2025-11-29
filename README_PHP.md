# Instalação no Servidor PHP

Este projeto pode ser usado com PHP em vez de Node.js.

## Estrutura de Pastas

Copie os seguintes ficheiros para a sua pasta `www`:

```
/var/www/html/renda-passiva-calc/
├── api/
│   ├── save.php
│   └── load.php
├── save/           (será criada automaticamente)
└── ... (restantes ficheiros da aplicação)
```

## Permissões

Certifique-se que a pasta tem permissões corretas:

```bash
chmod 755 /var/www/html/renda-passiva-calc/api/
chmod 755 /var/www/html/renda-passiva-calc/
```

A pasta `save/` será criada automaticamente pelo PHP quando guardar dados.

## Como Funciona

- **Guardar dados**: POST para `/api/save.php`
- **Carregar dados**: GET de `/api/load.php?username=<nome>`
- **Armazenamento**: Os dados são guardados em `save/<username>.json`

## Notas

- Os dados são armazenados localmente no servidor
- Cada utilizador tem o seu próprio ficheiro JSON
- Não é necessário Node.js, apenas PHP
