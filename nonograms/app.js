import hints from './assets/js/hints.js';

const initialGame = {
  complexity: 10,
  level: 'rabbit',
};

const { complexity, level } = initialGame;

const generateColHints = (lvl, index) => {
  let currentSumHint = 0;
  const resultArrHintsCol = [];

  const arrHints = hints[complexity][lvl].reduce((acc, current) => {
    acc.push(current[index]);
    return acc;
  }, []);

  for (let i = 0; i <= arrHints.length; i += 1) {
    const current = arrHints[i];
    if (current) {
      currentSumHint += current;
    } else {
      resultArrHintsCol.push(currentSumHint);
      currentSumHint = 0;
    }
  }
  return resultArrHintsCol;
};

const generateRowHints = (lvl, index) => {
  let currentSumHint = 0;
  const resultArrHintsRow = [];

  const arrHints = hints[complexity][lvl][index];

  for (let i = 0; i <= arrHints.length; i += 1) {
    const current = arrHints[i];
    if (current) {
      currentSumHint += current;
    } else {
      resultArrHintsRow.push(currentSumHint);
      currentSumHint = 0;
    }
  }
  return resultArrHintsRow;
};

const initialMatrix = () => {
  const matrix = Array.from(
    { length: complexity },
    () => Array.from({ length: complexity }, () => 0),
  );
  return matrix;
};

const matrix = initialMatrix();

const isEqual = (arr, hint) => JSON.stringify(arr) === JSON.stringify(hint);

const body = document.querySelector('body');
body.classList.add('page');
const container = document.createElement('div');
container.classList.add('container');
body.prepend(container);
const timer = document.createElement('div');
timer.classList.add('timer');
container.append(timer);
const collsContainer = document.createElement('div');
collsContainer.classList.add('cols');
const rowsContainer = document.createElement('div');
rowsContainer.classList.add('rows');
const cellsContainer = document.createElement('div');
cellsContainer.classList.add('cells');

container.append(collsContainer, rowsContainer, cellsContainer);

const clickCell = (cell) => {
  cell.classList.toggle('fill');
  const row = Math.floor(cell.id / complexity);
  const id = cell.id % complexity;
  matrix[row][id] = matrix[row][id] === 0 ? 1 : 0;
  if (isEqual(matrix, hints[complexity][level])) {
    console.log('Вы выиграли!');
  }
  console.log(matrix);
};

for (let i = 0; i < complexity ** 2; i += 1) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', i);
  cellsContainer.append(cell);

  cell.addEventListener('click', (e) => clickCell(e.target));
  cell.addEventListener('contextmenu', (e) => {
    // e.preventDefault(); // НЕ ЗАБЫТЬ УБРАТЬ!
    console.log(e.target.offsetWidth, e.target.offsetHeight);
  });
}

rowsContainer.classList.add(`rows-${complexity}`);
collsContainer.classList.add(`cols-${complexity}`);
cellsContainer.classList.add(`cells-${complexity}`);

for (let i = 1; i <= complexity; i += 1) {
  const row = document.createElement('div');
  row.classList.add('row');

  const rowHints = generateRowHints(level, i - 1);
  rowHints.forEach((el) => {
    if (el !== 0) {
      const hint = document.createElement('p');
      hint.textContent = el;
      row.append(hint);
    }
  });

  const col = document.createElement('div');
  col.classList.add('col');

  const colHints = generateColHints(level, i - 1);
  colHints.forEach((el) => {
    if (el !== 0) {
      const hint = document.createElement('p');
      hint.textContent = el;
      col.append(hint);
    }
  });

  rowsContainer.append(row);
  collsContainer.append(col);
}

/* const ctx = canvas.getContext('2d');

canvas.width = cellsContainer.offsetWidth;
canvas.height = cellsContainer.offsetHeight; */

/* const cells = document.querySelectorAll('.cell');
cells.forEach((cell) => {
  cell.addEventListener('click', (e) => {
    const elementHeight = e.target.offsetHeight;
    const elementWidth = e.target.offsetWidth;
    const row = Math.ceil(e.target.id / 5);
    const cell = e.target.id % 5 || 5;

    ctx.beginPath();
    ctx.moveTo(elementWidth * (cell - 1), elementHeight * (row - 1));
    ctx.moveTo(elementWidth * cell, elementHeight * (row - 1));
    ctx.lineTo(elementWidth * cell, elementHeight * row);
    ctx.lineTo(elementWidth * (cell - 1), elementHeight * row);
    ctx.lineTo(elementWidth * (cell - 1), elementHeight * (row - 1))
    ctx.fill();
  })
}) */
