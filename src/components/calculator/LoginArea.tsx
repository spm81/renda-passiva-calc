import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User, Save, Download } from 'lucide-react';
import { toast } from 'sonner';


interface LoginAreaProps {
  currentUser: string | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
  imoveis: any[];
  despesas: any[];
  investimentos: any[];
  onDataLoaded: (data: any) => void;
}

export function LoginArea({ currentUser, onLogin, onLogout, imoveis, despesas, investimentos, onDataLoaded }: LoginAreaProps) {
  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    const trimmed = username.trim();
    if (!trimmed) {
      toast.error('Por favor, insira um nome de utilizador.');
      return;
    }
    onLogin(trimmed);
    setUsername('');
    toast.success(`Bem-vindo, ${trimmed}!`);
  };

  const handleLogout = () => {
    onLogout();
    toast.info('Sessão encerrada.');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleSaveToServer = async () => {
    if (!currentUser) {
      toast.error('Faça login primeiro!');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:3001/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser,
          data: {
            imoveis,
            despesasExtras: despesas,
            investimentos
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao guardar');
      }
      
      toast.success('Dados guardados no disco local com sucesso!');
    } catch (error: any) {
      console.error('Erro ao guardar:', error);
      toast.error('Erro ao guardar: Certifique-se que o servidor está a correr (node server.js)');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadFromServer = async () => {
    if (!currentUser) {
      toast.error('Faça login primeiro!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/load/${currentUser}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao carregar');
      }
      
      const data = await response.json();
      if (data) {
        onDataLoaded(data);
        toast.success('Dados carregados do disco local com sucesso!');
      }
    } catch (error: any) {
      console.error('Erro ao carregar:', error);
      toast.error('Erro ao carregar: Certifique-se que o servidor está a correr (node server.js)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-secondary/50 rounded-xl mb-6">
      {currentUser ? (
        <>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <User className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{currentUser}</span>
          </div>
          <Button
            onClick={handleSaveToServer}
            variant="default"
            size="sm"
            className="gap-2"
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'A guardar...' : 'Guardar no Servidor'}
          </Button>
          <Button
            onClick={handleLoadFromServer}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isLoading}
          >
            <Download className="w-4 h-4" />
            {isLoading ? 'A carregar...' : 'Carregar do Servidor'}
          </Button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              className="input-field w-48"
              placeholder="Nome de utilizador"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            onClick={handleLogin}
            className="btn-primary flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </button>
        </>
      )}
    </div>
  );
}
