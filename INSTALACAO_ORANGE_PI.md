# Instalação no Orange Pi Zero 2

## Passo 1: Verificar Apache e PHP

```bash
# Verificar se Apache está instalado e a correr
sudo systemctl status apache2

# Se não estiver a correr, iniciar:
sudo systemctl start apache2

# Verificar versão do PHP
php -v
```

## Passo 2: Habilitar mod_rewrite no Apache

```bash
# Habilitar o módulo
sudo a2enmod rewrite

# Reiniciar Apache
sudo systemctl restart apache2
```

## Passo 3: Configurar permissões de .htaccess

Editar o ficheiro de configuração do Apache:

```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```

Adicionar dentro de `<VirtualHost>`:

```apache
<Directory /var/www/html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Guardar (Ctrl+O, Enter) e sair (Ctrl+X).

Reiniciar Apache:
```bash
sudo systemctl restart apache2
```

## Passo 4: Build da Aplicação

No seu computador (não no Orange Pi):

```bash
npm run build
```

## Passo 5: Preparar Estrutura no Orange Pi

```bash
# Criar directório (se estiver em subpasta)
sudo mkdir -p /var/www/html/imo/renda-passiva-calc

# Dar permissões
sudo chown -R www-data:www-data /var/www/html/imo/renda-passiva-calc
sudo chmod -R 755 /var/www/html/imo/renda-passiva-calc
```

## Passo 6: Copiar Ficheiros

### Opção A: Via SCP (do seu computador)

```bash
# Copiar conteúdo da pasta dist/
scp -r dist/* usuario@ip-orange-pi:/tmp/renda-passiva-calc/

# Copiar .htaccess
scp .htaccess usuario@ip-orange-pi:/tmp/renda-passiva-calc/

# Copiar pasta api/
scp -r api/ usuario@ip-orange-pi:/tmp/renda-passiva-calc/

# No Orange Pi, mover para pasta final:
sudo mv /tmp/renda-passiva-calc/* /var/www/html/imo/renda-passiva-calc/
```

### Opção B: Via USB/Manual

1. Copie para USB:
   - Todo conteúdo de `dist/`
   - Ficheiro `.htaccess`
   - Pasta `api/`

2. No Orange Pi:
```bash
sudo cp -r /caminho/usb/* /var/www/html/imo/renda-passiva-calc/
```

## Passo 7: Ajustar Permissões Finais

```bash
# No Orange Pi
sudo chown -R www-data:www-data /var/www/html/imo/renda-passiva-calc
sudo chmod -R 755 /var/www/html/imo/renda-passiva-calc
sudo mkdir -p /var/www/html/imo/renda-passiva-calc/save
sudo chmod 777 /var/www/html/imo/renda-passiva-calc/save
```

## Passo 8: Testar

Aceder no browser:
```
https://househunter.pt/imo/renda-passiva-calc/
```

## Troubleshooting

### Erro 404 persistente

Verificar se mod_rewrite está ativo:
```bash
apache2ctl -M | grep rewrite
```

Deve mostrar: `rewrite_module (shared)`

### Erro 500

Ver logs de erro:
```bash
sudo tail -f /var/log/apache2/error.log
```

### .htaccess não funciona

Verificar AllowOverride:
```bash
sudo grep -r "AllowOverride" /etc/apache2/
```

Deve ter `AllowOverride All` para o directório.

### Verificar se ficheiros foram copiados corretamente

```bash
ls -la /var/www/html/imo/renda-passiva-calc/
```

Deve ver:
- index.html
- .htaccess
- pasta assets/
- pasta api/
- pasta save/ (será criada ao guardar dados)

## Notas Importantes

1. **NUNCA** executar `npm install` ou `npm run build` no Orange Pi Zero 2 - vai encravar!

2. **Workflow correto**:
   - Build no computador local: `npm run build`
   - Copiar apenas dist/, .htaccess e api/ para o servidor
   - Não copiar node_modules, package.json, src/, etc.

3. **Firewall**: Se não conseguir aceder, verificar firewall:
```bash
sudo ufw allow 80
sudo ufw allow 443
```

4. **IP Estático**: Considere dar IP fixo ao Orange Pi para facilitar acesso.

## Estrutura Final no Servidor

```
/var/www/html/imo/renda-passiva-calc/
├── index.html
├── .htaccess
├── assets/
│   └── (ficheiros JS e CSS compilados)
├── api/
│   ├── save.php
│   └── load.php
└── save/
    └── (ficheiros JSON dos utilizadores)
```
