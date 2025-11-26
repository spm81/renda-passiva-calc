import { useState } from 'react';
import { TabType } from '@/types/calculator';
import { useCalculator } from '@/hooks/useCalculator';
import { TabNavigation } from '@/components/calculator/TabNavigation';
import { ImoveisTab } from '@/components/calculator/ImoveisTab';
import { DespesasTab } from '@/components/calculator/DespesasTab';
import { InvestimentosTab } from '@/components/calculator/InvestimentosTab';
import { ResultadosTab } from '@/components/calculator/ResultadosTab';
import { Building2, Calculator } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('imoveis');
  
  const {
    imoveis,
    despesas,
    investimentos,
    calculatedImoveis,
    resultados,
    addImovel,
    updateImovel,
    removeImovel,
    addDespesa,
    removeDespesa,
    addInvestimento,
    removeInvestimento,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Calculadora de Renda Passiva
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Imóveis • Despesas • Investimentos
              </p>
            </div>
            <div className="p-2 rounded-xl bg-primary/10">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'imoveis' && (
          <ImoveisTab
            imoveis={imoveis}
            calculatedImoveis={calculatedImoveis}
            onAdd={addImovel}
            onUpdate={updateImovel}
            onRemove={removeImovel}
          />
        )}

        {activeTab === 'despesas' && (
          <DespesasTab
            despesas={despesas}
            onAdd={addDespesa}
            onRemove={removeDespesa}
          />
        )}

        {activeTab === 'investimentos' && (
          <InvestimentosTab
            investimentos={investimentos}
            onAdd={addInvestimento}
            onRemove={removeInvestimento}
          />
        )}

        {activeTab === 'resultados' && (
          <ResultadosTab resultados={resultados} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 mt-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Os dados são guardados localmente no seu navegador.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
