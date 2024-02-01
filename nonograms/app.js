import hints from './assets/js/hints.js';

// Генерирование подсказок
const generateArrHints = (arr, lvl, index, difficult, type) => {
  let currentSumHint = 0;
  const resultArrHints = [];

  const arrHints = type === 'col'
    ? arr[difficult][lvl].reduce((acc, current) => {
      acc.push(current[index]);
      return acc;
    }, [])
    : arr[difficult][lvl][index];

  for (let i = 0; i <= arrHints.length; i += 1) {
    const current = arrHints[i];
    if (current) {
      currentSumHint += current;
    } else {
      resultArrHints.push(currentSumHint);
      currentSumHint = 0;
    }
  }
  return resultArrHints;
};

// Инициализация матрицы, заполненной нулями с длиной массива равной сложности кроссворда
const initialMatrix = (difficult) => {
  const matrix = Array.from(
    { length: difficult },
    () => Array.from({ length: difficult }, () => 0),
  );
  return matrix;
};

// Проверка на совпадение матрицы решаемого кроссворда с текущей
const isEqual = (arr, hint) => JSON.stringify(arr) === JSON.stringify(hint);

// Создание и поиск элементов
const body = document.querySelector('body');
body.classList.add('page');

const optionsWrapper = document.createElement('fieldset');
optionsWrapper.classList.add('options-wrapper');

const optionsComplexity = document.createElement('select');
optionsComplexity.classList.add('options');

const optionsCrossword = document.createElement('select');
optionsCrossword.classList.add('options');

const startButton = document.createElement('button');
startButton.classList.add('button');
startButton.textContent = 'Start Game';

const loadButton = document.createElement('button');
loadButton.classList.add('button');
loadButton.textContent = 'Continue last game';

Object.keys(hints).forEach((key) => {
  const option = document.createElement('option');
  option.classList.add('option');
  option.setAttribute('value', key);

  option.textContent = `${key}x${key}`;
  optionsComplexity.append(option);
});

const selectCrossword = (value, parent) => {
  Object.keys(hints[value]).forEach((optionKey) => {
    const crossword = document.createElement('option');
    crossword.classList.add('option');
    crossword.setAttribute('value', optionKey);

    crossword.textContent = optionKey;
    parent.append(crossword);
  });
};

optionsComplexity.addEventListener('change', (e) => {
  optionsCrossword.replaceChildren();
  selectCrossword(e.target.value, optionsCrossword);
});

selectCrossword(5, optionsCrossword);
optionsWrapper.append(optionsComplexity);
optionsWrapper.append(optionsCrossword);
optionsWrapper.append(startButton, loadButton);

const container = document.createElement('div');
container.classList.add('container');
body.prepend(container);
body.prepend(optionsWrapper);

const startGame = (difficult, level, wrapper, currentMatrix = null) => {
  wrapper.replaceChildren();

  const matrix = currentMatrix ?? initialMatrix(difficult);

  const collsContainer = document.createElement('div');
  collsContainer.classList.add('cols');
  const rowsContainer = document.createElement('div');
  rowsContainer.classList.add('rows');
  const cellsContainer = document.createElement('div');
  cellsContainer.classList.add('cells');

  const timer = document.createElement('div');
  timer.classList.add('timer');

  container.append(timer, collsContainer, rowsContainer, cellsContainer);

  // Действие при клике на ячейку

  const clickCell = (cell) => {
    cell.classList.remove('cross');
    cell.classList.toggle('fill');
    const row = Math.floor(cell.id / difficult);
    const id = cell.id % difficult;
    matrix[row][id] = matrix[row][id] === 0 ? 1 : 0;
    if (isEqual(matrix, hints[difficult][level])) {
      console.log('Вы выиграли!');
    }
    console.log(matrix);
  };

  for (let i = 0; i < difficult ** 2; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('id', i);
    cellsContainer.append(cell);

    cell.addEventListener('click', (e) => clickCell(e.target));
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault(); // НЕ ЗАБЫТЬ УБРАТЬ!
      e.target.classList.remove('fill');
      e.target.classList.toggle('cross');
    });
  }

  rowsContainer.classList.add(`rows-${difficult}`);
  collsContainer.classList.add(`cols-${difficult}`);
  cellsContainer.classList.add(`cells-${difficult}`);

  // Формирование подсказок по рядам
  for (let i = 1; i <= difficult; i += 1) {
    const row = document.createElement('div');
    row.classList.add('row');

    const rowHints = generateArrHints(hints, level, i - 1, difficult, 'row');
    rowHints.forEach((el) => {
      if (el !== 0) {
        const hint = document.createElement('p');
        hint.textContent = el;
        row.append(hint);
      }
    });

    const col = document.createElement('div');
    col.classList.add('col');

    // Формирование подсказок по колонкам
    const colHints = generateArrHints(hints, level, i - 1, difficult, 'col');
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
};

startButton.addEventListener('click', (e) => {
  e.preventDefault();
  startGame(optionsComplexity.value, optionsCrossword.value, container);
});

startGame(optionsComplexity.value, optionsCrossword.value, container);

// Создание элементов ячеек, навешивание слушателей

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
