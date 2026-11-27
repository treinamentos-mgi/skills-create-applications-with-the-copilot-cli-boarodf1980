#!/usr/bin/env node
/**
 * Calculadora CLI.
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 *
 * Operações suportadas:
 *   add       - adição (a + b)
 *   subtract  - subtração (a - b)
 *   multiply  - multiplicação (a * b)
 *   divide    - divisão (a / b); divisão por zero gera erro
 *
 * Exemplo: node src/calculator.js add 2 3  // imprime 5
 */

// Adição
const add = (a, b) => a + b;

// Subtração
const subtract = (a, b) => a - b;

// Multiplicação
const multiply = (a, b) => a * b;

// Divisão (lança erro se b for zero)
const divide = (a, b) => {
  if (b === 0) throw new Error('Divisão por zero não é permitida.');
  return a / b;
};

const operations = { add, subtract, multiply, divide };

function main(args) {
  const [op, rawA, rawB] = args;

  if (args.length !== 3 || !Object.hasOwn(operations, op)) {
    console.error(
      'Uso: node src/calculator.js <add|subtract|multiply|divide> <a> <b>'
    );
    return 1;
  }

  const a = Number(rawA);
  const b = Number(rawB);
  if (rawA.trim() === '' || rawB.trim() === '' || Number.isNaN(a) || Number.isNaN(b)) {
    console.error('Erro: os operandos devem ser números válidos.');
    return 1;
  }

  try {
    console.log(operations[op](a, b));
    return 0;
  } catch (err) {
    console.error(`Erro: ${err.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { add, subtract, multiply, divide };
