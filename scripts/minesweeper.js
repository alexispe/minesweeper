const ROWS = 2, COLUMNS = 2, MINES = 1;
const GRID = [];
let FAIL_DIALOG = WIN_DIALOG = null;

let initModel = (rows, columns, mines) => {
  let columnsTemp = [], minesTemp = [];

  // Création du tableau minesTemp contenant les coordonnées des mines
  for (let m = 0; m < mines; m++) {
    let mineAdded = false;
    // Tant que une mine existe déjà aux coordonnées demandées, on recommence
    while (!mineAdded) {
      let randomRow = Math.floor(Math.random() * Math.floor(ROWS));
      let randomCol = Math.floor(Math.random() * Math.floor(COLUMNS));

      var alreadyExist = $.grep(minesTemp, function (element, index) {
        return element[0] == randomRow && element[1] == randomCol
      });
      if (!alreadyExist.length) {
        mineAdded = true
        minesTemp.push([randomRow, randomCol]);
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {

      var isMine = $.grep(minesTemp, function (element, index) {
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
      //htmlData += GRID[r][c] ? 'X' : '-';
      htmlData += '</td>';
    }
    htmlData += '</tr>';
  }

  let x = document.getElementById("ms-box").innerHTML = '<div id="ms-grid">' + htmlData + '</div>';
}
let displayGridJquery = () => {
  $('#ms-box').html('<div id="ms-grid"></div>');
  let htmlData = '';
  htmlData += '<table>';

  for (let r = 0; r < GRID.length; r++) {
    htmlData += '<tr>';
    for (let c = 0; c < GRID[r].length; c++) {
      htmlData += '<td>';
      //htmlData += GRID[r][c] ? 'X' : '-';
      htmlData += '</td>';
    }
    htmlData += '</tr>';
  }

  $('#ms-grid').html(htmlData);
  $('td').bind('click', function () {
    reveal(this);
  });
  $('td').bind('contextmenu', function (e) {
    e.preventDefault()
    flag(this);
  });
}

let getNumber = (posX, posY) => {
  let totalMines = 0;
  let startX = posX - 1
  let endX = posX + 1
  let startY = posY - 1
  let endY = posY + 1

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if ((x >= 0 && x < ROWS) && (y >= 0 && y < COLUMNS)) {
        let Cell = GRID[x][y]
        console.log('Row : ' + x + ' Col : ' + y + ' Val:' + Cell);
        if (x != posX || y != posY) {
          if (Cell) {
            totalMines++;
          }
        }
      }
    }
  }
  return totalMines;
}
let getPosition = (cell) => {
  let x = y = 0;
  let index = $("td").index(cell);

  let col = index % COLUMNS;
  let row = Math.floor(index / COLUMNS);

  return [row, col]
}
let reveal = (cell) => {
  if (!$(cell).hasClass('flagged')) {
    if (!$(cell).hasClass('revealed')) {
      $(cell).addClass('revealed')
      let pos = getPosition(cell)
      if (!GRID[pos[0]][pos[1]]) {
        let number = getNumber(pos[0], pos[1])
        if (number > 0) $(cell).text(number)
        else {
          let startX = pos[0] - 1
          let endX = pos[0] + 1
          let startY = pos[1] - 1
          let endY = pos[1] + 1

          for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
              if ((x >= 0 && x < ROWS) && (y >= 0 && y < COLUMNS)) {
                let index = x * COLUMNS + y
                reveal($('td').eq(index))
              }
            }
          }
        }
        if(isVictory()) endGame(true)
      } else endGame(false)
    }
  }
}
let flag = (cell) => {
  $(cell).toggleClass('flagged')
}

let isVictory = () => {
  const total = ROWS * COLUMNS;
  const revealed = $('.revealed').length
  return total - revealed === MINES ? true : false;
}
let prepareDialogs = () => {
  FAIL_DIALOG = $("#dialogLose").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "Voir la grille",
        click: function() {
          $(this).dialog( "close" );
        }
      }
    ]
  });
  WIN_DIALOG = $("#dialogWin").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "Voir la grille",
        click: function() {
          $(this).dialog( "close" );
        }
      }
    ]
  });
}
let startGame = () => {
  initModel(ROWS, COLUMNS, MINES);
  displayGridJquery();
}
let endGame = (win) => {
  $('td').off("click");
  $('td').off("contextmenu");
  $('td').css('cursor', 'default');
  for (let x = 0; x < GRID.length; x++) {
    for (let y = 0; y < GRID[x].length; y++) {
      let index = x * COLUMNS + y
      if (GRID[x][y]) {
        let index = x * COLUMNS + y
        $('td').eq(index).addClass('mined')
      }
    }
  }

  if(win) $("#dialogWin").dialog("open");
  else $('#dialogLose').dialog("open");
}

prepareDialogs();
startGame();
