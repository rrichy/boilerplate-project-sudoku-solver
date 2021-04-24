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
      
      let index = solver.transformCoordinate(coordinate);

      let errors = [];

      if(!solver.checkRowPlacement(puzzle, index, value)) errors.push('row');
      if(!solver.checkColPlacement(puzzle, index, value)) errors.push('column');
      if(!solver.checkRegionPlacement(puzzle, index, value)) errors.push('region');

      if(errors.length === 0) {
        console.log({valid: true});
        return res.json({valid: true});
      }
      else {
        console.log({valid: false, conflict: errors});
        return res.json({valid: false, conflict: errors});
      }
      
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
