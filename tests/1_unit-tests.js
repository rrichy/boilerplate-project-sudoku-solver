const chai = require('chai');
const assert = chai.assert;

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const defPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const invPuzzle = '..99.5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', () => {
    puzzlesAndSolutions.map(a => a[0]).forEach(a => {
      assert.isTrue(solver.validate(a), 'valid puzzle must return true');
    });
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    puzzlesAndSolutions.map(a => a[0]).forEach(a => {
      assert.deepEqual(solver.validate(a.replace('.', 'x')), { error: 'Invalid characters in puzzle' });
    });
  });

  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    puzzlesAndSolutions.map(a => a[0]).forEach(a => {
      assert.deepEqual(solver.validate(a.slice(0, -1)), { error: 'Expected puzzle to be 81 characters long' });
    });
  });

  test('Logic handles a valid row placement', () => {
    assert.isTrue(solver.checkRowPlacement(defPuzzle, solver.transformCoordinate('A2'), '6'), 'valid row placement must return true');
  });

  test('Logic handles an invalid row placement', () => {
    assert.isFalse(solver.checkRowPlacement(defPuzzle, solver.transformCoordinate('A2'), '1'), 'invalid row placement must return false');
  });

  test('Logic handles a valid column placement', () => {
    assert.isTrue(solver.checkColPlacement(defPuzzle, solver.transformCoordinate('A2'), '6'), 'valid column placement must return true');
  });

  test('Logic handles an invalid column placement', () => {
    assert.isFalse(solver.checkColPlacement(defPuzzle, solver.transformCoordinate('A2'), '2'), 'invalid column placement must return false');
  });

  test('Logic handles a valid region (3x3 grid) placement', () => {
    assert.isTrue(solver.checkRegionPlacement(defPuzzle, solver.transformCoordinate('A2'), '6'), 'valid region placement must return true');
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    assert.isFalse(solver.checkRegionPlacement(defPuzzle, solver.transformCoordinate('A2'), '2'), 'invalid region placement must return false');
  });

  test('Valid puzzle strings pass the solver', () => {
    puzzlesAndSolutions.forEach(a => {
      assert.isString(solver.solve(a[0]), 'valid puzzle must pass the solver');
    });
  });

  test('Invalid puzzle strings fail the solver', () => {
    assert.deepEqual(solver.solve(invPuzzle), { error: 'Puzzle cannot be solved' });
  });

  test('Solver returns the the expected solution for an incomplete puzzle', () => {
    puzzlesAndSolutions.forEach(a => {
      assert.equal(solver.solve(a[0]), a[1], 'incomplete but valid puzzles must return the solution');
    });
  });
})