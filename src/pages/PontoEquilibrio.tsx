
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FaturamentoEstimativa from '@/components/ponto-equilibrio/FaturamentoEstimativa';
import CustosVariaveisEstimativa from '@/components/ponto-equilibrio/CustosVariaveisEstimativa';
import GastosFixosEstimativa from '@/components/ponto-equilibrio/GastosFixosEstimativa';
import SaidasNaoOperacionais from '@/components/ponto-equilibrio/SaidasNaoOperacionais';
import ProLaboreCalculado from '@/components/ponto-equilibrio/ProLaboreCalculado';
import ResultadosPontoEquilibrio from '@/components/ponto-equilibrio/ResultadosPontoEquilibrio';
import ProjecoesSalvas from '@/components/ponto-equilibrio/ProjecoesSalvas';
import { usePontoEquilibrio } from '@/hooks/usePontoEquilibrio';

const PontoEquilibrio: React.FC = () => {
  const {
    faturamento,
    setFaturamento,
    custosVariaveis,
    setCustosVariaveis,
    gastosFixos,
    setGastosFixos,
    saidasNaoOperacionais,
    setSaidasNaoOperacionais,
    pontoEquilibrio,
    proLaboreMaximo,
    percentualPE,
    margemContribuicao,
    // Projeções
    projecoes,
    isLoadingProjecoes,
    projecaoAtual,
    salvarProjecao,
    carregarProjecao,
    deletarProjecao,
    novaProjecao,
    isSaving,
    isDeleting
  } = usePontoEquilibrio();

  return (
    <div className="responsive-padding responsive-margin bg-gradient-to-br from-slate-50 to-red-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          📊 Ponto de Equilíbrio
        </h1>
        <p className="text-gray-600 text-sm">
          Calcule o ponto de equilíbrio do seu negócio e determine o faturamento mínimo necessário
        </p>
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Inputs */}
        <div className="lg:col-span-1 space-y-6">
          <FaturamentoEstimativa 
            value={faturamento}
            onChange={setFaturamento}
          />
          
          <CustosVariaveisEstimativa 
            values={custosVariaveis}
            onChange={setCustosVariaveis}
          />
          
          <GastosFixosEstimativa 
            values={gastosFixos}
            onChange={setGastosFixos}
          />
          
          <SaidasNaoOperacionais 
            value={saidasNaoOperacionais}
            onChange={setSaidasNaoOperacionais}
          />
          
          <ProLaboreCalculado 
            value={proLaboreMaximo}
          />
        </div>

        {/* Coluna Central - Resultados */}
        <div className="lg:col-span-1">
          <ResultadosPontoEquilibrio 
            faturamentoAtual={faturamento}
            pontoEquilibrio={pontoEquilibrio}
            percentualPE={percentualPE}
            margemContribuicao={margemContribuicao}
          />
        </div>

        {/* Coluna Direita - Projeções Salvas */}
        <div className="lg:col-span-1">
          <ProjecoesSalvas
            projecoes={projecoes}
            projecaoAtual={projecaoAtual}
            onSalvarProjecao={salvarProjecao}
            onCarregarProjecao={carregarProjecao}
            onDeletarProjecao={deletarProjecao}
            onNovaProjecao={novaProjecao}
            isSaving={isSaving}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </div>
  );
};

export default PontoEquilibrio;
