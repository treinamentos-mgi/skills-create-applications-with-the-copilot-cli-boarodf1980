#!/usr/bin/env node
/**
 * Calculadora CLI.
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 *
 * Operações suportadas:
 *   addition - adição (a + b)
 *   subtraction - subtração (a - b)
 *   multiplication - multiplicação (a * b)
 *   division - divisão (a / b); divisão por zero gera erro
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

const operations = { addition, subtraction, multiplication, division };

function main(args) {
  const [op, rawA, rawB] = args;

  if (args.length !== 3 || !Object.hasOwn(operations, op)) {
    console.error(
      'Uso: node src/calculator.js <addition|subtraction|multiplication|division> <a> <b>'
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

module.exports = { addition, subtraction, multiplication, division };
