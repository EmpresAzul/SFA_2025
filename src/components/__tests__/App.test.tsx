import { render, screen } from '@testing-library/react';
import App from '../../App';
import '@testing-library/jest-dom';

// Mock do AuthProvider para evitar erros de contexto
jest.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Verifica se o app renderiza sem erros
    expect(document.body).toBeInTheDocument();
  });
}); 