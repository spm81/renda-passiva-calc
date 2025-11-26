import { useState, useEffect, useCallback, useMemo } from 'react';
import { Imovel, DespesaExtra, Investimento, CalculatedImovel, Resultados } from '@/types/calculator';

const STORAGE_KEYS = {
  imoveis: 'calculadora_imoveis',
  despesas: 'calculadora_despesas',
  investimentos: 'calculadora_investimentos',
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useCalculator() {
  const [imoveis, setImoveis] = useState<Imovel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.imoveis);
    return saved ? JSON.parse(saved) : [];
  });

  const [despesas, setDespesas] = useState<DespesaExtra[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.despesas);
    return saved ? JSON.parse(saved) : [];
  });

  const [investimentos, setInvestimentos] = useState<Investimento[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.investimentos);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.imoveis, JSON.stringify(imoveis));
  }, [imoveis]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.despesas, JSON.stringify(despesas));
  }, [despesas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.investimentos, JSON.stringify(investimentos));
  }, [investimentos]);

  // Imoveis CRUD
  const addImovel = useCallback((imovel: Omit<Imovel, 'id'>) => {
    setImoveis(prev => [...prev, { ...imovel, id: generateId() }]);
  }, []);

  const updateImovel = useCallback((id: string, updates: Partial<Imovel>) => {
    setImoveis(prev => prev.map(im => im.id === id ? { ...im, ...updates } : im));
  }, []);

  const removeImovel = useCallback((id: string) => {
    setImoveis(prev => prev.filter(im => im.id !== id));
  }, []);

  // Despesas CRUD
  const addDespesa = useCallback((despesa: Omit<DespesaExtra, 'id'>) => {
    setDespesas(prev => [...prev, { ...despesa, id: generateId() }]);
  }, []);

  const updateDespesa = useCallback((id: string, updates: Partial<DespesaExtra>) => {
    setDespesas(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const removeDespesa = useCallback((id: string) => {
    setDespesas(prev => prev.filter(d => d.id !== id));
  }, []);

  // Investimentos CRUD
  const addInvestimento = useCallback((investimento: Omit<Investimento, 'id'>) => {
    setInvestimentos(prev => [...prev, { ...investimento, id: generateId() }]);
  }, []);

  const updateInvestimento = useCallback((id: string, updates: Partial<Investimento>) => {
    setInvestimentos(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
  }, []);

  const removeInvestimento = useCallback((id: string) => {
    setInvestimentos(prev => prev.filter(inv => inv.id !== id));
  }, []);

  // Calculate individual imovel
  const calculateImovel = useCallback((imovel: Imovel): CalculatedImovel => {
    const irValor = imovel.renda * (imovel.irPercent / 100);
    const imiMensal = imovel.imi / 12;
    const despesasMensais = imovel.condominio + imovel.seguro + imiMensal;
    const rendaLiquida = imovel.renda - irValor;
    const rendaLiquidaAposDespesas = rendaLiquida - despesasMensais;

    return {
      ...imovel,
      irValor,
      imiMensal,
      despesasMensais,
      rendaLiquida,
      rendaLiquidaAposDespesas,
      rendaAnual: imovel.renda * 12,
      impostoAnual: irValor * 12,
      despesasAnuais: despesasMensais * 12,
      rendaLiquidaAnual: rendaLiquida * 12,
      rendaLiquidaAnualAposDespesas: rendaLiquidaAposDespesas * 12,
    };
  }, []);

  // Calculate totals
  const resultados = useMemo((): Resultados => {
    let totalRendaMensal = 0;
    let totalImpostoMensal = 0;
    let totalDespesasMensal = 0;
    let totalRendaLiquidaMensal = 0;

    imoveis.forEach(imovel => {
      const calc = calculateImovel(imovel);
      totalRendaMensal += imovel.renda;
      totalImpostoMensal += calc.irValor;
      totalDespesasMensal += calc.despesasMensais;
      totalRendaLiquidaMensal += calc.rendaLiquida;
    });

    const rendaLiquidaAposDespesasMensal = totalRendaLiquidaMensal - totalDespesasMensal;

    const despesasExtrasMensal = despesas.reduce((acc, d) => acc + d.valorMensal, 0);
    const despesasExtrasAnual = despesas.reduce((acc, d) => acc + d.valorAnual, 0);

    const rendaFinalMensal = rendaLiquidaAposDespesasMensal - despesasExtrasMensal;
    const rendaFinalAnual = rendaFinalMensal * 12;

    // Investimentos
    let investimentosMensal = 0;
    let investimentosAnual = 0;

    investimentos.forEach(inv => {
      const brutoAnual = inv.valor * (inv.rendimentoBruto / 100);
      const impostoAnual = brutoAnual * (inv.impostoPercent / 100);
      const liquidoAnual = brutoAnual - impostoAnual;
      investimentosAnual += liquidoAnual;
      investimentosMensal += liquidoAnual / 12;
    });

    return {
      totalRendaMensal,
      totalImpostoMensal,
      totalDespesasMensal,
      totalRendaLiquidaMensal,
      rendaLiquidaAposDespesasMensal,
      totalRendaAnual: totalRendaMensal * 12,
      totalImpostoAnual: totalImpostoMensal * 12,
      totalDespesasAnuais: totalDespesasMensal * 12,
      totalRendaLiquidaAnual: totalRendaLiquidaMensal * 12,
      rendaLiquidaAposDespesasAnual: rendaLiquidaAposDespesasMensal * 12,
      despesasExtrasMensal,
      despesasExtrasAnual,
      rendaFinalMensal,
      rendaFinalAnual,
      investimentosMensal,
      investimentosAnual,
      rendaComInvestimentosMensal: rendaFinalMensal + investimentosMensal,
      rendaComInvestimentosAnual: rendaFinalAnual + investimentosAnual,
    };
  }, [imoveis, despesas, investimentos, calculateImovel]);

  const calculatedImoveis = useMemo(
    () => imoveis.map(calculateImovel),
    [imoveis, calculateImovel]
  );

  return {
    imoveis,
    despesas,
    investimentos,
    calculatedImoveis,
    resultados,
    addImovel,
    updateImovel,
    removeImovel,
    addDespesa,
    updateDespesa,
    removeDespesa,
    addInvestimento,
    updateInvestimento,
    removeInvestimento,
    calculateImovel,
  };
}
