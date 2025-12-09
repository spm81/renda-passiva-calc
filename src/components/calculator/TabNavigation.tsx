import { TabType } from '@/types/calculator';
import { Briefcase, Building2, Receipt, TrendingUp, BarChart3 } from 'lucide-react';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'capital-humano', label: 'Capital Humano', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'investimentos', label: 'Investimentos', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'imoveis', label: 'Imóveis', icon: <Building2 className="w-4 h-4" /> },
  { id: 'despesas', label: 'Despesas', icon: <Receipt className="w-4 h-4" /> },
  { id: 'resultados', label: 'Resultados', icon: <BarChart3 className="w-4 h-4" /> },
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-button flex items-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
