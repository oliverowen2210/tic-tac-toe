const HTMLGameBoard = document.getElementById('board');
const HTMLSettings = document.getElementById('player-settings');
const HTMLContent = document.getElementById('content');
const HTMLMessage = document.getElementById('message');
const HTMLPlayerOneTallyName = document.getElementById('p1name');
const HTMLPlayerOneCPUDifficulty = document.getElementById('p1CPUdifficulty')
const HTMLPlayerOneTallyScore = document.getElementById('p1score');
const HTMLPlayerTwoTallyName = document.getElementById('p2name');
const HTMLPlayerTwoCPUDifficulty = document.getElementById('p2CPUdifficulty')
const HTMLPlayerTwoTallyScore = document.getElementById('p2score');
const HTMLStartButton = document.getElementById('start-button');
const HTMLResetButton = document.getElementById('reset');
const HTMLPlayerOneName = document.getElementById('p1namepick');
const HTMLPlayerOnePerson = document.getElementById('p1person');
const HTMLPlayerOneCPU = document.getElementById('p1CPU');
const HTMLPlayerTwoName = document.getElementById('p2namepick');
const HTMLPlayerTwoPerson = document.getElementById('p2person');
const HTMLPlayerTwoCPU = document.getElementById('p2CPU');


const player = (name, marker, color, scoreHTML, CPU=false, id, CPUDifficulty) => {

  let data = {
      name,
      marker, //'x' or 'o'
      color,  //for PaintSquares() when winning a game
      score: 0,
      scoreHTML,
      CPU,
      id, //0 or 1, same as turn
      CPUDifficulty
  };

  let minMaxFloor;
    
  const markSquare = (target) => {
    target.setMark(data.marker);
    target.updateDisplay();
    console.log(`${data.name} marked square #${target.getId()}.`)
    game.endTurn(data.id);
  };

  //sets the minimum roll for a minMaxed move, based on chosen difficulty
  const setMinMaxFloor = () => {
    switch(data.CPUDifficulty) {
      case 'Easy':
        minMaxFloor = 1;
        break;
      case 'Hard':
        minMaxFloor = 0.33;
        break;
      case 'Impossible':
        minMaxFloor = 0;
        break;
      default:  //will be picked by 'Normal' as well
        minMaxFloor = 0.66;
        break;
    };
  };

  const rollForMinMax = () => {
    if (!minMaxFloor) setMinMaxFloor();
    let roll = Math.random();
    return (roll >= minMaxFloor) ? true : false;
  }

  
  //rolls to see if it should minMax or pick a random square
  const CPURound = () => {
    if (rollForMinMax() == true) {  
      console.log(`Minimax roll succesful, calculating possible outcomes...`);
      let choice = getBestChoice();
      setTimeout(function () { markSquare(choice)}, 1000);
    }
    else {
      console.log(`Minimax roll failed, picking random square...`);
      let validSquares = game.getAvailableMoves(game.getSquares());
      let choice = validSquares[Math.floor(Math.random() * validSquares.length)]
      setTimeout(function () {markSquare(choice)}, 1000);
      return;
    };
  };

  //scores available moves using minMax() then returns the highest scoring one
  const getBestChoice = () => {
    let bestMove;
    let score = -999;
    let marker = data.marker;
    let currentBoard = game.getSquares();

    for (let move of game.getAvailableMoves(currentBoard)) {
      move.setMark(marker);
      moveScore = minMax(currentBoard, marker, true, 0);
      move.clearMark();
      if (moveScore > score) {
        score = moveScore;
        bestMove = move;
      };
    };
    return bestMove;
  };

  //minMax algorithm, scores the board if in an end state
  //recursively calls itself on all possible moves otherwise,
  //then returns the highest possible score it finds
  const minMax = (gameBoard, marker, playing, depth) => {
    let winData = game.isGameOver(gameBoard, marker);
    if (winData && winData[0] == 'win') {
      if (playing) return (10 - depth);
      else return (-10 - depth);
    }
    else if (winData && winData[0] == 'tie') return (0 - depth);

    playing = !playing;
    let best = (playing) ? -100 : 100;

    for (let move of game.getAvailableMoves(gameBoard)) {
      let nextMarker = (marker == 'x') ? 'o' : 'x';

      move.setMark(nextMarker);
      let value = minMax(gameBoard, nextMarker, playing, depth+1);
      move.clearMark();

      if (playing) best = Math.max(best, value);
      else best = Math.min(best, value);
    };
    return best;
  };


  const getName = () => data.name;

  const getColor = () => data.color;

  const getMarker = () =>  data.marker;

  const isCPU = () => data.CPU;

  const addPoint = () => data.scoreHTML.textContent = ++data.score;

  return {markSquare, CPURound, minMax, getName, getColor, getMarker, isCPU, addPoint};
};

