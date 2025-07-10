import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CadastroForm from '../cadastro/CadastroForm';
import '@testing-library/jest-dom';

// Mock dos hooks
jest.mock('../../hooks/useCadastros', () => ({
  useCadastros: () => ({
    createCadastro: jest.fn(),
    updateCadastro: jest.fn(),
    loading: false,
  }),
}));

describe('CadastroForm', () => {
  const mockCadastro = {
    id: '1',
    nome: 'João Silva',
    email: 'joao@teste.com',
    telefone: '(11) 99999-9999',
    tipo: 'cliente',
    status: 'ativo',
  };

  it('renders form fields correctly', () => {
    render(<CadastroForm />);
    
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
  });

  it('populates form with existing data', () => {
    render(<CadastroForm cadastro={mockCadastro} />);
    
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
    expect(screen.getByDisplayValue('joao@teste.com')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<CadastroForm />);
    
    const submitButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<CadastroForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument();
    });
  });
}); 