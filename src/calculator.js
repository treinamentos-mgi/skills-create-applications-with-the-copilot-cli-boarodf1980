#!/usr/bin/env node
/**
 * Calculadora CLI.
 *
 * Uso: node src/calculator.js <operação> <a> [b]
 *
 * Operações suportadas:
 *   addition - adição (a + b)
 *   subtraction - subtração (a - b)
 *   multiplication - multiplicação (a * b)
 *   division - divisão (a / b); divisão por zero gera erro
 *   modulo - resto da divisão (a % b); módulo por zero gera erro
 *   power - potenciação (base ^ expoente)
 *   squareRoot - raiz quadrada (um operando); número negativo gera erro
 *
 * Exemplo: node src/calculator.js addition 2 3  // imprime 5
 */

// Adição
const addition = (a, b) => a + b;

// Subtração
const subtraction = (a, b) => a - b;

// Multiplicação
const multiplication = (a, b) => a * b;

// Divisão (lança erro se b for zero)
const division = (a, b) => {
  if (b === 0) throw new Error('Divisão por zero não é permitida.');
  return a / b;
};

// Módulo: resto da divisão de a por b (lança erro se b for zero)
const modulo = (a, b) => {
  if (b === 0) throw new Error('Módulo por zero não é permitido.');
  return a % b;
};

// Potenciação: base elevada ao expoente
const power = (base, exponent) => base ** exponent;

// Raiz quadrada (lança erro se n for negativo)
const squareRoot = (n) => {
  if (n < 0) throw new Error('Raiz quadrada de número negativo não é permitida.');
  return Math.sqrt(n);
};

const operations = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
};

function main(args) {
  const [op, ...rawOperands] = args;

  // Quantidade de operandos esperada: a função de cada operação define a aridade
  if (!Object.hasOwn(operations, op) || rawOperands.length !== operations[op].length) {
    console.error(
      'Uso: node src/calculator.js <addition|subtraction|multiplication|division|modulo|power> <a> <b>\n' +
        '     node src/calculator.js squareRoot <n>'
    );
    return 1;
  }

  const operands = rawOperands.map((raw) => (raw.trim() === '' ? NaN : Number(raw)));
  if (operands.some(Number.isNaN)) {
    console.error('Erro: os operandos devem ser números válidos.');
    return 1;
  }

  try {
    console.log(operations[op](...operands));
    return 0;
  } catch (err) {
    console.error(`Erro: ${err.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
};
