import { formatNumberToDisplay } from '../currency';

describe('Currency Format Test', () => {
  it('shows actual format', () => {
    const result = formatNumberToDisplay(1234.56);
    console.log('Actual format:', JSON.stringify(result));
    console.log('Length:', result.length);
    console.log('Char codes:', Array.from(result).map(c => c.charCodeAt(0)));
    
    // Teste mais flexível
    expect(result).toMatch(/R\$.*1\.234,56/);
  });
}); 