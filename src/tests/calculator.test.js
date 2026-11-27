const { spawnSync } = require('child_process');
const path = require('path');
const {
  addition, subtraction, multiplication, division, modulo, exponentiation, squareRoot,
} = require('../calculator');

const CLI = path.join(__dirname, '..', 'calculator.js');
const run = (...args) => spawnSync('node', [CLI, ...args], { encoding: 'utf8' });

describe('addition', () => {
  test('2 + 3 = 5', () => expect(addition(2, 3)).toBe(5));
  test('negativos', () => expect(addition(-2, -3)).toBe(-5));
  test('com zero', () => expect(addition(7, 0)).toBe(7));
  test('decimais', () => expect(addition(0.5, 0.25)).toBe(0.75));
});

describe('subtraction', () => {
  test('10 - 4 = 6', () => expect(subtraction(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtraction(4, 10)).toBe(-6));
  test('com zero', () => expect(subtraction(7, 0)).toBe(7));
  test('decimais', () => expect(subtraction(1.5, 0.5)).toBe(1));
});

describe('multiplication', () => {
  test('45 * 2 = 90', () => expect(multiplication(45, 2)).toBe(90));
  test('por zero', () => expect(multiplication(9, 0)).toBe(0));
  test('negativos', () => expect(multiplication(-3, -4)).toBe(12));
  test('sinais diferentes', () => expect(multiplication(-3, 4)).toBe(-12));
  test('decimais', () => expect(multiplication(0.5, 4)).toBe(2));
});

describe('division', () => {
  test('20 / 5 = 4', () => expect(division(20, 5)).toBe(4));
  test('resultado decimal', () => expect(division(6, 4)).toBe(1.5));
  test('negativos', () => expect(division(-8, 2)).toBe(-4));
  test('zero dividido por número', () => expect(division(0, 5)).toBe(0));
  test('divisão por zero lança erro', () => {
    expect(() => division(1, 0)).toThrow('Divisão por zero');
  });
  test('zero dividido por zero lança erro', () => {
    expect(() => division(0, 0)).toThrow('Divisão por zero');
  });
});

describe('modulo', () => {
  test.each([
    [10, 3, 1], [-10, 3, -1], [10, -3, 1], [0, 3, 0], [5.5, 2, 1.5],
  ])('%s %% %s = %s', (a, b, expected) => {
    expect(modulo(a, b)).toBe(expected);
  });

  test.each([0, -0])('divisor %s lança erro', (b) => {
    expect(() => modulo(10, b)).toThrow('Módulo por zero');
  });
});

describe('exponentiation', () => {
  test.each([
    [2, 3, 8], [2, 0, 1], [2, -2, 0.25], [-2, 3, -8],
    [9, 0.5, 3], [0, 2, 0], [0, 0, 1],
  ])('%s ** %s = %s', (a, b, expected) => {
    expect(exponentiation(a, b)).toBe(expected);
  });

  test.each([[0, -1], [-4, 0.5], [10, 1000]])(
    'potência inválida de %s por %s lança erro', (a, b) => {
      expect(() => exponentiation(a, b)).toThrow('número real finito');
    }
  );
});

describe('squareRoot', () => {
  test.each([[9, 3], [0, 0], [0.25, 0.5], [2, Math.SQRT2]])(
    'raiz de %s = %s', (a, expected) => {
      expect(squareRoot(a)).toBeCloseTo(expected);
    }
  );

  test('número negativo lança erro', () => {
    expect(() => squareRoot(-1)).toThrow('número negativo');
  });
});

describe('validação das novas operações', () => {
  test.each([NaN, Infinity, -Infinity, '2', undefined, null])(
    'rejeita operando inválido %s', (value) => {
      expect(() => modulo(value, 2)).toThrow('números válidos');
      expect(() => modulo(2, value)).toThrow('números válidos');
      expect(() => exponentiation(value, 2)).toThrow('números válidos');
      expect(() => exponentiation(2, value)).toThrow('números válidos');
      expect(() => squareRoot(value)).toThrow('números válidos');
    }
  );
});

describe('CLI', () => {
  test.each([
    [['addition', '2', '3'], '5'],
    [['subtraction', '10', '4'], '6'],
    [['multiplication', '45', '2'], '90'],
    [['division', '20', '5'], '4'],
    [['modulo', '10', '3'], '1'],
    [['exponentiation', '2', '3'], '8'],
    [['squareRoot', '9'], '3'],
  ])('%j imprime %s', (args, expected) => {
    const r = run(...args);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe(expected);
  });

  test('divisão por zero retorna erro', () => {
    const r = run('division', '1', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/Divisão por zero/);
  });

  test.each([
    [['modulo', '10', '0'], /Módulo por zero/],
    [['exponentiation', '-4', '0.5'], /número real finito/],
    [['exponentiation', '0', '-1'], /número real finito/],
    [['exponentiation', '10', '1000'], /número real finito/],
    [['squareRoot', '-1'], /número negativo/],
    [['squareRoot', 'abc'], /números válidos/],
    [['squareRoot', ' '], /números válidos/],
    [['squareRoot', 'Infinity'], /números válidos/],
    [['modulo', 'NaN', '2'], /números válidos/],
    [['exponentiation', '2', 'Infinity'], /números válidos/],
    [['squareRoot'], /Uso:/],
    [['squareRoot', '9', '2'], /Uso:/],
    [['modulo', '10'], /Uso:/],
    [['exponentiation', '2'], /Uso:/],
  ])('%j retorna erro', (args, message) => {
    const r = run(...args);
    expect(r.status).toBe(1);
    expect(r.stdout).toBe('');
    expect(r.stderr).toMatch(message);
  });

  test('operando não numérico', () => {
    const r = run('addition', 'x', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/números válidos/);
  });

  test('operando vazio', () => {
    expect(run('addition', '', '2').status).toBe(1);
  });

  test('operação desconhecida', () => {
    expect(run('power', '2', '3').status).toBe(1);
  });

  test('operação herdada de Object (toString) é rejeitada', () => {
    expect(run('toString', '2', '3').status).toBe(1);
  });

  test('número de argumentos incorreto', () => {
    expect(run('addition', '2').status).toBe(1);
  });
});
