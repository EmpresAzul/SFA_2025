import { 
  formatNumberToDisplay, 
  parseStringToNumber, 
  createCurrencyValue,
  validateCurrencyValue,
  formatCurrencyInput 
} from '../currency';

describe('Currency Utils', () => {
  describe('formatNumberToDisplay', () => {
    it('formats positive numbers correctly', () => {
      expect(formatNumberToDisplay(1234.56)).toBe('R$ 1.234,56');
      expect(formatNumberToDisplay(1000000)).toBe('R$ 1.000.000,00');
      expect(formatNumberToDisplay(0)).toBe('R$ 0,00');
    });

    it('formats negative numbers correctly', () => {
      expect(formatNumberToDisplay(-1234.56)).toBe('-R$ 1.234,56');
      expect(formatNumberToDisplay(-1000000)).toBe('-R$ 1.000.000,00');
    });

    it('handles decimal places correctly', () => {
      expect(formatNumberToDisplay(1234.5)).toBe('R$ 1.234,50');
      expect(formatNumberToDisplay(1234.567)).toBe('R$ 1.234,57'); // rounds up
    });
  });

  describe('parseStringToNumber', () => {
    it('parses formatted currency strings', () => {
      expect(parseStringToNumber('R$ 1.234,56')).toBe(1234.56);
      expect(parseStringToNumber('R$ 1.000.000,00')).toBe(1000000);
      expect(parseStringToNumber('R$ 0,00')).toBe(0);
    });

    it('parses negative formatted currency strings', () => {
      expect(parseStringToNumber('-R$ 1.234,56')).toBe(-1234.56);
      expect(parseStringToNumber('-R$ 1.000.000,00')).toBe(-1000000);
    });

    it('handles plain numbers', () => {
      expect(parseStringToNumber('1234.56')).toBe(1234.56);
      expect(parseStringToNumber('1000000')).toBe(1000000);
    });

    it('returns 0 for invalid input', () => {
      expect(parseStringToNumber('invalid')).toBe(0);
      expect(parseStringToNumber('')).toBe(0);
      expect(parseStringToNumber('R$ invalid')).toBe(0);
    });
  });

  describe('createCurrencyValue', () => {
    it('creates currency value object correctly', () => {
      const result = createCurrencyValue(1234.56);
      
      expect(result.numeric).toBe(1234.56);
      expect(result.display).toBe('R$ 1.234,56');
      expect(result.input).toBe('1.234,56');
    });
  });

  describe('validateCurrencyValue', () => {
    it('validates positive values', () => {
      const result = validateCurrencyValue(1234.56);
      
      expect(result.isValid).toBe(true);
      expect(result.numeric).toBe(1234.56);
    });

    it('rejects negative values', () => {
      const result = validateCurrencyValue(-1234.56);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Valor não pode ser negativo');
    });

    it('rejects invalid values', () => {
      const result = validateCurrencyValue('invalid');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Valor inválido');
    });
  });

  describe('formatCurrencyInput', () => {
    it('formats input while typing', () => {
      expect(formatCurrencyInput('123456')).toBe('1.234,56');
      expect(formatCurrencyInput('1000000')).toBe('10.000,00');
      expect(formatCurrencyInput('100')).toBe('1,00');
    });

    it('handles empty input', () => {
      expect(formatCurrencyInput('')).toBe('');
    });
  });
}); 