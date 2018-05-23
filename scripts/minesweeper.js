let ROWS = 0, COLUMNS = 0, MINES = 0, GRID = [];
let FAIL_DIALOG = WIN_DIALOG = START_DIALOG = null;
let timer = 0, gameEnded = false, intervalTimer;
let scoreboardLoaded = false, scoreSaved = false;

const COUNTER = {
  value: 0,
  func: undefined,
  setValue: (val) => {
    COUNTER.value = val
    if(typeof COUNTER.func != undefined) COUNTER.func()
  },
  setCallback: (func) => {
    COUNTER.func = func;
  }
}

let initModel = (rows, columns, mines) => {
  GRID = [];
  scoreSaved = scoreboardLoaded = false;
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

// -----------------------------------------------------
// --------------- FONCTIONS D'AFFICHAGE ---------------
// -----------------------------------------------------
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
let displayMetadata = () => {
  $('#ms-box').append('<div class="metadata"><p>Mines restantes : <span id="counter">'+(MINES-COUNTER.value)+'</span> / '+MINES+'<br/> Temps écoulé : <span id="timer">'+(timer)+'</span></p></div>')
  $('#ms-box').append('<div class="scoreboard"><h2>DERNIERS SCORES</h2><div id="loader"><img src="images/loader.gif"/></div><ul id="scoreboard"></ul></div>')
  COUNTER.setCallback(callbackMetadata);
  intervalTimer = setInterval(callbackTimer, 1000);
}

// --------------------------------------------------
// --------------- FONCTIONS CALLBACK ---------------
// --------------------------------------------------
let callbackMetadata = () => {
  $('#counter').html(MINES-COUNTER.value)
}
let callbackTimer = () => {
  timer ++;
  let min = Math.floor(timer / 60);
  let sec = ('0' + (timer % 60)).slice(-2);
  $('#timer').text(min+':'+sec)
}

// -----------------------------------------------------
// --------------- FONCTIONS APPEL SCORE ---------------
// -----------------------------------------------------
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

// --------------------------------------------------
// ---------------- FONCTIONS DU JEU ----------------
// --------------------------------------------------
let reveal = (cell) => {
  if (!$(cell).hasClass('flagged')) {
    if (!$(cell).hasClass('revealed')) {
      $(cell).addClass('revealed')
      $(cell).off('contextmenu')
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
        if (isVictory()) endGame(true)
      } else endGame(false)
    }
  }
}
let flag = (cell) => {
  let val = $(cell).hasClass('flagged') ? COUNTER.value - 1 : COUNTER.value + 1
  COUNTER.setValue(val)
  $(cell).toggleClass('flagged')
}

let saveScore = () => {
  let playerName = prompt("Entrez votre nom")
  if(playerName) {
    $.post('http://www.louiecinephile.fr/cesi/js/save.php',
      { name: playerName, time: timer },
      (response) => {
        if(response == 1) {
          console.log("L'appel est réussi");
        }
        else {
          console.log("L'appel a échoué");
        }
      }
    );
  }
}
let getScores = (max) => {
  $.getJSON("http://www.louiecinephile.fr/cesi/js/scores.php?max="+max+"&t="+$.now(), function(data) {
    $("#loader").hide()
    var items = [];
    $.each(data,function(key, val) {
      let min = Math.floor(val.time / 60);
      let sec = ('0' + (val.time % 60)).slice(-2);
      items.push("<li>"+val.name+" - "+min+":"+sec+" minutes</li>");
    });
    $("#scoreboard").html(items.join(""))
  });
}
let isVictory = () => {
  const total = ROWS * COLUMNS;
  const revealed = $('.revealed').length
  return total - revealed == MINES ? true : false;
}
let prepareDialogs = () => {
  FAIL_DIALOG = $("#dialogLose").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "Voir la grille",
        click: function () {
          $(this).dialog("close");
        }
      },{
        text:"Relancer",
        click: function() {
          $(this).dialog("close");
          $('#dialogStart').dialog("open");
        }
      }
    ]
  });
  WIN_DIALOG = $("#dialogWin").dialog({
    autoOpen: false,
    buttons: [
      {
        text: "Voir la grille",
        click: function () {
          $(this).dialog("close");
        }
      },{
        text:"Relancer",
        click: function() {
          $(this).dialog("close");
          $('#dialogStart').dialog("open");
        }
      }
    ]
  });
  START_DIALOG = $( "#dialogStart" ).dialog({
    autoOpen: false,
    height: 400,
    width: 400,
    modal: true,
    buttons: {
      "Démarrer": configStart
    },
    close: function() {

    }
  });
}
let configStart = () => {
  ROWS = $('#lignes').val()
  COLUMNS = $('#colonnes').val()
  MINES = $('#bombs').val()
  START_DIALOG.dialog( "close" )
  startGame()
  return true;
}
let startGame = () => {

  initModel(ROWS, COLUMNS, MINES);
  displayGridJquery();
  displayMetadata();
  getScores(10);
}
let endGame = (win) => {
  gameEnded = true;
  clearInterval(intervalTimer);
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
  if (win) {
    $("#dialogWin").dialog("open");
    if(!scoreSaved) {
      saveScore();
      getScores(10);
      scoreSaved = true
    }
  }
  else $('#dialogLose').dialog("open");
}


prepareDialogs();
$('#dialogStart').dialog("open");
