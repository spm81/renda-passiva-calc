import { useState } from 'react';
import { DespesaExtra } from '@/types/calculator';
import { Plus, Trash2, Receipt } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DespesasTabProps {
  despesas: DespesaExtra[];
  onAdd: (despesa: Omit<DespesaExtra, 'id'>) => void;
  onRemove: (id: string) => void;
}

const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#e67e22'];

export function DespesasTab({ despesas, onAdd, onRemove }: DespesasTabProps) {
  const [nome, setNome] = useState('');
  const [valorMensal, setValorMensal] = useState('');
  const [valorAnual, setValorAnual] = useState('');

  const handleAddMensal = () => {
    if (!nome.trim() || !valorMensal) return;
    const val = parseFloat(valorMensal);
    if (val <= 0) return;

    onAdd({
      nome: nome.trim(),
      valorMensal: val,
      valorAnual: val * 12,
    });

    setNome('');
    setValorMensal('');
  };

  const handleAddAnual = () => {
    if (!nome.trim() || !valorAnual) return;
    const val = parseFloat(valorAnual);
    if (val <= 0) return;

    onAdd({
      nome: nome.trim(),
      valorMensal: val / 12,
      valorAnual: val,
    });

    setNome('');
    setValorAnual('');
  };

  const totalMensal = despesas.reduce((acc, d) => acc + d.valorMensal, 0);
  const totalAnual = despesas.reduce((acc, d) => acc + d.valorAnual, 0);

  const chartData = despesas.map((d) => ({
    name: d.nome,
    value: d.valorMensal,
  }));

  return (
    <div className="animate-fade-in">
      {/* Add Form */}
      <div className="card-elevated p-5 mb-6">
        <h3 className="section-title flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Adicionar Despesa Extra
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Nome da Despesa</label>
            <input
              type="text"
              className="input-field mt-1"
              placeholder="Ex: Internet, Alimentação..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Valor Mensal (€)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                className="input-field"
                placeholder="100"
                min="0"
                value={valorMensal}
                onChange={(e) => setValorMensal(e.target.value)}
              />
              <button onClick={handleAddMensal} className="btn-primary whitespace-nowrap">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Valor Anual (€)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                className="input-field"
                placeholder="1200"
                min="0"
                value={valorAnual}
                onChange={(e) => setValorAnual(e.target.value)}
              />
              <button onClick={handleAddAnual} className="btn-primary whitespace-nowrap">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Despesas List */}
        <div className="card-elevated p-5">
          <h3 className="section-title flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Despesas Extras ({despesas.length})
          </h3>

          {despesas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma despesa extra adicionada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {despesas.map((despesa) => (
                <div
                  key={despesa.id}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{despesa.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(despesa.valorMensal)}/mês • {formatCurrency(despesa.valorAnual)}/ano
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(despesa.id)}
                    className="btn-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="divider" />
              <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                <span className="font-semibold">Total</span>
                <div className="text-right">
                  <p className="font-bold text-lg">{formatCurrency(totalMensal)}/mês</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(totalAnual)}/ano</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="card-elevated p-5">
          <h3 className="section-title">Distribuição das Despesas</h3>
          {despesas.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Adicione despesas para ver o gráfico.</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
