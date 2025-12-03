export interface Imovel {
  id: string;
  nome: string;
  valor: number;
  valorVenda: number;
  renda: number;
  irPercent: number;
  imi: number;
  condominio: number;
  seguro: number;
}

export interface DespesaExtra {
  id: string;
  nome: string;
  valorMensal: number;
  valorAnual: number;
}

export interface Investimento {
  id: string;
  nome: string;
  valor: number;
  rendimentoBruto: number;
  impostoPercent: number;
  tipoJuros: 'nominal' | 'composto';
  diasCapitalizacao?: number; // dias entre cada capitalização (só para juros compostos)
}

export interface CapitalHumano {
  id: string;
  nome: string;
  rendimentoLiquido: number;
}

export interface CalculatedImovel extends Imovel {
  irValor: number;
  imiMensal: number;
  despesasMensais: number;
  rendaLiquida: number;
  rendaLiquidaAposDespesas: number;
  rendaAnual: number;
  impostoAnual: number;
  despesasAnuais: number;
  rendaLiquidaAnual: number;
  rendaLiquidaAnualAposDespesas: number;
}

export interface Resultados {
  capitalHumanoMensal: number;
  capitalHumanoAnual: number;
  totalRendaMensal: number;
  totalImpostoMensal: number;
  totalDespesasMensal: number;
  totalRendaLiquidaMensal: number;
  rendaLiquidaAposDespesasMensal: number;
  totalRendaAnual: number;
  totalImpostoAnual: number;
  totalDespesasAnuais: number;
  totalRendaLiquidaAnual: number;
  rendaLiquidaAposDespesasAnual: number;
  despesasExtrasMensal: number;
  despesasExtrasAnual: number;
  rendaFinalMensal: number;
  rendaFinalAnual: number;
  investimentosMensal: number;
  investimentosAnual: number;
  rendaComInvestimentosMensal: number;
  rendaComInvestimentosAnual: number;
}

export type TabType = 'capital-humano' | 'imoveis' | 'despesas' | 'investimentos' | 'resultados';
