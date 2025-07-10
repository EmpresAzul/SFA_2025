import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import '@testing-library/jest-dom';

// Mock dos hooks
jest.mock('../../hooks/useDashboardMetrics', () => ({
  useDashboardMetrics: () => ({
    metrics: {
      totalReceitas: 50000,
      totalDespesas: 30000,
      saldoAtual: 20000,
      lancamentosPendentes: 5,
    },
    loading: false,
  }),
}));

jest.mock('../../hooks/useLancamentos', () => ({
  useLancamentos: () => ({
    lancamentos: [],
    loading: false,
  }),
}));

describe('Dashboard', () => {
  it('renders dashboard metrics', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/receitas totais/i)).toBeInTheDocument();
    expect(screen.getByText(/despesas totais/i)).toBeInTheDocument();
    expect(screen.getByText(/saldo atual/i)).toBeInTheDocument();
  });

  it('displays correct metric values', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/R\$ 50.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 30.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 20.000,00/)).toBeInTheDocument();
  });

  it('shows recent transactions section', () => {
    render(<Dashboard />);
    
    expect(screen.getByText(/lançamentos recentes/i)).toBeInTheDocument();
  });
}); 