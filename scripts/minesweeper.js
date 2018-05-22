const ROWS = 9, COLUMNS = 9, MINES = 10;
const GRID = [];

let initModel = (rows, columns, mines) => {
  let columnsTemp = [], minesTemp = [];

  for (var m = 0; m < mines; m++) {
    let randomRow = Math.floor(Math.random() * Math.floor(ROWS));
    let randomCol = Math.floor(Math.random() * Math.floor(COLUMNS));
    minesTemp.push([randomRow,randomCol]);
  }
  console.log('array mines : ', minesTemp);

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















// let createMap = (height,width) => {
//   const map = [];
//   let html = '';
//   console.log(height,width);
//   for (let h = 0; h < height; h++) {
//     for (let w = 0; w < width; w++) {
//       $('.map').append('<div></div>');
//     }
//   }
//   console.log(html);
// }
//
// createMap(10,20)
// // console.log('kqgsvhjbn');
// //
// // console.log($('.map'));
// // $('.map').addClass('yo')
