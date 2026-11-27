const { spawnSync } = require('child_process');
const path = require('path');
const { addition, subtraction, multiplication, division } = require('../calculator');

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

describe('CLI', () => {
  test.each([
    [['addition', '2', '3'], '5'],
    [['subtraction', '10', '4'], '6'],
    [['multiplication', '45', '2'], '90'],
    [['division', '20', '5'], '4'],
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
