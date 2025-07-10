import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LancamentosForm from '../lancamentos/LancamentosForm';
import '@testing-library/jest-dom';

// Mock dos hooks
jest.mock('../../hooks/useLancamentos', () => ({
  useLancamentos: () => ({
    createLancamento: jest.fn(),
    updateLancamento: jest.fn(),
    loading: false,
  }),
}));

describe('LancamentosForm', () => {
  const mockLancamento = {
    id: '1',
    descricao: 'Venda de produtos',
    valor: 1500.00,
    tipo: 'receita',
    categoria: 'vendas',
    data: '2024-01-15',
    status: 'confirmado',
  };

  it('renders form fields correctly', () => {
    render(<LancamentosForm />);
    
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
  });

  it('populates form with existing data', () => {
    render(<LancamentosForm lancamento={mockLancamento} />);
    
    expect(screen.getByDisplayValue('Venda de produtos')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1500.00')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LancamentosForm />);
    
    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
      expect(screen.getByText(/valor é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('validates positive value', async () => {
    render(<LancamentosForm />);
    
    const valorInput = screen.getByLabelText(/valor/i);
    fireEvent.change(valorInput, { target: { value: '-100' } });
    fireEvent.blur(valorInput);
    
    await waitFor(() => {
      expect(screen.getByText(/valor deve ser positivo/i)).toBeInTheDocument();
    });
  });
}); 