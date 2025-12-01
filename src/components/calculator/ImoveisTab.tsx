import { useState } from 'react';
import { Imovel, CalculatedImovel } from '@/types/calculator';
import { Plus, Trash2, Building2 } from 'lucide-react';
import { formatCurrency } from '@/lib/format';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ImoveisTabProps {
  imoveis: Imovel[];
  calculatedImoveis: CalculatedImovel[];
  onAdd: (imovel: Omit<Imovel, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Imovel>) => void;
  onRemove: (id: string) => void;
}

interface ImovelFormData {
  nome: string;
  valor: string;
  renda: string;
  irPercent: string;
  imi: string;
  condominio: string;
  seguro: string;
}

const defaultFormData: ImovelFormData = {
  nome: '',
  valor: '',
  renda: '',
  irPercent: '25',
  imi: '',
  condominio: '',
  seguro: '',
};

export function ImoveisTab({ imoveis, calculatedImoveis, onAdd, onUpdate, onRemove }: ImoveisTabProps) {
  const [formData, setFormData] = useState<ImovelFormData>(defaultFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome.trim()) return;

    onAdd({
      nome: formData.nome.trim(),
      valor: parseFloat(formData.valor) || 0,
      valorVenda: 0,
      renda: parseFloat(formData.renda) || 0,
      irPercent: parseFloat(formData.irPercent) || 25,
      imi: parseFloat(formData.imi) || 0,
      condominio: parseFloat(formData.condominio) || 0,
      seguro: parseFloat(formData.seguro) || 0,
    });

    setFormData(defaultFormData);
  };

  const handleFieldChange = (id: string, field: keyof Imovel, value: string) => {
    if (field === 'nome') {
      onUpdate(id, { [field]: value });
    } else {
      onUpdate(id, { [field]: parseFloat(value) || 0 });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Add Form */}
      <div className="card-elevated p-5 mb-6">
        <h3 className="section-title flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          Adicionar Imóvel
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="Ex: Apartamento T2"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Valor Compra (€)</label>
              <input
                type="number"
                className="input-field mt-1"
                placeholder="150000"
                min="0"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Renda Mensal (€)</label>
              <input
                type="number"
                className="input-field mt-1"
                placeholder="750"
                min="0"
                step="0.01"
                value={formData.renda}
                onChange={(e) => setFormData({ ...formData, renda: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Imposto (%)</label>
              <input
                type="number"
                className="input-field mt-1"
                placeholder="25"
                min="0"
                max="100"
                step="0.01"
                value={formData.irPercent}
                onChange={(e) => setFormData({ ...formData, irPercent: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">IMI Anual (€)</label>
              <input
                type="number"
                className="input-field mt-1"
                placeholder="300"
                min="0"
                step="0.01"
                value={formData.imi}
                onChange={(e) => setFormData({ ...formData, imi: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Condomínio (€)</label>
              <input
                type="number"
                className="input-field mt-1"
                placeholder="50"
                min="0"
                step="0.01"
                value={formData.condominio}
                onChange={(e) => setFormData({ ...formData, condominio: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Seguro (€)</label>
              <input
                type="number"
                className="input-field mt-1"
                placeholder="20"
                min="0"
                step="0.01"
                value={formData.seguro}
                onChange={(e) => setFormData({ ...formData, seguro: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Imoveis List */}
      <div className="card-elevated p-5">
        <h3 className="section-title flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Meus Imóveis ({imoveis.length})
        </h3>

        {imoveis.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum imóvel adicionado.</p>
            <p className="text-sm">Adicione o seu primeiro imóvel acima.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {calculatedImoveis.map((imovel) => (
              <div key={imovel.id} className="property-card">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Nome</label>
                    <input
                      type="text"
                      className="input-field mt-1"
                      value={imovel.nome}
                      onChange={(e) => handleFieldChange(imovel.id, 'nome', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Valor Compra (€)</label>
                    <input
                      type="number"
                      className="input-field mt-1"
                      step="0.01"
                      value={imovel.valor}
                      onChange={(e) => handleFieldChange(imovel.id, 'valor', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Renda Mensal (€)</label>
                    <input
                      type="number"
                      className="input-field mt-1"
                      step="0.01"
                      value={imovel.renda}
                      onChange={(e) => handleFieldChange(imovel.id, 'renda', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Imposto (%)</label>
                    <input
                      type="number"
                      className="input-field mt-1"
                      step="0.01"
                      value={imovel.irPercent}
                      onChange={(e) => handleFieldChange(imovel.id, 'irPercent', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">IMI Anual (€)</label>
                    <input
                      type="number"
                      className="input-field mt-1"
                      step="0.01"
                      value={imovel.imi}
                      onChange={(e) => handleFieldChange(imovel.id, 'imi', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Condomínio (€)</label>
                    <input
                      type="number"
                      className="input-field mt-1"
                      step="0.01"
                      value={imovel.condominio}
                      onChange={(e) => handleFieldChange(imovel.id, 'condominio', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Seguro (€)</label>
                    <input
                      type="number"
                      className="input-field mt-1"
                      step="0.01"
                      value={imovel.seguro}
                      onChange={(e) => handleFieldChange(imovel.id, 'seguro', e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => onRemove(imovel.id)}
                      className="btn-danger w-full flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remover
                    </button>
                  </div>
                </div>

                {/* Calculated Values */}
                <div className="divider" />
                
                {/* Detalhes Financeiros */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="stat-card">
                    <p className="result-label">Renda</p>
                    <p className="result-value text-foreground">{formatCurrency(imovel.renda)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(imovel.rendaAnual)} / ano</p>
                  </div>
                  <div className="stat-card">
                    <p className="result-label">Imposto</p>
                    <p className="result-value text-destructive">-{formatCurrency(imovel.irValor)}</p>
                    <p className="text-xs text-muted-foreground">-{formatCurrency(imovel.impostoAnual)} / ano</p>
                  </div>
                  <div className="stat-card">
                    <p className="result-label">Despesas</p>
                    <p className="result-value text-destructive">-{formatCurrency(imovel.despesasMensais)}</p>
                    <p className="text-xs text-muted-foreground">-{formatCurrency(imovel.despesasAnuais)} / ano</p>
                  </div>
                  <div className="stat-card">
                    <p className="result-label">Líquido</p>
                    <p className="result-value text-success">{formatCurrency(imovel.rendaLiquida)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(imovel.rendaLiquidaAnual)} / ano</p>
                  </div>
                  <div className="stat-card">
                    <p className="result-label">Líquido após Despesas</p>
                    <p className="result-value text-success">{formatCurrency(imovel.rendaLiquidaAposDespesas)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(imovel.rendaLiquidaAnualAposDespesas)} / ano</p>
                  </div>
                </div>

                {/* Gráfico de Pizza */}
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Imposto', value: imovel.irValor },
                          { name: 'Despesas', value: imovel.despesasMensais },
                          { name: 'Líquido', value: imovel.rendaLiquidaAposDespesas },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="hsl(var(--destructive))" />
                        <Cell fill="hsl(var(--warning))" />
                        <Cell fill="hsl(var(--success))" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