const square = () => {
  let marker = '';
  let html;
  let id;

  const setHTML = (HTML) => html = HTML;
  const getHTML = () => html;

  const setId = (Id) => id = Id;
  const getId = () => id;

  const clearClassList = () => {
    html.classList.remove('xmarker');
    html.classList.remove('omarker');
    html.classList.remove('hoverx');
    html.classList.remove('hovero');
  };

  const setMark = (m) => {
    if (!marker) marker = m;
  };

  const getMark = () => marker;

  const clearMark = () => marker = '';

  const updateDisplay = () => {
    clearClassList()
    html.classList.add(`${marker}marker`);
  }

  return {html, setHTML, getHTML, setId, getId, setMark, getMark, clearMark, updateDisplay};
};

const game = (() => {
  let squares = [];
  let players = [];
  let turn = 0;

  const setBoard = (board) => squares = board;
  const getState = (board=squares) => {
    return board.map((sqr) => sqr.getMark());
  };

  const getSquares = () => squares;
  const addSquare = (arg, temp) => squares.push(arg);
  const paintSquare = (id, color) => {
    squares[id].getHTML().style.backgroundColor = color;
    squares[id].getHTML().style.boxShadow = `0px 0px 50px ${color}`;
  };

  const clearSquares = () => {
    squares = [];
  };

  const getPlayers = () => players;
  const getPlaying = () => players[turn];

  const getTurn = () => turn;
  const setTurn = (num) => turn = parseInt(num);
  const endTurn = (turnPlayerId) => {

    winData = isGameOver(squares, turnPlayerId);
    if (winData) {
      setTimeout(function() {win(winData)}, 500);
    }

    else {
      switch(turn) {case 0:
          turn = 1;
          console.log(`${players[turn].getName()}'s turn.`)
          if (p2.isCPU()) p2.CPURound();
          break;
        case 1:
          turn = 0;
          console.log(`${players[turn].getName()}'s turn.`)
          if (p1.isCPU()) p1.CPURound();
          break;
        default:
          break;
      };
    };
  };

  const paintSquares = (data) => {
    color = players[turn].getColor()
    switch(data[3]) {
    case 'column':
      for(let i = data[2];i<9;i+=3) {
        paintSquare(i, color);
      };
      break;

    case 'row':
      let j = data[2]+3;
      for(let i = data[2];i<j;i++) {
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

  //'data' is passed by endTurn(), containing info about the winner
  const win = (data) => {
    if (data[0] == 'tie') {
      endGame('tie');
      message = 'It\'s a tie!';
      HTMLMessage.textContent = message;
      console.log(message);
    } else {
      paintSquares(data);
      message = `${players[turn].getName()} wins!`
      HTMLMessage.textContent = message;
      console.log(message);
      endGame();
    };
  };

  const endGame = (tie=false) => {
    if (!tie) players[turn].addPoint();
    turn = null;
  };

  const checkColumns = (board, id) => {
    for(let i=0;i<3;i++) {
      let m = board[i].getMark();
      if (!m) continue;
      if (board[i+3].getMark() == m && 
          board[i+6].getMark() == m) return ['win', game.getPlayers()[id].getName(), i, 'column'];
    };
  };

  const checkRows = (board, id) => {
    for(let i=0;i<7;i+=3) {
      let m = board[i].getMark();
      if (!m) continue;
      if (board[i+1].getMark() == m &&
      board[i+2].getMark() == m) return ['win', game.getPlayers()[id].getName(), i, 'row'];
    };
  };

  const checkDiagonals = (board, id) => {
      let m = board[0].getMark();
      if (m) {
        if (board[4].getMark() == m &&
        board[8].getMark() == m) return ['win', game.getPlayers()[id].getName(), 2, 'back'];
      };

      m = board[2].getMark();
      if (m) {
        if (board[4].getMark() == m &&
        board[6].getMark() == m) return ['win', game.getPlayers()[id].getName(), 6, 'forward'];
      };
  };

  const getAvailableMoves = (board, any) => {
  let validSquares = [];
    for (let square of board) {
      if (!square.getMark()) {
        validSquares.push(square);
        if (any) break;
    }};
  return (validSquares[0]) ? validSquares : false;
}
  

  const isGameOver = (board, id) => {
    if (id == 'x') id = 0;
    else if (id == 'o') id = 1;
    winData = checkColumns(board, id);
    if (!winData) winData = checkRows(board, id);
    if (!winData) winData = checkDiagonals(board, id);
    if (!winData && !getAvailableMoves(board, 'any')) winData = ['tie'];
    return winData;
  };
 
  const initPlayers = (p1type, p1name, p1diff, p2type, p2name, p2diff) => {
    p1 = player(p1name, 'x', 'green', HTMLPlayerOneTallyScore, p1type, 0, p1diff);
    p2 = player(p2name, 'o', 'red', HTMLPlayerTwoTallyScore, p2type, 1, p2diff);

    players.push(p1, p2);
  };  
  
  return {setBoard, getSquares, getState, addSquare, getPlayers, 
    getPlaying, getTurn, setTurn, endTurn, getAvailableMoves,
    isGameOver, initPlayers, clearSquares};
})();

const board = (() => {
  let html = HTMLGameBoard;

  let p1type = '';
  let p2type = 'CPU';

  let p1name;
  let p2name;

  let p1difficulty;
  let p2difficulty;

  const createHTML = (board) => {
    for(let i=1;i<=9;i++) {
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
      };
      html.appendChild(gameObject);
      board[i-1].setHTML(gameObject);
      board[i-1].setId(i);
      setSquareListeners(board[i-1], board[i-1].getHTML());
  };
  game.setBoard(board);
};

  const makeBoard = (copy=false, copyOf=game.getSquares()) => {
    let newBoard = [];
    for (let i = 1;i<=9;i++) {
      newBoard.push(square())
    };
    if (copy) {
      for (let i = 0;i<copyOf.length;i++) {
        newBoard[i].setMark(copyOf[i].getMark());
        newBoard[i].setId(copyOf[i].getId());
      };
    };
    return newBoard;
  };

  const init = () => {
    createHTML(makeBoard());
  };

  const setSquareHover = (square, HTML) => {
    HTML.addEventListener('mouseover', (e) => {
      if (game.getTurn()!==null &&
      !square.getMark() &&
      !game.getPlaying().isCPU()) {
        HTML.classList.add(`hover${game.getPlaying().getMarker()}`);
      }});
  };

  const setSquareMouseOut = (HTML) => {
    HTML.addEventListener('mouseout', (e) => {
      if (game.getTurn()!==null) {
        HTML.classList.remove(`hover${game.getPlaying().getMarker()}`);
    }});
  };

  const setSquareClick = (square, HTML) => {
    HTML.addEventListener('click', (e) => {
      if (game.getTurn()!==null &&
      !game.getPlaying().isCPU() &&
      square.getMark() == '') {
        game.getPlaying().markSquare(square);
    }});
  };

  const setSquareListeners = (square, HTML) => {
    setSquareHover(square, HTML);
    setSquareMouseOut(HTML);
    setSquareClick(square, HTML);
  }

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

    HTMLResetButton.addEventListener('click', (e) => {
      restart();
    });

    HTMLPlayerOnePerson.addEventListener('input', (e) => {
      HTMLPlayerOneCPUDifficulty.classList.add('hidden');
      HTMLPlayerOneName.classList.remove('hidden');
      HTMLPlayerOneName.value = '';
      p1type = '';
    })

    HTMLPlayerOneCPU.addEventListener('input', (e) => {
      HTMLPlayerOneName.classList.add('hidden');
      HTMLPlayerOneCPUDifficulty.classList.remove('hidden');
      HTMLPlayerOneName.value = 'CPU';
      p1type = 'CPU';
    })

    HTMLPlayerTwoPerson.addEventListener('input', (e) => {
      HTMLPlayerTwoCPUDifficulty.classList.add('hidden');
      HTMLPlayerTwoName.classList.remove('hidden');
      HTMLPlayerTwoName.value = '';
      p2type = '';
    })

    HTMLPlayerTwoCPU.addEventListener('input', (e) => {
      HTMLPlayerTwoName.classList.add('hidden');
      HTMLPlayerTwoCPUDifficulty.classList.remove('hidden');
      HTMLPlayerTwoName.value = 'CPU';
      p2type = 'CPU';
    })

    HTMLStartButton.addEventListener('click', (e) => {
      p1name = HTMLPlayerOneName.value;
      p2name = HTMLPlayerTwoName.value;

      p1difficulty = HTMLPlayerOneCPUDifficulty.value;
      p2difficulty = HTMLPlayerTwoCPUDifficulty.value;
  
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
      game.initPlayers(p1type, p1name, p1difficulty, p2type, p2name, p2difficulty);
      restart();
      
    })


  })();

  return {restart, makeBoard};
})();
