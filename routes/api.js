'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();
  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, value, coordinate } = req.body;

      if(!puzzle || !coordinate || !value) {
        console.log({ error: 'Required field(s) missing' });
        return res.json({ error: 'Required field(s) missing' });
      }

      let validation = solver.validate(puzzle);
      if(validation !== true) {
        console.log(validation);
        return res.json(validation);
      }

      if(!'abcdefghi'.includes(coordinate.toLowerCase()[0]) || !'123456789'.includes(coordinate[1])) {
        console.log({error: "Invalid coordinate"});
        return res.json({error: "Invalid coordinate"});
      }
      if(!'123456789'.includes(value)) {
        console.log({ error: 'Invalid value' });
        return res.json({ error: 'Invalid value' });
      }
      
      let row = 'abcdefghi'.indexOf(coordinate.toLowerCase()[0]),
        col = Number(coordinate[1]) - 1;

      let check = solver.isValid(puzzle, row, col, value);

      console.log(check);
      return res.json(check);      
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if(!puzzle) {
        console.log({ error: 'Required field missing' });
        return res.json({ error: 'Required field missing' });
      }

      let validation = solver.validate(puzzle);
      if(validation !== true) {
        console.log(validation);
        return res.json(validation);
      }

      let attempt = solver.solve(puzzle);
      if(typeof attempt === 'object') {
        console.log(attempt);
        return res.json(attempt);
      }

      //console.log(solver.solve(puzzle));
      return res.json({solution: solver.solve(puzzle)});
    });
};
