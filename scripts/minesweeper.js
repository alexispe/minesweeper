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
}

let displayGrid = () => {
  let htmlData = '';
  htmlData += '<table>';

  for (let r = 0; r < GRID.length; r++) {
    htmlData += '<tr>';
    for (let c = 0; c < GRID[r].length; c++) {
      htmlData += '<td>';
      htmlData += GRID[r][c] ? 'X' : '-';
      htmlData += '</td>';
    }
    htmlData += '</tr>';
  }

  let x = document.getElementById("ms-box").innerHTML = '<div id="ms-grid">'+htmlData+'</div>';
}
let displayGridJquery = () => {
  $('#ms-box').html('<div id="ms-grid"></div>');
  let htmlData = '';
  htmlData += '<table>';

  for (let r = 0; r < GRID.length; r++) {
    htmlData += '<tr>';
    for (let c = 0; c < GRID[r].length; c++) {
      htmlData += '<td>';
      htmlData += GRID[r][c] ? 'X' : '-';
      htmlData += '</td>';
    }
    htmlData += '</tr>';
  }

  $('#ms-grid').html(htmlData);
}

let getPosition = (cell) => {
  let x = y = 0;
  let index = $("td").index(cell);

  let col = index % COLUMNS;
  let row = Math.floor(index / COLUMNS);

  return [col,row]
}
let reveal = (cell) => {
  if(!$(cell).hasClass('revealed')) {
    $(cell).addClass('revealed')
    let pos = getPosition(cell)
    // let number = getNumber(pos[x],pos[y])
    // if(number > 0) $(cell).text(number)
    // //else 
  }
}

let startGame = () => {
  initModel(ROWS,COLUMNS,MINES);
  displayGrid();
}

startGame();

$('td').click(function() {
  console.log($(this));
  getPosition($(this))
  reveal($(this))
})
