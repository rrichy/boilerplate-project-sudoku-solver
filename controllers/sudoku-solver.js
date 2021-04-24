const REGION_START_INDEX = [ [0, 3, 6], [27, 30, 33], [54, 57, 60] ];

class SudokuSolver {

  validate(puzzleString) {
    if(!puzzleString.split('').every(char => '123456789.'.includes(char))) return { error: 'Invalid characters in puzzle' };
    
    if(puzzleString.length !== 81) return { "error": "Expected puzzle to be 81 characters long" };
    
    return true;
  }

  transformCoordinate(coordinate) {
    coordinate = coordinate.toLowerCase();
    return 9 * (coordinate.charCodeAt(0) - 'a'.charCodeAt()) + (coordinate.charCodeAt(1) - '1'.charCodeAt());
  }

  checkRowPlacement(puzzleString, index, value) {
    if(value === '.') return true;

    const START = 9 * Math.floor(index / 9);
    const WHOLE_ROW = puzzleString.slice(START, START + 9);
    const ROW = WHOLE_ROW.slice(0, index % 9) + WHOLE_ROW.slice(1 + index % 9);

    return !ROW.includes(value); // returns true if given value is valid in index
  }

  checkColPlacement(puzzleString, index, value) {
    if(value === '.') return true;

    const COL = puzzleString.split('').filter((a, i) => i % 9 === index % 9 && i !== index);

    return !COL.includes(value); // returns true if given value is valid in index
  }

  checkRegionPlacement(puzzleString, index, value) {
    if(value === '.') return true;

    const REGION_START = REGION_START_INDEX[Math.floor(index / 27)][Math.floor((index % 9) / 3)];
    let region = '';
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        let k = (REGION_START + j) + 9 * i;
        if(k !== index) region += puzzleString[k];
      }
    }

    return !region.includes(value); // returns true if given value is valid in index
  }

  solve(puzzleString) {
    for(let i = 0; i < 81; i++) {
      if([!this.checkRowPlacement(puzzleString, i, puzzleString[i]), !this.checkColPlacement(puzzleString, i, puzzleString[i]), !this.checkRegionPlacement(puzzleString, i, puzzleString[i])].some(a => a === true)) return { error: 'Puzzle cannot be solved' };
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

    // console.log(puzzle);

    let count, sub = JSON.stringify(puzzle);
    for(count = 0;; count++){
      for(let i = 0; i < 81; i++) {
        let row_start = 9 * Math.floor(i / 9);
        let region_start = REGION_START_INDEX[Math.floor(i / 27)][Math.floor((i % 9) / 3)];
        
        if(puzzle[i].length === 1) {
          for(let x = 0; x < 9; x++) {
            // row
            if(row_start + x !== i) puzzle[row_start + x] = puzzle[row_start + x].split('').filter(a => a !== puzzle[i]).join('');
            // col
            if(9 * x + (i % 9) !== i) puzzle[9 * x + (i % 9)] = puzzle[9 * x + (i % 9)].split('').filter(a => a !== puzzle[i]).join('');
            // region
            if((region_start + 9 * Math.floor(x / 3)) + x % 3 !== i) puzzle[(region_start + 9 * Math.floor(x / 3)) + x % 3].split('').filter(a => a !== puzzle[i]).join('');
          }
        }
        else {
          let possible = puzzle[i].split('');

          let row = puzzle.slice(row_start, i % 9).concat(puzzle.slice(1 + i % 9)).join(''); // row, excluding the current index, i
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
      }

      if(JSON.stringify(puzzle) === sub) break;
      else sub = JSON.stringify(puzzle);
    }

    console.log('solved at count: ' + count);
    console.log(puzzle.join(''));
    return puzzle.join('');
  }
}

module.exports = SudokuSolver;

