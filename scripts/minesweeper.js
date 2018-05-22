const ROWS = 9, COLUMNS = 9, MINES = 10;
const GRID = [];

let initModel = (rows, columns, mines) => {
  let columnsTemp = [], minesTemp = [];

  // Création du tableau minesTemp contenant les coordonnées des mines
  for (let m = 0; m < mines; m++) {
    let mineAdded = false;
    // Tant que une mine existe déjà aux coordonnées demandées, on recommence
    while(!mineAdded) {
      let randomRow = Math.floor(Math.random() * Math.floor(ROWS));
      let randomCol = Math.floor(Math.random() * Math.floor(COLUMNS));

      var alreadyExist = $.grep(minesTemp, function(element, index){
        return element[0] == randomRow && element[1] == randomCol
      });
      if(!alreadyExist.length) {
        mineAdded = true
        minesTemp.push([randomRow,randomCol]);
      }
    }
  }
  // console.log('array mines : ', minesTemp);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {

      var isMine = $.grep(minesTemp, function(element, index){
        return element[0] == r && element[1] == c
      });

      columnsTemp.push(isMine.length ? true : false)
    }
    GRID.push(columnsTemp);
    columnsTemp = [];
  }
  // console.log('array grid : ',GRID);
}

let displayGrid = () => {
  $('#ms-box').html('<div id="ms-grid"></div>');
  let htmlData = '';
  htmlData += '<table>';

  for (let r = 0; r < GRID.length; r++) {
    htmlData += '<tr>';
    for (let c = 0; c < GRID[r].length; c++) {
      console.log();
      htmlData += '<td>';
      htmlData += GRID[r][c] ? 'X' : '-';
      htmlData += '</td>';
    }
    htmlData += '</tr>';
  }


  $('#ms-grid').html(htmlData);
}

let startGame = () => {
  initModel(ROWS,COLUMNS,MINES);
  displayGrid();
}

startGame();
