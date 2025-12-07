import { forwardRef } from 'react';
import { CapitalHumano, CalculatedImovel, DespesaExtra, Investimento, Resultados } from '@/types/calculator';
import { formatCurrency } from '@/lib/format';

interface PrintableReportProps {
  currentUser: string | null;
  capitalHumano: CapitalHumano[];
  calculatedImoveis: CalculatedImovel[];
  despesas: DespesaExtra[];
  investimentos: Investimento[];
  resultados: Resultados;
}

export const PrintableReport = forwardRef<HTMLDivElement, PrintableReportProps>(({
  currentUser,
  capitalHumano,
  calculatedImoveis,
  despesas,
  investimentos,
  resultados,
}, ref) => {
  const totalCapitalHumanoMensal = capitalHumano.reduce((sum, ch) => sum + ch.rendimentoLiquido, 0);
  const totalCapitalHumanoAnual = totalCapitalHumanoMensal * 12;

  const totalDespesasMensal = despesas.reduce((sum, d) => sum + d.valorMensal, 0);
  const totalDespesasAnual = despesas.reduce((sum, d) => sum + d.valorAnual, 0);

  const calcularRetornoInvestimento = (inv: Investimento) => {
    const taxa = inv.rendimentoBruto / 100;
    const impostoRate = inv.impostoPercent / 100;
    
    if (inv.tipoJuros === 'composto' && inv.diasCapitalizacao) {
      const n = 365 / inv.diasCapitalizacao;
      const montanteFinal = inv.valor * Math.pow(1 + taxa / n, n);
      const lucroAnualBruto = montanteFinal - inv.valor;
      const impostoAnual = lucroAnualBruto * impostoRate;
      const lucroAnualLiquido = lucroAnualBruto - impostoAnual;
      return { mensal: lucroAnualLiquido / 12, anual: lucroAnualLiquido };
    } else {
      const lucroAnualBruto = inv.valor * taxa;
      const impostoAnual = lucroAnualBruto * impostoRate;
      const lucroAnualLiquido = lucroAnualBruto - impostoAnual;
      return { mensal: lucroAnualLiquido / 12, anual: lucroAnualLiquido };
    }
  };

  return (
    <div ref={ref} id="printable-report" className="print-report hidden print:block p-8 bg-white text-black">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-4 print-section">
        <h1 className="text-2xl font-bold">Relatório de Renda Passiva</h1>
        {currentUser && <p className="text-gray-600">Utilizador: {currentUser}</p>}
        <p className="text-gray-500 text-sm">Gerado em: {new Date().toLocaleDateString('pt-PT')}</p>
      </div>

      {/* Capital Humano */}
      <section className="mb-6 print-section">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">1. Capital Humano</h2>
        {capitalHumano.length === 0 ? (
          <p className="text-gray-500 italic">Sem registos</p>
        ) : (
          <>
            <table className="w-full text-sm mb-2">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Trabalho/Empresa</th>
                  <th className="text-right py-1">Mensal</th>
                  <th className="text-right py-1">Anual</th>
                </tr>
              </thead>
              <tbody>
                {capitalHumano.map((ch) => (
                  <tr key={ch.id} className="border-b border-gray-200">
                    <td className="py-1">{ch.nome}</td>
                    <td className="text-right">{formatCurrency(ch.rendimentoLiquido)}</td>
                    <td className="text-right">{formatCurrency(ch.rendimentoLiquido * 12)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-semibold">
              Total: {formatCurrency(totalCapitalHumanoMensal)}/mês | {formatCurrency(totalCapitalHumanoAnual)}/ano
            </div>
          </>
        )}
      </section>

      {/* Imóveis */}
      <section className="mb-6 print-section">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">2. Imóveis</h2>
        {calculatedImoveis.length === 0 ? (
          <p className="text-gray-500 italic">Sem registos</p>
        ) : (
          <>
            {calculatedImoveis.map((imovel) => (
              <div key={imovel.id} className="mb-4 p-3 border border-gray-200 rounded print-section">
                <h3 className="font-semibold mb-2">{imovel.nome}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Renda: {formatCurrency(imovel.renda)}/mês</div>
                  <div>Renda Anual: {formatCurrency(imovel.rendaAnual)}</div>
                  <div>Imposto: {formatCurrency(imovel.irValor)}/mês</div>
                  <div>Imposto Anual: {formatCurrency(imovel.impostoAnual)}</div>
                  <div>IMI Mensal: {formatCurrency(imovel.imiMensal)}</div>
                  <div>IMI Anual: {formatCurrency(imovel.imi)}</div>
                  <div>Despesas: {formatCurrency(imovel.despesasMensais)}/mês</div>
                  <div>Despesas Anuais: {formatCurrency(imovel.despesasAnuais)}</div>
                  <div className="font-semibold">Líquido: {formatCurrency(imovel.rendaLiquida)}/mês</div>
                  <div className="font-semibold">Líquido Anual: {formatCurrency(imovel.rendaLiquidaAnual)}</div>
                  <div className="font-semibold text-green-700">Após Despesas: {formatCurrency(imovel.rendaLiquidaAposDespesas)}/mês</div>
                  <div className="font-semibold text-green-700">Após Despesas Anual: {formatCurrency(imovel.rendaLiquidaAnualAposDespesas)}</div>
                </div>
              </div>
            ))}
            <div className="text-right font-semibold mt-2">
              Total Líquido: {formatCurrency(resultados.rendaLiquidaAposDespesasMensal)}/mês | {formatCurrency(resultados.rendaLiquidaAposDespesasAnual)}/ano
            </div>
          </>
        )}
      </section>

      {/* Despesas Extras */}
      <section className="mb-6 print-section">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">3. Despesas Extras</h2>
        {despesas.length === 0 ? (
          <p className="text-gray-500 italic">Sem registos</p>
        ) : (
          <>
            <table className="w-full text-sm mb-2">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Descrição</th>
                  <th className="text-right py-1">Mensal</th>
                  <th className="text-right py-1">Anual</th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((d) => (
                  <tr key={d.id} className="border-b border-gray-200">
                    <td className="py-1">{d.nome}</td>
                    <td className="text-right">{formatCurrency(d.valorMensal)}</td>
                    <td className="text-right">{formatCurrency(d.valorAnual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right font-semibold text-red-600">
              Total: -{formatCurrency(totalDespesasMensal)}/mês | -{formatCurrency(totalDespesasAnual)}/ano
            </div>
          </>
        )}
      </section>

      {/* Investimentos */}
      <section className="mb-6 print-section">
        <h2 className="text-lg font-bold border-b border-gray-300 pb-2 mb-3">4. Investimentos</h2>
        {investimentos.length === 0 ? (
          <p className="text-gray-500 italic">Sem registos</p>
        ) : (
          <>
            {investimentos.map((inv) => {
              const retorno = calcularRetornoInvestimento(inv);
              return (
                <div key={inv.id} className="mb-3 p-3 border border-gray-200 rounded print-section">
                  <h3 className="font-semibold">{inv.nome}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                    <div>Capital: {formatCurrency(inv.valor)}</div>
                    <div>Rendimento: {inv.rendimentoBruto}%/ano {inv.tipoJuros === 'composto' ? `(Composto - ${inv.diasCapitalizacao} dias)` : '(Nominal)'}</div>
                    <div>Imposto: {inv.impostoPercent}%</div>
                    <div className="font-semibold text-green-700">Retorno Líquido: {formatCurrency(retorno.mensal)}/mês | {formatCurrency(retorno.anual)}/ano</div>
                  </div>
                </div>
              );
            })}
            <div className="text-right font-semibold">
              Total Retorno: {formatCurrency(resultados.investimentosMensal)}/mês | {formatCurrency(resultados.investimentosAnual)}/ano
            </div>
          </>
        )}
      </section>

      {/* Resumo Final */}
      <section className="mt-8 p-4 border-2 border-gray-400 rounded bg-gray-50 print-section">
        <h2 className="text-xl font-bold mb-4 text-center">Resumo Final</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Capital Humano:</span>
              <span className="font-semibold">{formatCurrency(resultados.capitalHumanoMensal)}/mês</span>
            </div>
            <div className="flex justify-between">
              <span>Imóveis (líquido):</span>
              <span className="font-semibold">{formatCurrency(resultados.rendaLiquidaAposDespesasMensal)}/mês</span>
            </div>
            <div className="flex justify-between">
              <span>Investimentos:</span>
              <span className="font-semibold">{formatCurrency(resultados.investimentosMensal)}/mês</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Despesas Extras:</span>
              <span className="font-semibold">-{formatCurrency(resultados.despesasExtrasMensal)}/mês</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold text-green-700">
              <span>Renda Final:</span>
              <span>{formatCurrency(resultados.rendaComInvestimentosMensal)}/mês</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Capital Humano:</span>
              <span className="font-semibold">{formatCurrency(resultados.capitalHumanoAnual)}/ano</span>
            </div>
            <div className="flex justify-between">
              <span>Imóveis (líquido):</span>
              <span className="font-semibold">{formatCurrency(resultados.rendaLiquidaAposDespesasAnual)}/ano</span>
            </div>
            <div className="flex justify-between">
              <span>Investimentos:</span>
              <span className="font-semibold">{formatCurrency(resultados.investimentosAnual)}/ano</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Despesas Extras:</span>
              <span className="font-semibold">-{formatCurrency(resultados.despesasExtrasAnual)}/ano</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-lg font-bold text-green-700">
              <span>Renda Final:</span>
              <span>{formatCurrency(resultados.rendaComInvestimentosAnual)}/ano</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

PrintableReport.displayName = 'PrintableReport';
