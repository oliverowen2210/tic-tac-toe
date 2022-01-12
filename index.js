HTMLGameBoard = document.getElementById('board');
HTMLPlayerTallyName = document.getElementById('player-name');
HTMLPlayerTallyScore = document.getElementById('player-score');
HTMLComputerTallyScore = document.getElementById('computer-score');
HTMLResetButton = document.getElementById('reset');

const player = (name, marker, color, scoreHTML, CPU=false) => {

let data = {
    name,
    marker, //'x' or 'o'
    color,
    score: 0,
    scoreHTML,
    CPU,
  };

  const markSquare = (target) => {
    target.mark(data.marker);
    game.endTurn(data.name);
  };

  const CPURound = () => {
    let validSquares = [];
    if (data.CPU) {
      for (let square of game.getSquares()) {
        if (!square.getMark()) {
          validSquares.push(square.getId());
          console.log(validSquares)
      }};
      choice = validSquares[Math.floor(Math.random() * validSquares.length)]
      console.log(choice);
      for (let square of game.getSquares()) {
        if (square.getId() == choice) {
          setTimeout(function () {markSquare(square)}, 1000);
          return;
        };
    }};
  };

  const getName = () => data.name;

  const getColor = () => data.color;

  const getMarker = () =>  data.marker;

  const addPoint = () => data.scoreHTML.textContent = ++data.score;

  return {markSquare, CPURound, getName, getColor, getMarker, addPoint};
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

  return {html, mark, getMark, getId, getPosition};
};

const game = (() => {
  let squares = [];
  let players = [];
  let turn = 0;

  const getSquares = () => squares;
  const addSquare = (arg) => squares.push(arg);
  const paintSquare = (id, color) => squares[id].html.style.backgroundColor = color;

  const setSquareHover = (id) => {
    squares[id].html.addEventListener('mouseover', (e) => {
      if (!squares[id].html.classList.contains('xmarker') &&
      !squares[id].html.classList.contains('omarker') &&
      game.getTurn() == 0) {
        squares[id].html.classList.add('hover');
      }});
  };

  const setSquareMouseOut = (id) => {
    squares[id].html.addEventListener('mouseout', (e) => {
      squares[id].html.classList.remove('hover');
    });
  };

  const setSquareClick = (id) => {
    squares[id].html.addEventListener('click', (e) => {
      if (game.getTurn() == 0 &&
      squares[id].getMark() == '') {
          you.markSquare(squares[id]);
    }});
  };

  const setSquareListeners = (id) => {
    setSquareHover(id);
    setSquareMouseOut(id);
    setSquareClick(id);
  }

  const clearSquares = () => {
    squares = [];
  };

  const getTurn = () => turn;
  const setTurn = (num) => turn = parseInt(num);
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
        paintSquare(i, color);
      };
      break;

    case 'row':
      let j = data[0]+3;
      for(let i = data[0];i<j;i++) {
        paintSquare(i, color);
      };
      break;
    
    case 'back':
      for(let i=0;i<=8;i+=4) {
        paintSquare(i, color);
      };
      break;

    case 'forward':
      for(let i=2;i<=6;i+=2) {
        paintSquare(i, color);
      };
      break;
    };
  };

  const win = (name, paintData) => {
    paintSquares(paintData);
    endGame();
  }

  const endGame = () => {
    players[turn].addPoint();
    turn = null;
  };

  const checkColumns = () => {
    for(let i=0;i<3;i++) {
      let m = squares[i].getMark();
      if (!m) continue;
      if (squares[i+3].getMark() == m && 
          squares[i+6].getMark() == m) return [i, 'column'];
    };
  };

  const checkRows = () => {
    for(let i=0;i<7;i+=3) {
      let m = squares[i].getMark();
      if (!m) continue;
      if (squares[i+1].getMark() == m &&
          squares[i+2].getMark() == m) return [i, 'row'];
    };
  };

  const checkDiagonals = () => {
      let m = squares[0].getMark();
      if (m) {
        if (squares[4].getMark() == m &&
          squares[8].getMark() == m) return [0, 'back'];
      }

      m = squares[2].getMark();
      if (m) {
        if (squares[4].getMark() == m &&
            squares[6].getMark() == m) return [0, 'forward'];
      }
  };
  
  const checkSquares = () => {
    winCheck = checkColumns();
    if (!winCheck) winCheck = checkRows();
    if (!winCheck) winCheck = checkDiagonals();
    return winCheck;
  };
 
  const initPlayers = () => {
    you = Object.assign({}, 
        player('you', 'x', 'green', HTMLPlayerTallyScore));

    computer = Object.assign({},
        player('computer', 'o', 'red', HTMLComputerTallyScore, true));

    players.push(you, computer);
  };  
  
  return {squares, getSquares, addSquare, setSquareListeners, getTurn, setTurn,
     endTurn, initPlayers, clearSquares};
})();

const board = (() => {
  let html = HTMLGameBoard;

  const create = (size=9) => {
    for(let i=1;i<=size;i++) {
      gameObject = document.createElement('div');
      gameObject.classList.add('gameobject');
      gameObject.dataset.id = i;
      html.appendChild(gameObject);
    };
  };

  const initHTML = () => {
    HTMLGameObjects = document.querySelectorAll('.gameobject');
    HTMLGameObjects.forEach((obj) => {
      game.addSquare(square(`[data-id='${obj.dataset.id}']`));
    });

    for (let i=0;i<game.getSquares().length;i++) {
      game.setSquareListeners(i);
    };

    HTMLResetButton.addEventListener('click', (e) => {
      restart()
    });
    };

  const init = () => {
    create();
    initHTML();
  };

  const remove = () => {
    while(html.hasChildNodes()) {
      html.removeChild(html.firstChild);
    };
    game.clearSquares();
  };

  const restart = () => {
    remove();
    init();
    game.setTurn(0);
  };

  const startgame = (() => {
    restart();
    game.initPlayers()
  })();

  return {restart};
})();
