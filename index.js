const HTMLGameBoard = document.getElementById('board');
const HTMLSettings = document.getElementById('player-settings');
const HTMLContent = document.getElementById('content');
const HTMLMessage = document.getElementById('message');
const HTMLPlayerOneTallyName = document.getElementById('p1name');
const HTMLPlayerOneTallyScore = document.getElementById('p1score');
const HTMLPlayerTwoTallyName = document.getElementById('p2name');
const HTMLPlayerTwoTallyScore = document.getElementById('p2score');
const HTMLStartButton = document.getElementById('start-button');
const HTMLResetButton = document.getElementById('reset');
const HTMLPlayerOneName = document.getElementById('p1namepick');
const HTMLPlayerOnePerson = document.getElementById('p1person');
const HTMLPlayerOneCPU = document.getElementById('p1CPU');
const HTMLPlayerTwoName = document.getElementById('p2namepick');
const HTMLPlayerTwoPerson = document.getElementById('p2person');
const HTMLPlayerTwoCPU = document.getElementById('p2CPU');


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
    let validSquares = game.checkEmpty();
      choice = validSquares[Math.floor(Math.random() * validSquares.length)]
      for (let square of game.getSquares()) {
        if (square.getId() == choice) {
          setTimeout(function () {markSquare(square)}, 1000);
          return;
        }};
  };

  const getName = () => data.name;

  const getColor = () => data.color;

  const getMarker = () =>  data.marker;

  const isCPU = () => data.CPU;

  const addPoint = () => data.scoreHTML.textContent = ++data.score;

  return {markSquare, CPURound, getName, getColor, getMarker, isCPU, addPoint};
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
    html.classList.remove('hoverx');
    html.classList.remove('hovero');
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
  const paintSquare = (id, color) => {
    squares[id].html.style.backgroundColor = color;
    squares[id].html.style.boxShadow = `0px 0px 50px ${color}`;
  };

  const setSquareHover = (id) => {
    squares[id].html.addEventListener('mouseover', (e) => {
      if (turn!==null &&
      !squares[id].getMark() &&
      !players[turn].isCPU()) {
        squares[id].html.classList.add(`hover${players[turn].getMarker()}`);
      }});
  };

  const setSquareMouseOut = (id) => {
    squares[id].html.addEventListener('mouseout', (e) => {
      if (turn!==null) squares[id].html.classList.remove(`hover${players[turn].getMarker()}`);
    });
  };

  const setSquareClick = (id) => {
    squares[id].html.addEventListener('click', (e) => {
      if (turn!==null &&
      !players[turn].isCPU() &&
      squares[id].getMark() == '') {
          players[turn].markSquare(squares[id]);
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

  const getPlayers = () => players;

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
          if (p2.isCPU()) p2.CPURound();
          break;
        case 1:
          turn = 0;
          if (p1.isCPU()) p1.CPURound();
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

  const win = (name, data) => {
    if (data == 'tie') {
      endGame('tie');
      HTMLMessage.textContent = 'It\'s a tie!';
    } else {
      paintSquares(data);
      HTMLMessage.textContent = `${players[turn].getName()} wins!`;
      endGame();
    };
  };

  const endGame = (tie=false) => {
    if (!tie) players[turn].addPoint();
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
      };

      m = squares[2].getMark();
      if (m) {
        if (squares[4].getMark() == m &&
            squares[6].getMark() == m) return [0, 'forward'];
      };
  };

  const checkEmpty = (any) => {
  let validSquares = [];
    for (let square of squares) {
      if (!square.getMark()) {
        validSquares.push(square.getId());
        if (any) break;
        console.log(validSquares)
    }};
  return validSquares;
}
  
  const checkSquares = () => {
    winCheck = checkColumns();
    if (!winCheck) winCheck = checkRows();
    if (!winCheck) winCheck = checkDiagonals();
    if (!winCheck && checkEmpty('any').length == 0) winCheck = 'tie';
    return winCheck;
  };
 
  const initPlayers = (p1type, p1name, p2type, p2name) => {
    p1 = Object.assign({}, 
        player(p1name, 'x', 'green', HTMLPlayerOneTallyScore, p1type));

    p2 = Object.assign({},
        player(p2name, 'o', 'red', HTMLPlayerTwoTallyScore, p2type));

    players.push(p1, p2);
  };  
  
  return {squares, getSquares, addSquare, setSquareListeners, getPlayers,
     getTurn, setTurn, endTurn, checkEmpty, initPlayers, clearSquares};
})();

const board = (() => {
  let html = HTMLGameBoard;

  const create = (size=9) => {
    for(let i=1;i<=size;i++) {
      gameObject = document.createElement('div');
      gameObject.classList.add('gameobject');
      gameObject.dataset.id = i;
      switch(i) {
        case 1:
          gameObject.classList.add('noL');
          gameObject.classList.add('noT');
          break;
        case 2:
          gameObject.classList.add('noT');
          break;
        case 3:
          gameObject.classList.add('noR');
          gameObject.classList.add('noT');
          break;
        case 4:
          gameObject.classList.add('noL');
          break;
        case 6:
          gameObject.classList.add('noR');
          break;
        case 7:
          gameObject.classList.add('noL');
          gameObject.classList.add('noB');
          break;
        case 8:
          gameObject.classList.add('noB');
          break;
        case 9:
          gameObject.classList.add('noB');
          gameObject.classList.add('noR');
          break;
      }
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
    HTMLMessage.textContent = 'Tic Tac Toe';
    if (game.getPlayers()[0].isCPU()) p1.CPURound();
  };

  const start = (() => {
    let p1type = '';
    let p2type = 'CPU';

    HTMLResetButton.addEventListener('click', (e) => {
      restart();
    });

    HTMLPlayerOnePerson.addEventListener('input', (e) => {
      HTMLPlayerOneName.disabled = false;
      HTMLPlayerOneName.value = '';
      p1type = '';
    })

    HTMLPlayerOneCPU.addEventListener('input', (e) => {
      HTMLPlayerOneName.disabled = true;
      HTMLPlayerOneName.value = 'CPU';
      p1type = 'CPU';
    })

    HTMLPlayerTwoPerson.addEventListener('input', (e) => {
      HTMLPlayerTwoName.disabled = false;
      HTMLPlayerTwoName.value = '';
      p2type = '';
    })

    HTMLPlayerTwoCPU.addEventListener('input', (e) => {
      HTMLPlayerTwoName.disabled = true;
      HTMLPlayerTwoName.value = 'CPU';
      p2type = 'CPU';
    })

    HTMLStartButton.addEventListener('click', (e) => {
      let p1name = HTMLPlayerOneName.value;
      let p2name = HTMLPlayerTwoName.value;
  
      HTMLSettings.classList.remove('display');
      HTMLSettings.classList.add('hidden');

      HTMLContent.classList.remove('hidden');
      HTMLContent.classList.add('display');

      if (p1name == 'CPU' && p2name == 'CPU') {
        p1name = 'CPU 1';
        p2name = 'CPU 2';
      };
      
      if (p1name === '') p1name = 'Player 1';
      if (p2name === '') p2name = 'Player 2';
      HTMLPlayerOneTallyName.textContent = p1name;
      HTMLPlayerTwoTallyName.textContent = p2name;
      game.initPlayers(p1type, p1name, p2type, p2name)
      restart();
    })


  })();

  return {restart};
})();
