const REGION_START_INDEX = [ [0, 3, 6], [27, 30, 33], [54, 57, 60] ];
let run = true;

class SudokuSolver {

  validate(puzzleString) {
    if(!puzzleString.split('').every(char => '123456789.'.includes(char))) return { error: 'Invalid characters in puzzle' };
    
    if(puzzleString.length !== 81) return { "error": "Expected puzzle to be 81 characters long" };
    
    return true;
  }

  checkRowPlacement(puzzleString, row, col, value) {
    if(value === '.') return true;

    const ROW = puzzleString.match(/.{9}/g)[row]
      .split('')
      .filter((_,i) => i !== col);

    return !ROW.includes(value); // returns true if given value is valid in index
  }

  checkColPlacement(puzzleString, row, col, value) {
    if(value === '.') return true;

    const COL = puzzleString.split('')
      .filter((_, i) => i % 9 === col && i !== 9 * row + col);

    return !COL.includes(value); // returns true if given value is valid in index
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    if(value === '.') return true;

    const PUZZLE = puzzleString.match(/.{9}/g);
    const REGION_ROW = 3 * Math.floor(row / 3);
    const REGION_COL = 3 * Math.floor(col / 3);

    let region = '';
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(REGION_ROW + i !== row && REGION_COL + j !== col) region += PUZZLE[REGION_ROW + i][REGION_COL + j];
      }
    }

    return !region.includes(value); // returns true if given value is valid in index
  }

  isValid(puzzleString, row, col, value) {
    let errors = [];

    if(!this.checkRowPlacement(puzzleString, row, col, value)) errors.push('row');
    if(!this.checkColPlacement(puzzleString, row, col, value)) errors.push('column');
    if(!this.checkRegionPlacement(puzzleString, row, col, value)) errors.push('region');

    if(errors.length === 0) return {valid: true}; // returns true if value is valid in a cell
    return {valid: false, conflict: errors};
  }

  recur(sub_puzzle) { // array, length of 1 is fixed, more than 1 are possible values
    if(sub_puzzle.every(a => a.length === 1)) return;

    let index = sub_puzzle.findIndex(a => a.length > 1); // finds the first unfixed cell
    let sub = sub_puzzle.map(a => a.length > 1 ? '.' : a).join(''); // used for checking if a value is valid in a cell
    let vals = sub_puzzle[index]; // possible values

    for(let test_val of vals.split('')) {
      if(sub_puzzle.every(a => a.length === 1)) break;
      if(this.checkValidValue(sub, index, test_val)){
        sub_puzzle[index] = test_val;
        this.recur(sub_puzzle);
      }
    }
    if(!sub_puzzle.every(a => a.length === 1)) sub_puzzle[index] = vals;
    
    return;
  }

  solve(puzzleString) {
    for(let i = 0; i < 81; i++) {
      if(!this.checkValidValue(puzzleString, i, puzzleString[i])) return { error: 'Puzzle cannot be solved' };
    }

    let puzzle = puzzleString.split('').map((val, i) => {
      if(val.length === 1 && val !== '.') return val;

      let possible = '';
      for(let n = 1; n < 10; n++) {
        let row = this.checkRowPlacement(puzzleString, i, n),
          col = this.checkColPlacement(puzzleString, i, n),
          region = this.checkRegionPlacement(puzzleString, i, n);

        if([row, col, region].every(a => a === true)) possible += n;
      }

      return possible;
    });

    function removeNotesFromFixed(row_start, region_start, i) {
      for(let x = 0; x < 9; x++) {
        // row
        if(row_start + x !== i) puzzle[row_start + x] = puzzle[row_start + x].split('').filter(a => a !== puzzle[i]).join('');
        // col
        if(9 * x + (i % 9) !== i) puzzle[9 * x + (i % 9)] = puzzle[9 * x + (i % 9)].split('').filter(a => a !== puzzle[i]).join('');
        // region
        if((region_start + 9 * Math.floor(x / 3)) + x % 3 !== i) puzzle[(region_start + 9 * Math.floor(x / 3)) + x % 3].split('').filter(a => a !== puzzle[i]).join('');
      }
    }

    function fixNumIfAlone(row_start, region_start, i) {
      let possible = puzzle[i].split('');

      let row = puzzle.slice(row_start, row_start + i % 9).concat(puzzle.slice(row_start + 1 + (i % 9))).join(''); // row, excluding the current index, i
      let col = puzzle.filter((a, ind) => ind % 9 === i % 9 && ind !== i).join(''); // col, excluding the current index, i
      let region = '';  // region, excluding the current index, i
      for(let x = 0; x < 3; x++){
        for(let j = 0; j < 3; j++){
          let k = (region_start + j) + 9 * x;
          if(k !== i) region += puzzle[k];
        }
      }

      possible.forEach(pos => {
        if(!row.includes(pos)) {
          puzzle[i] = pos;
          return;
        }
        if(!col.includes(pos)) {
          puzzle[i] = pos;
          return;
        }
        if(!region.includes(pos)) {
          puzzle[i] = pos;
          return;
        }
      });
    }

    let count, sub = JSON.stringify(puzzle);
    while(true){
      for(let i = 0; i < 81; i++) {
        let row_start = 9 * Math.floor(i / 9);
        let region_start = REGION_START_INDEX[Math.floor(i / 27)][Math.floor((i % 9) / 3)];
        
        if(puzzle[i].length === 1) removeNotesFromFixed(row_start, region_start, i);
        else fixNumIfAlone(row_start, region_start, i);
      }

      if(JSON.stringify(puzzle) === sub) break;
      else sub = JSON.stringify(puzzle);
    }
console.log(puzzle);
    this.recur(puzzle);
    console.log(puzzle);
    return puzzle.join('');
  }
}

module.exports = SudokuSolver;

