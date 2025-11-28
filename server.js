import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const SAVE_DIR = path.join(__dirname, 'save');

app.use(cors());
app.use(express.json());

// Criar diretório save se não existir
async function ensureSaveDir() {
  try {
    await fs.access(SAVE_DIR);
  } catch {
    await fs.mkdir(SAVE_DIR, { recursive: true });
  }
}

// Endpoint para guardar dados
app.post('/api/save', async (req, res) => {
  try {
    const { username, data } = req.body;
    
    if (!username || !data) {
      return res.status(400).json({ error: 'Username e data são obrigatórios' });
    }

    await ensureSaveDir();
    
    const filePath = path.join(SAVE_DIR, `${username}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    
    res.json({ message: 'Dados guardados com sucesso!' });
  } catch (error) {
    console.error('Erro ao guardar:', error);
    res.status(500).json({ error: 'Erro ao guardar dados' });
  }
});

// Endpoint para carregar dados
app.get('/api/load/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({ error: 'Username é obrigatório' });
    }

    const filePath = path.join(SAVE_DIR, `${username}.json`);
    
    try {
      const data = await fs.readFile(filePath, 'utf8');
      res.json(JSON.parse(data));
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Nenhum dado guardado para este utilizador' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro ao carregar:', error);
    res.status(500).json({ error: 'Erro ao carregar dados' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
