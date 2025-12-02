import { useState, useEffect, useCallback, useMemo } from 'react';
import { Imovel, DespesaExtra, Investimento, CapitalHumano, CalculatedImovel, Resultados } from '@/types/calculator';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getStorageKeys(username: string | null) {
  const prefix = username ? `calculadora_${username}_` : 'calculadora_';
  return {
    capitalHumano: `${prefix}capitalHumano`,
    imoveis: `${prefix}imoveis`,
    despesas: `${prefix}despesas`,
    investimentos: `${prefix}investimentos`,
  };
}

export function useCalculator(currentUser: string | null) {
  const storageKeys = useMemo(() => getStorageKeys(currentUser), [currentUser]);

  const [capitalHumano, setCapitalHumano] = useState<CapitalHumano[]>([]);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [despesas, setDespesas] = useState<DespesaExtra[]>([]);
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);

  // Load data when user changes
  useEffect(() => {
    const savedCapitalHumano = localStorage.getItem(storageKeys.capitalHumano);
    const savedImoveis = localStorage.getItem(storageKeys.imoveis);
    const savedDespesas = localStorage.getItem(storageKeys.despesas);
    const savedInvestimentos = localStorage.getItem(storageKeys.investimentos);

    setCapitalHumano(savedCapitalHumano ? JSON.parse(savedCapitalHumano) : []);
    setImoveis(savedImoveis ? JSON.parse(savedImoveis) : []);
    setDespesas(savedDespesas ? JSON.parse(savedDespesas) : []);
    setInvestimentos(savedInvestimentos ? JSON.parse(savedInvestimentos) : []);
  }, [storageKeys]);

  // Persist to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKeys.capitalHumano, JSON.stringify(capitalHumano));
    }
  }, [capitalHumano, storageKeys, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKeys.imoveis, JSON.stringify(imoveis));
    }
  }, [imoveis, storageKeys, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKeys.despesas, JSON.stringify(despesas));
    }
  }, [despesas, storageKeys, currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(storageKeys.investimentos, JSON.stringify(investimentos));
    }
  }, [investimentos, storageKeys, currentUser]);

  // Capital Humano CRUD
  const addCapitalHumano = useCallback((ch: Omit<CapitalHumano, 'id'>) => {
    setCapitalHumano(prev => [...prev, { ...ch, id: generateId() }]);
  }, []);

  const removeCapitalHumano = useCallback((id: string) => {
    setCapitalHumano(prev => prev.filter(ch => ch.id !== id));
  }, []);

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
    // Capital Humano
    const capitalHumanoMensal = capitalHumano.reduce((acc, ch) => acc + ch.rendimentoLiquido, 0);
    const capitalHumanoAnual = capitalHumanoMensal * 12;

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
      capitalHumanoMensal,
      capitalHumanoAnual,
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
      rendaComInvestimentosMensal: capitalHumanoMensal + rendaFinalMensal + investimentosMensal,
      rendaComInvestimentosAnual: capitalHumanoAnual + rendaFinalAnual + investimentosAnual,
    };
  }, [capitalHumano, imoveis, despesas, investimentos, calculateImovel]);

  const calculatedImoveis = useMemo(
    () => imoveis.map(calculateImovel),
    [imoveis, calculateImovel]
  );

  // Clear all data
  const clearAllData = useCallback(() => {
    setCapitalHumano([]);
    setImoveis([]);
    setDespesas([]);
    setInvestimentos([]);
  }, []);

  return {
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
    updateDespesa,
    removeDespesa,
    addInvestimento,
    updateInvestimento,
    removeInvestimento,
    calculateImovel,
    clearAllData,
  };
}
