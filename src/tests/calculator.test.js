const { spawnSync } = require('child_process');
const path = require('path');
const { add, subtract, multiply, divide } = require('../calculator');

const CLI = path.join(__dirname, '..', 'calculator.js');
const run = (...args) => spawnSync('node', [CLI, ...args], { encoding: 'utf8' });

describe('addition', () => {
  test('2 + 3 = 5', () => expect(add(2, 3)).toBe(5));
  test('negativos', () => expect(add(-2, -3)).toBe(-5));
  test('com zero', () => expect(add(7, 0)).toBe(7));
  test('decimais', () => expect(add(0.5, 0.25)).toBe(0.75));
});

describe('subtraction', () => {
  test('10 - 4 = 6', () => expect(subtract(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtract(4, 10)).toBe(-6));
  test('com zero', () => expect(subtract(7, 0)).toBe(7));
  test('decimais', () => expect(subtract(1.5, 0.5)).toBe(1));
});

describe('multiplication', () => {
  test('45 * 2 = 90', () => expect(multiply(45, 2)).toBe(90));
  test('por zero', () => expect(multiply(9, 0)).toBe(0));
  test('negativos', () => expect(multiply(-3, -4)).toBe(12));
  test('sinais diferentes', () => expect(multiply(-3, 4)).toBe(-12));
  test('decimais', () => expect(multiply(0.5, 4)).toBe(2));
});

describe('division', () => {
  test('20 / 5 = 4', () => expect(divide(20, 5)).toBe(4));
  test('resultado decimal', () => expect(divide(6, 4)).toBe(1.5));
  test('negativos', () => expect(divide(-8, 2)).toBe(-4));
  test('zero dividido por número', () => expect(divide(0, 5)).toBe(0));
  test('divisão por zero lança erro', () => {
    expect(() => divide(1, 0)).toThrow('Divisão por zero');
  });
  test('zero dividido por zero lança erro', () => {
    expect(() => divide(0, 0)).toThrow('Divisão por zero');
  });
});

describe('CLI', () => {
  test.each([
    [['add', '2', '3'], '5'],
    [['subtract', '10', '4'], '6'],
    [['multiply', '45', '2'], '90'],
    [['divide', '20', '5'], '4'],
  ])('%j imprime %s', (args, expected) => {
    const r = run(...args);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe(expected);
  });

  test('divisão por zero retorna erro', () => {
    const r = run('divide', '1', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/Divisão por zero/);
  });

  test('operando não numérico', () => {
    const r = run('add', 'x', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/números válidos/);
  });

  test('operando vazio', () => {
    expect(run('add', '', '2').status).toBe(1);
  });

  test('operação desconhecida', () => {
    expect(run('power', '2', '3').status).toBe(1);
  });

  test('operação herdada de Object (toString) é rejeitada', () => {
    expect(run('toString', '2', '3').status).toBe(1);
  });

  test('número de argumentos incorreto', () => {
    expect(run('add', '2').status).toBe(1);
  });
});
