CSSBoard = document.querySelector('#board');
CSSGameObjects = document.querySelectorAll('.gameobject');
reset = document.querySelector('#reset');

const player = (mark) => ({
  mark,

  markObject(object) {
    object.classList.add(`${mark}marker`)
  },
})

const you = (() => {
  return Object.assign({}, player('x'))
})();

const computer = (() => {
  return Object.assign({}, player('o'))
})();

const gameBoard = (function() {
  gameObjects = [];
  turn = 'x';
  return {gameObjects, turn};

})();

const gameObject = (id) => {
  let data = {
    id,
    x: (Math.floor((id-1)%3)),
    y: (Math.floor((id-1)/3)),
    marker: 2,
  };

  getPos = () => {
    return [data.x, data.y];
  }
  return {getPos};
}


CSSGameObjects.forEach((obj) => {
  gameBoard.gameObjects.push(gameObject(Number(obj.dataset.id)));
  obj.addEventListener('mouseover', (e) => {
    if (!obj.classList.contains('xmarker') && !obj.classList.contains('omarker')) {
    obj.classList.add('hover')
    };
  });
  obj.addEventListener('mouseout', (e) => obj.classList.remove('hover'))
  obj.addEventListener('click', (e) => you.markObject(obj));
});

