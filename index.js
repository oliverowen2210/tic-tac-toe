CSSGameObjects = document.querySelectorAll('.gameobject');

const player = (name, marker, color, score, CPU=false) => {

let data = {
    name,
    marker, //'x' or 'o'
    color,
    score,
    CPU,
  };

  const markSquare = (target) => {
    target.mark(data.marker);
    game.endTurn(data.name);
  };

  const CPURound = () => {
    let validSquares = [];
    if (data.CPU) {
      for (let square of game.squares) {
        if (!square.getMark()) {
          validSquares.push(square.getId());
          console.log(validSquares)
      }};
      choice = validSquares[Math.floor(Math.random() * validSquares.length)]
      console.log(choice);
      for (let square of game.squares) {
        if (square.getId() == choice) {
          setTimeout(function () {markSquare(square)}, 1000);
          return;
        };
    }};
  };

  const getName = () => data.name;

  const getColor = () => data.color;

  const getMarker = () =>  data.marker;

  return {markSquare, CPURound, getName, getColor, getMarker};
};

const square = (selector) => {
  const html = document.querySelector(selector);

  const xPos = Math.floor(Number((html.dataset.id-1)%3));
  const yPos = Math.floor(Number((html.dataset.id-1)/3));

  let marker = '';
  let id = html.dataset.id;

  const clearMarkers = () => {
    html.classList.remove('xmarker');
    html.classList.remove('omarker');
    html.classList.remove('hover');
  };

  const mark = (m) => {
    if (!marker){
      clearMarkers()
      marker = m;
      html.classList.add(`${marker}marker`);
    }
  };

  const getMark = () => marker;

  const getId = () => Number(id);

  const getPosition = () => [xPos, yPos];

  const setBG = (color) => {
    html.style.backgroundColor = color;
  }

  return {html, mark, getMark, getId, getPosition, setBG};
};

const game = (() => {
  let squares = [];
  let players = [];
  let turn = 0;

  const getTurn = () => turn;

  const endTurn = () => {
    if (r = checkSquares()) {
      setTimeout(function() {win(players[turn].getName(), r)}, 500);
    }
    else {
      switch(turn) {
        case null:
          break;
        case 0:
          turn = 1;
          computer.CPURound();
          break;
        case 1:
          turn = 0;
          break;
      };
    };
  };

  const paintSquares = (data) => {
    color = players[turn].getColor()
    switch(data[1]) {
    case 'column':
      for(let i = data[0];i<9;i+=3) {
        game.squares[i].setBG(color);
      };
      break;

    case 'row':
      let j = data[0]+3;
      for(let i = data[0];i<j;i++) {
        game.squares[i].setBG(color);
      };
      break;
    
    case 'back':
      for(let i=0;i<=8;i+=4) {
        game.squares[i].setBG(color);
      };
      break;

    case 'forward':
      for(let i=2;i<=6;i+=2) {
        game.squares[i].setBG(color);
      };
      break;
    };
  };

  const win = (name, paintData) => {
    paintSquares(paintData);
    endGame();
  }

  const checkColumns = () => {
    for(let i=0;i<3;i++) {
      let m = game.squares[i].getMark();
      if (!m) continue;
      if (game.squares[i+3].getMark() == m && 
          game.squares[i+6].getMark() == m) return [i, 'column'];
    };
  };

  const checkRows = () => {
    for(let i=0;i<7;i+=3) {
      let m = game.squares[i].getMark();
      if (!m) continue;
      if (game.squares[i+1].getMark() == m &&
          game.squares[i+2].getMark() == m) return [i, 'row'];
    };
  };

  const checkDiagonals = () => {
      let m = game.squares[0].getMark();
      if (m) {
        if (game.squares[4].getMark() == m &&
          game.squares[8].getMark() == m) return [0, 'back'];
      }

      m = game.squares[2].getMark();
      if (m) {
        if (game.squares[4].getMark() == m &&
            game.squares[6].getMark() == m) return [0, 'forward'];
      }
  };
  

  const checkSquares = () => {
    winCheck = checkColumns();
    if (!winCheck) winCheck = checkRows();
    if (!winCheck) winCheck = checkDiagonals();
    return winCheck;
  };

  const endGame = () => {
    turn = null;
  };

  const initPlayers = () => {
    you = Object.assign({}, player('you', 'x', 'green', 0));
    computer = Object.assign({}, player('computer', 'o', 'red', 0, true));
    players.push(you, computer);
  };

  const initSquares = () => {
    for (let square of squares) {

      square.html.addEventListener('mouseover', (e) => {

      if (!square.html.classList.contains('xmarker') &&
      !square.html.classList.contains('omarker') &&
      game.getTurn() == 0) {

        square.html.classList.add('hover');

      }});

      square.html.addEventListener('mouseout', (e) => {
        square.html.classList.remove('hover');

      });

      square.html.addEventListener('click', (e) => {
        if (game.getTurn() == 0 &&
            square.getMark() == '') {
         you.markSquare(square);
      }});
    }};

    const init = () => {
      initSquares();
      initPlayers();
    };
    

  return {getTurn, endTurn, squares, init};
})();

CSSGameObjects.forEach((obj) => {
  game.squares.push(square(`[data-id='${obj.dataset.id}']`));
});


game.init();