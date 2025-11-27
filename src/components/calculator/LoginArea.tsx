import { useState } from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

interface LoginAreaProps {
  currentUser: string | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

export function LoginArea({ currentUser, onLogin, onLogout }: LoginAreaProps) {
  const [username, setUsername] = useState('');

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

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-secondary/50 rounded-xl mb-6">
      {currentUser ? (
        <>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <User className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">{currentUser}</span>
          </div>
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
