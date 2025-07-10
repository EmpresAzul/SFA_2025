import { renderHook, act } from '@testing-library/react';
import { useLancamentos } from '../useLancamentos';

// Mock do Supabase
jest.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
          }),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

describe('useLancamentos', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useLancamentos());
    
    expect(result.current.lancamentos).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('creates lancamento successfully', async () => {
    const { result } = renderHook(() => useLancamentos());
    
    const newLancamento = {
      descricao: 'Teste',
      valor: 100,
      tipo: 'receita',
      categoria: 'vendas',
      data: '2024-01-15',
    };

    await act(async () => {
      await result.current.createLancamento(newLancamento);
    });

    expect(result.current.error).toBeNull();
  });

  it('updates lancamento successfully', async () => {
    const { result } = renderHook(() => useLancamentos());
    
    const lancamentoToUpdate = {
      id: '1',
      descricao: 'Teste Atualizado',
      valor: 200,
      tipo: 'receita',
      categoria: 'vendas',
      data: '2024-01-15',
    };

    await act(async () => {
      await result.current.updateLancamento(lancamentoToUpdate);
    });

    expect(result.current.error).toBeNull();
  });

  it('deletes lancamento successfully', async () => {
    const { result } = renderHook(() => useLancamentos());
    
    await act(async () => {
      await result.current.deleteLancamento('1');
    });

    expect(result.current.error).toBeNull();
  });
}); 