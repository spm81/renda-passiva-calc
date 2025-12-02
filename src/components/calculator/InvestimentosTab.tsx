import { useState } from 'react';
import { Investimento } from '@/types/calculator';
import { Plus, Trash2, TrendingUp, Pencil } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/format';

interface InvestimentosTabProps {
  investimentos: Investimento[];
  onAdd: (investimento: Omit<Investimento, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Investimento>) => void;
  onRemove: (id: string) => void;
}

export function InvestimentosTab({ investimentos, onAdd, onUpdate, onRemove }: InvestimentosTabProps) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [rendimento, setRendimento] = useState('');
  const [imposto, setImposto] = useState('28');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!nome.trim() || !valor) return;

    if (editingId) {
      onUpdate(editingId, {
        nome: nome.trim(),
        valor: parseFloat(valor) || 0,
        rendimentoBruto: parseFloat(rendimento) || 0,
        impostoPercent: parseFloat(imposto) || 28,
      });
      setEditingId(null);
    } else {
      onAdd({
        nome: nome.trim(),
        valor: parseFloat(valor) || 0,
        rendimentoBruto: parseFloat(rendimento) || 0,
        impostoPercent: parseFloat(imposto) || 28,
      });
    }

    setNome('');
    setValor('');
    setRendimento('');
    setImposto('28');
  };

  const handleEdit = (inv: Investimento) => {
    setEditingId(inv.id);
    setNome(inv.nome);
    setValor(inv.valor.toString());
    setRendimento(inv.rendimentoBruto.toString());
    setImposto(inv.impostoPercent.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNome('');
    setValor('');
    setRendimento('');
    setImposto('28');
  };

  const calculateReturns = (inv: Investimento) => {
    const brutoAnual = inv.valor * (inv.rendimentoBruto / 100);
    const impostoAnual = brutoAnual * (inv.impostoPercent / 100);
    const liquidoAnual = brutoAnual - impostoAnual;
    const liquidoMensal = liquidoAnual / 12;
    return { brutoAnual, impostoAnual, liquidoAnual, liquidoMensal };
  };

  const totals = investimentos.reduce(
    (acc, inv) => {
      const calc = calculateReturns(inv);
      return {
        valor: acc.valor + inv.valor,
        brutoAnual: acc.brutoAnual + calc.brutoAnual,
        liquidoAnual: acc.liquidoAnual + calc.liquidoAnual,
        liquidoMensal: acc.liquidoMensal + calc.liquidoMensal,
      };
    },
    { valor: 0, brutoAnual: 0, liquidoAnual: 0, liquidoMensal: 0 }
  );

  return (
    <div className="animate-fade-in">
      {/* Add Form */}
      <div className="card-elevated p-5 mb-6">
        <h3 className="section-title flex items-center gap-2">
          {editingId ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
          {editingId ? 'Editar Investimento' : 'Adicionar Investimento'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Nome</label>
            <input
              type="text"
              className="input-field mt-1"
              placeholder="Ex: ETF MSCI World"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Valor (€)</label>
            <input
              type="number"
              className="input-field mt-1"
              placeholder="10000"
              min="0"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Rendimento (%/ano)</label>
            <input
              type="number"
              className="input-field mt-1"
              placeholder="7"
              min="0"
              step="0.1"
              value={rendimento}
              onChange={(e) => setRendimento(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Imposto (%)</label>
            <input
              type="number"
              className="input-field mt-1"
              placeholder="28"
              min="0"
              max="100"
              step="0.01"
              value={imposto}
              onChange={(e) => setImposto(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
            {editingId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {editingId ? 'Atualizar Investimento' : 'Adicionar Investimento'}
          </button>
          {editingId && (
            <button onClick={handleCancelEdit} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Investimentos List */}
      <div className="card-elevated p-5">
        <h3 className="section-title flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Meus Investimentos ({investimentos.length})
        </h3>

        {investimentos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum investimento adicionado.</p>
            <p className="text-sm">Adicione investimentos para calcular rendimentos.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {investimentos.map((inv) => {
              const calc = calculateReturns(inv);
              return (
                <div key={inv.id} className="property-card">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{inv.nome}</h4>
                      <p className="text-muted-foreground">
                        Capital: {formatCurrency(inv.valor)} • Rendimento: {formatPercent(inv.rendimentoBruto)} • Imposto: {formatPercent(inv.impostoPercent)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(inv)} className="btn-secondary">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onRemove(inv.id)} className="btn-danger">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Rendimento Bruto/Ano</p>
                      <p className="font-semibold">{formatCurrency(calc.brutoAnual)}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Imposto/Ano</p>
                      <p className="font-semibold text-destructive">-{formatCurrency(calc.impostoAnual)}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Líquido/Ano</p>
                      <p className="font-semibold text-success">{formatCurrency(calc.liquidoAnual)}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Líquido/Mês</p>
                      <p className="font-semibold text-success">{formatCurrency(calc.liquidoMensal)}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Totals */}
            <div className="divider" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="stat-card">
                <p className="text-sm text-muted-foreground">Capital Total</p>
                <p className="text-xl font-bold">{formatCurrency(totals.valor)}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-muted-foreground">Rend. Bruto/Ano</p>
                <p className="text-xl font-bold">{formatCurrency(totals.brutoAnual)}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-muted-foreground">Líquido/Ano</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totals.liquidoAnual)}</p>
              </div>
              <div className="stat-card">
                <p className="text-sm text-muted-foreground">Líquido/Mês</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totals.liquidoMensal)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
