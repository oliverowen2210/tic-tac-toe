CSSGameObjects = document.querySelectorAll('.gameobject');

const player = (name, marker, CPU=false) => {
let playing = true;

let data = {
    name,
    marker, //'x' or 'o'
    CPU,
  };

  const getMarker = () => {
    return data.marker;
  };

  const markSquare = (target) => {
    target.mark(data.marker);
    game.endTurn();
  };
  const changeTurn = (state=undefined) => {
    if (state||state===false) playing = state;
    else playing = !playing;
  }

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
  return {playing, markSquare, getMarker, changeTurn, CPURound};
};

const square = (selector) => {
  const html = document.querySelector(selector);

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

  const getMark = () => {
    return marker;
  }

  const getId = () => {
    return Number(id);
  }

  return {html, mark, getMark, getId};
};

const game = (() => {
  let squares = [];
  let turn = 'x';

  const getTurn = () => turn;

  const endTurn = () => {
    turn = (turn=='x') ? 'o' : 'x';
    if (turn == 'o') computer.CPURound();
  }

  const initPlayers = () => {
    you = Object.assign({}, player('You', 'x'));
    computer = Object.assign({}, player('CPU', 'o', true));
  }

  const initSquares = () => {
    for (let square of squares) {

      square.html.addEventListener('mouseover', (e) => {

      if (!square.html.classList.contains('xmarker') &&
      !square.html.classList.contains('omarker') &&
      game.getTurn() == 'x') {

        square.html.classList.add('hover');

      }});

      square.html.addEventListener('mouseout', (e) => {
        square.html.classList.remove('hover');

      });

      square.html.addEventListener('click', (e) => {
        if (game.getTurn() == 'x') {
         you.markSquare(square);
      }});
    }};

    const init = () => {
      initSquares();
      initPlayers();
    }
    

  return {getTurn, endTurn, squares, init};
})();

CSSGameObjects.forEach((obj) => {
  game.squares.push(square(`[data-id='${obj.dataset.id}']`));
});


game.init();