'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, value, coordinate } = req.body;

      let validation = solver.validate(puzzle, coordinate, value);
      if(validation !== true) {
        console.log(validation);
        return res.json(validation);
      }
      
      let row = 'abcdefghi'.indexOf(coordinate.toLowerCase()[0]),
        col = Number(coordinate[1]) - 1;

      puzzle = puzzle.match(/.{9}/g).map(a => a.split(''));
      let check = solver.isValid(puzzle, row, col, value);

      console.log(check);
      return res.json(check);      
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      let result = solver.solve(puzzle);
      console.log(result);
      res.json(result);

      // let validation = solver.validate(puzzle);

      // let attempt = solver.solve(puzzle);
      // if(typeof attempt === 'object') {
      //   console.log(attempt);
      //   return res.json(attempt);
      // }

      // //console.log(solver.solve(puzzle));
      // return res.json({solution: solver.solve(puzzle)});
    });
};
