import { useState } from 'react';
import { CapitalHumano } from '@/types/calculator';
import { formatCurrency } from '@/lib/format';
import { Briefcase, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CapitalHumanoTabProps {
  capitalHumano: CapitalHumano[];
  onAdd: (ch: Omit<CapitalHumano, 'id'>) => void;
  onRemove: (id: string) => void;
}

export function CapitalHumanoTab({ capitalHumano, onAdd, onRemove }: CapitalHumanoTabProps) {
  const [nome, setNome] = useState('');
  const [rendimentoLiquido, setRendimentoLiquido] = useState(0);

  const handleAdd = () => {
    if (!nome.trim()) {
      return;
    }
    onAdd({ nome, rendimentoLiquido });
    setNome('');
    setRendimentoLiquido(0);
  };

  const totalMensal = capitalHumano.reduce((acc, ch) => acc + ch.rendimentoLiquido, 0);
  const totalAnual = totalMensal * 12;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Add Form */}
      <div className="card-elevated p-5">
        <h3 className="section-title flex items-center gap-2 mb-4">
          <Plus className="w-5 h-5 text-primary" />
          Adicionar Capital Humano
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ch-nome">Trabalho / Empresa</Label>
            <Input
              id="ch-nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do trabalho ou empresa"
            />
          </div>
          <div>
            <Label htmlFor="ch-rendimento">Rendimento Líquido Mensal (€)</Label>
            <Input
              id="ch-rendimento"
              type="number"
              step="0.01"
              value={rendimentoLiquido}
              onChange={(e) => setRendimentoLiquido(Number(e.target.value))}
              placeholder="0.00"
            />
          </div>
        </div>
        <Button onClick={handleAdd} className="mt-4 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {/* List */}
      {capitalHumano.length > 0 && (
        <div className="card-elevated p-5">
          <h3 className="section-title flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            Meu Capital Humano ({capitalHumano.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capitalHumano.map((ch) => {
              const anual = ch.rendimentoLiquido * 12;
              return (
                <div key={ch.id} className="stat-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{ch.nome}</h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(ch.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rendimento Líquido Mensal:</span>
                      <span className="font-semibold text-success">{formatCurrency(ch.rendimentoLiquido)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rendimento Líquido Anual:</span>
                      <span className="font-semibold text-success">{formatCurrency(anual)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary */}
      {capitalHumano.length > 0 && (
        <div className="card-elevated p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h3 className="section-title mb-4">Total Capital Humano</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="stat-card">
              <p className="result-label">Total Mensal</p>
              <p className="result-value text-success">{formatCurrency(totalMensal)}</p>
            </div>
            <div className="stat-card">
              <p className="result-label">Total Anual</p>
              <p className="result-value text-success">{formatCurrency(totalAnual)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
