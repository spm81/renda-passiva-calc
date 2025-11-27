import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn, LogOut, User, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
      toast.error('Faça login primeiro');
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Por favor, faça autenticação no sistema primeiro.');
        return;
      }

      const { data, error } = await supabase.functions.invoke('save-data', {
        body: {
          username: currentUser,
          data: {
            imoveis,
            despesasExtras: despesas,
            investimentos
          }
        }
      });

      if (error) throw error;

      toast.success('Dados guardados no servidor!');
    } catch (error) {
      console.error('Erro ao guardar:', error);
      toast.error('Erro ao guardar dados no servidor');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadFromServer = async () => {
    if (!currentUser) {
      toast.error('Faça login primeiro');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Por favor, faça autenticação no sistema primeiro.');
        return;
      }

      const { data, error } = await supabase.functions.invoke('load-data', {
        body: { username: currentUser }
      });

      if (error) throw error;

      if (data && data.imoveis && data.despesasExtras && data.investimentos) {
        onDataLoaded(data);
        toast.success('Dados carregados com sucesso!');
      } else {
        toast.error('Nenhum dado guardado para este utilizador');
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
      toast.error('Erro ao carregar dados do servidor');
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
