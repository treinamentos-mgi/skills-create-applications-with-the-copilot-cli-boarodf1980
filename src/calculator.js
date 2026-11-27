#!/usr/bin/env node
/**
 * Calculadora CLI.
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 *      node src/calculator.js squareRoot <a>
 *
 * Operações suportadas:
 *   addition - adição (a + b)
 *   subtraction - subtração (a - b)
 *   multiplication - multiplicação (a * b)
 *   division - divisão (a / b); divisão por zero gera erro
 *   modulo - resto (a % b); divisor zero gera erro
 *   exponentiation - potenciação (a ** b); resultado não finito gera erro
 *   squareRoot - raiz quadrada de a; número negativo gera erro
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

function validateOperands(...operands) {
  if (!operands.every(Number.isFinite)) {
    throw new Error('Os operandos devem ser números válidos e finitos.');
  }
}

// Módulo (resto da divisão, com o sinal do dividendo)
const modulo = (a, b) => {
  validateOperands(a, b);
  if (b === 0) throw new Error('Módulo por zero não é permitido.');
  return a % b;
};

// Potenciação com resultado real finito
const exponentiation = (a, b) => {
  validateOperands(a, b);
  const result = a ** b;
  if (!Number.isFinite(result)) {
    throw new Error('A potenciação deve produzir um número real finito.');
  }
  return result;
};

// Raiz quadrada real
const squareRoot = (a) => {
  validateOperands(a);
  if (a < 0) throw new Error('Raiz quadrada de número negativo não é permitida.');
  return Math.sqrt(a);
};

const operations = {
  addition, subtraction, multiplication, division, modulo, exponentiation, squareRoot,
};

function main(args) {
  const [op, ...rawOperands] = args;
  const operandCount = op === 'squareRoot' ? 1 : 2;

  if (rawOperands.length !== operandCount || !Object.hasOwn(operations, op)) {
    console.error(
      'Uso: node src/calculator.js <addition|subtraction|multiplication|division|modulo|exponentiation> <a> <b>\n' +
      '     node src/calculator.js squareRoot <a>'
    );
    return 1;
  }

  const operands = rawOperands.map(Number);
  if (rawOperands.some(value => value.trim() === '') || !operands.every(Number.isFinite)) {
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

module.exports = operations;
