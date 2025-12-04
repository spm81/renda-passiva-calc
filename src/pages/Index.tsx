import { useState, useEffect } from 'react';
import { TabType } from '@/types/calculator';
import { useCalculator } from '@/hooks/useCalculator';
import { TabNavigation } from '@/components/calculator/TabNavigation';
import { LoginArea } from '@/components/calculator/LoginArea';
import { CapitalHumanoTab } from '@/components/calculator/CapitalHumanoTab';
import { ImoveisTab } from '@/components/calculator/ImoveisTab';
import { DespesasTab } from '@/components/calculator/DespesasTab';
import { InvestimentosTab } from '@/components/calculator/InvestimentosTab';
import { ResultadosTab } from '@/components/calculator/ResultadosTab';
import { ExportButtons } from '@/components/calculator/ExportButtons';
import { PrintableReport } from '@/components/calculator/PrintableReport';
import { Building2, Calculator } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('capital-humano');
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return localStorage.getItem('calculadora_currentUser');
  });
  
  const {
    capitalHumano,
    imoveis,
    despesas,
    investimentos,
    calculatedImoveis,
    resultados,
    addCapitalHumano,
    removeCapitalHumano,
    addImovel,
    updateImovel,
    removeImovel,
    addDespesa,
    removeDespesa,
    addInvestimento,
    updateInvestimento,
    removeInvestimento,
    clearAllData,
  } = useCalculator(currentUser);

  // Persist current user
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('calculadora_currentUser', currentUser);
    } else {
      localStorage.removeItem('calculadora_currentUser');
    }
  }, [currentUser]);

  const handleLogin = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearAllData();
  };

  const handleDataLoaded = (data: any) => {
    // Clear current data first
    clearAllData();
    
    // Load new data
    if (data.capitalHumano) {
      data.capitalHumano.forEach((ch: any) => {
        addCapitalHumano(ch);
      });
    }
    if (data.imoveis) {
      data.imoveis.forEach((imovel: any) => {
        addImovel(imovel);
      });
    }
    if (data.despesasExtras) {
      data.despesasExtras.forEach((despesa: any) => {
        addDespesa(despesa);
      });
    }
    if (data.investimentos) {
      data.investimentos.forEach((inv: any) => {
        addInvestimento(inv);
      });
    }
  };

  // Show warning if not logged in
  const showLoginWarning = !currentUser;

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
        {/* Login Area */}
        <LoginArea
          currentUser={currentUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          capitalHumano={capitalHumano}
          imoveis={imoveis}
          despesas={despesas}
          investimentos={investimentos}
          onDataLoaded={handleDataLoaded}
        />

        {/* Warning if not logged in */}
        {showLoginWarning && (
          <div className="bg-warning/10 border border-warning/30 text-warning-foreground rounded-xl p-4 mb-6 text-center">
            <p className="text-sm font-medium text-warning">
              ⚠️ Faça login para guardar os seus dados. Sem login, os dados serão perdidos ao fechar o navegador.
            </p>
          </div>
        )}

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'capital-humano' && (
          <CapitalHumanoTab
            capitalHumano={capitalHumano}
            onAdd={addCapitalHumano}
            onRemove={removeCapitalHumano}
          />
        )}

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
            onUpdate={updateInvestimento}
            onRemove={removeInvestimento}
          />
        )}

        {activeTab === 'resultados' && (
          <>
            <ExportButtons />
            <ResultadosTab resultados={resultados} />
          </>
        )}

        {/* Printable Report - Hidden on screen, visible on print */}
        <PrintableReport
          currentUser={currentUser}
          capitalHumano={capitalHumano}
          calculatedImoveis={calculatedImoveis}
          despesas={despesas}
          investimentos={investimentos}
          resultados={resultados}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4 mt-8">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Os dados são guardados localmente no seu navegador {currentUser && `(utilizador: ${currentUser})`}.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
