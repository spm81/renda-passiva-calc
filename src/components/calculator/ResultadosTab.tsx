import { Resultados } from '@/types/calculator';
import { StatCard } from './StatCard';
import { formatCurrency } from '@/lib/format';
import { 
  Wallet, 
  Receipt, 
  Percent, 
  TrendingUp, 
  Calculator,
  PiggyBank 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface ResultadosTabProps {
  resultados: Resultados;
}

export function ResultadosTab({ resultados }: ResultadosTabProps) {
  const chartData = [
    {
      name: 'Rendas',
      mensal: resultados.totalRendaMensal,
      anual: resultados.totalRendaAnual,
    },
    {
      name: 'Impostos',
      mensal: resultados.totalImpostoMensal,
      anual: resultados.totalImpostoAnual,
    },
    {
      name: 'Despesas Fixas',
      mensal: resultados.totalDespesasMensal,
      anual: resultados.totalDespesasAnuais,
    },
    {
      name: 'Despesas Extras',
      mensal: resultados.despesasExtrasMensal,
      anual: resultados.despesasExtrasAnual,
    },
    {
      name: 'Investimentos',
      mensal: resultados.investimentosMensal,
      anual: resultados.investimentosAnual,
    },
    {
      name: 'Renda Final',
      mensal: resultados.rendaComInvestimentosMensal,
      anual: resultados.rendaComInvestimentosAnual,
    },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Summary Section */}
      <div className="card-elevated p-5">
        <h3 className="section-title flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Resumo dos Imóveis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Rendas Mensais (Total)"
            value={formatCurrency(resultados.totalRendaMensal)}
            subValue={`${formatCurrency(resultados.totalRendaAnual)}/ano`}
            icon={<Wallet className="w-5 h-5" />}
          />
          <StatCard
            label="Impostos Mensais"
            value={formatCurrency(resultados.totalImpostoMensal)}
            subValue={`${formatCurrency(resultados.totalImpostoAnual)}/ano`}
            icon={<Percent className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            label="Despesas Mensais (Fixas)"
            value={formatCurrency(resultados.totalDespesasMensal)}
            subValue={`${formatCurrency(resultados.totalDespesasAnuais)}/ano`}
            icon={<Receipt className="w-5 h-5" />}
            variant="warning"
          />
          <StatCard
            label="Renda Líquida Mensal"
            value={formatCurrency(resultados.totalRendaLiquidaMensal)}
            subValue={`${formatCurrency(resultados.totalRendaLiquidaAnual)}/ano`}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="success"
          />
          <StatCard
            label="Após Despesas Fixas dos Imóveis"
            value={formatCurrency(resultados.rendaLiquidaAposDespesasMensal)}
            subValue={`${formatCurrency(resultados.rendaLiquidaAposDespesasAnual)}/ano`}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="success"
          />
        </div>
      </div>

      {/* Final Results */}
      <div className="card-elevated p-5">
        <h3 className="section-title flex items-center gap-2">
          <PiggyBank className="w-5 h-5 text-primary" />
          Renda Final (Imóveis + Investimentos - Despesas Extras)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Renda Imóveis"
            value={formatCurrency(resultados.rendaFinalMensal)}
            subValue={`${formatCurrency(resultados.rendaFinalAnual)}/ano`}
            variant="success"
          />
          <StatCard
            label="Investimentos"
            value={formatCurrency(resultados.investimentosMensal)}
            subValue={`${formatCurrency(resultados.investimentosAnual)}/ano`}
            variant="success"
          />
          <div className="stat-card sm:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <p className="result-label">Renda Total Final</p>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(resultados.rendaComInvestimentosMensal)}
            </p>
            <p className="text-lg text-muted-foreground mt-1">
              {formatCurrency(resultados.rendaComInvestimentosAnual)}/ano
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card-elevated p-5">
        <h3 className="section-title">Visão Geral (Mensal)</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="mensal" name="Mensal (€)" fill="hsl(207, 90%, 54%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
