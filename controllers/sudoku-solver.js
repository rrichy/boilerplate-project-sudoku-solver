class SudokuSolver {

  validate(puzzleString, coordinate, value) {
    if(!puzzleString || !coordinate || !value) return { error: 'Required field(s) missing' };

    if(!puzzleString.split('').every(char => '123456789.'.includes(char))) return { error: 'Invalid characters in puzzle' };
    
    if(puzzleString.length !== 81) return { error: "Expected puzzle to be 81 characters long" };

    if(!'abcdefghi'.includes(coordinate.toLowerCase()[0]) || !'123456789'.includes(coordinate[1])) return {error: "Invalid coordinate"};
    if(!'123456789'.includes(value)) return { error: 'Invalid value' };
      
    return true;
  }

  checkRowPlacement(arrayPuzzle, row, col, value) {
    const ROW = arrayPuzzle[row]
      .filter((_,i) => i !== col);

    return !ROW.includes(value); // returns true if given value is valid in index
  }

  checkColPlacement(arrayPuzzle, row, col, value) {
    const COL = arrayPuzzle
      .filter((_,i) => i !== row)
      .map((a,i) => a[col]);

    return !COL.includes(value); // returns true if given value is valid in index
  }

  checkRegionPlacement(arrayPuzzle, row, col, value) {
    const REGION_ROW = 3 * Math.floor(row / 3);
    const REGION_COL = 3 * Math.floor(col / 3);

    let region = '';
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(!(REGION_ROW + i === row && REGION_COL + j === col)) region += arrayPuzzle[REGION_ROW + i][REGION_COL + j];
      }
    }

    return !region.includes(value); // returns true if given value is valid in index
  }

  isValid(arrayPuzzle, row, col, value) {
    if(value === '.' || value === 0) return {valid: true};
    let errors = [];

    if(!this.checkRowPlacement(arrayPuzzle, row, col, value)) errors.push('row');
    if(!this.checkColPlacement(arrayPuzzle, row, col, value)) errors.push('column');
    if(!this.checkRegionPlacement(arrayPuzzle, row, col, value)) errors.push('region');

    if(errors.length === 0) return {valid: true}; // returns true if value is valid in a cell
    return {valid: false, conflict: errors};
  }

  findEmpty(arrayPuzzle) { // 2-dim array
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        if(arrayPuzzle[i][j] === '.' || arrayPuzzle[i][j] === 0) return [i, j];
      }
    }

    return [-1, -1];
  }

  solve(puzzleString) {
    if(!puzzleString) return { error: 'Required field missing' };
    if(!puzzleString.split('').every(char => '123456789.'.includes(char))) return { error: 'Invalid characters in puzzle' };
    
    if(puzzleString.length !== 81) return { error: "Expected puzzle to be 81 characters long" };

    let puzzle = puzzleString.match(/.{9}/g).map(a => a.split('').map(b => b === '.' ? 0 : Number(b)));
    for(let i = 0; i < 9; i++) {
      for(let j = 0; j < 9; j++) {
        if(this.isValid(puzzle, i, j, puzzle[i][j]).valid === false) return { error: 'Puzzle cannot be solved' };
      }
    }
    let backtrack = 0;

    const implication = (arrayPuzzle, row, col, val) => {
      arrayPuzzle[row][col] = val;
      let impl = [[row, col, val]];

      let done = false;

      while(done !== true){
        done = true;
        for(let i = 0; i < 9; i++) {
          const REGION_ROW = 3 * Math.floor(i / 3);
          const REGION_COL = 3 * (i % 3);

          let note = new Set([1,2,3,4,5,6,7,8,9]),
            cellinfo = [];

          for(let y = REGION_ROW; y < REGION_ROW + 3; y++) {
            for(let x = REGION_COL; x < REGION_COL + 3; x++) {
              if(arrayPuzzle[y][x] !== 0) note.delete(arrayPuzzle[y][x]);
            }
          }

          for(let y = REGION_ROW; y < REGION_ROW + 3; y++) {
            for(let x = REGION_COL; x < REGION_COL + 3; x++) {
              if(arrayPuzzle[y][x] === 0) cellinfo.push([y, x, new Set(note)]);
            }
          }

          for(let clue of cellinfo) {

            for(let a of arrayPuzzle[clue[0]]) {
              clue[2].delete(a);
            }

            for(let a of arrayPuzzle.reduce((acc, b) => acc.concat(b[clue[1]]), [])) {
              clue[2].delete(a);
            }

            if(clue[2].size === 1) {
              let value = clue[2].values().next().value;
              if(this.isValid(arrayPuzzle, clue[0], clue[1], value).valid) {
                arrayPuzzle[clue[0]][clue[1]] = value;
                impl.push([clue[0], clue[1], value]);
                done = false;
              }
            }
          }
        }
      }

      return impl;
    };

    const undoImplication = (arrayPuzzle, implication) => {
      for(let impl of implication) {
        arrayPuzzle[impl[0]][impl[1]] = 0;
      }
    }

    const recursion = (arrayPuzzle) => { // 2-dim array
      let [row, col] = this.findEmpty(arrayPuzzle);
      if(row === -1) return true;

      for(let n = 1; n < 10; n++) {
        if(this.isValid(arrayPuzzle, row, col, n).valid) {
          let impl = implication(arrayPuzzle, row, col, n);
          // console.log(impl);
          if(recursion(arrayPuzzle)) return true;

          backtrack++;
          undoImplication(arrayPuzzle, impl);
        }
      }

      return false;
    };

    recursion(puzzle);

    console.log('backtrack: ' + backtrack);
    return {solution: puzzle.map(a => a.join('')).join('')};
  }
}

module.exports = SudokuSolver;

