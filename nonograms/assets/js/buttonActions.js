import { generateArrHints, initialMatrix, isEqual } from './functions.js';
import hints from './hints.js';
import getTime from './timer.js';

const nickname = 'roisler';
let timerId;
const timerInterval = 20;

// Сохранение кроссворда в local storage
const saveGame = (game) => {
  const { difficult, level, currentmatrix, currentTime } = game;
  const difficultKey = `${nickname} difficult`;
  const levelKey = `${nickname} level`;
  const matrixKey = `${nickname} matrix`;
  const timeKey = `${nickname} time`;

  localStorage.removeItem(difficultKey);
  localStorage.removeItem(levelKey);
  localStorage.removeItem(matrixKey);

  localStorage.setItem(difficultKey, difficult.toString());
  localStorage.setItem(levelKey, level);
  console.log(currentmatrix);
  localStorage.setItem(matrixKey, JSON.stringify(currentmatrix));
  localStorage.setItem(timeKey, currentTime.toString());
};

// Сброс кроссворда к начальному состоянию
const resetGame = (game) => {
  clearInterval(timerId);
  const currentGame = game;
  const cells = document.querySelectorAll('.cell');
  cells.forEach((e) => {
    e.classList.remove('fill');
    e.classList.remove('cross');
  });
  currentGame.currentTime = 0;
  currentGame.currentmatrix = initialMatrix(currentGame.difficult);
};

// Начало игры
const startGame = (game, difficult, level, timer, wrapper) => {
  wrapper.replaceChildren();

  clearInterval(timerId);

  const currentGame = game;

  currentGame.currentmatrix = initialMatrix(difficult);
  currentGame.currentTime = 0;
  timer.textContent = '00:00';

  currentGame.difficult = difficult;
  currentGame.level = level;

  const collsContainer = document.createElement('div');
  collsContainer.classList.add('cols');
  const rowsContainer = document.createElement('div');
  rowsContainer.classList.add('rows');
  const cellsContainer = document.createElement('div');
  cellsContainer.classList.add('cells');

  wrapper.append(timer, collsContainer, rowsContainer, cellsContainer);

  // Действие при клике на ячейку

  const clickCell = (cell) => {
    cell.classList.remove('cross');
    cell.classList.toggle('fill');
    console.log(currentGame.currentTime);
    if (!currentGame.currentTime) {
      timerId = setInterval(() => getTime(game, timer, timerInterval), timerInterval);
    }
    const row = Math.floor(cell.id / difficult);
    const id = cell.id % difficult;
    currentGame.currentmatrix[row][id] = currentGame.currentmatrix[row][id] === 0 ? 1 : 0;
    if (isEqual(currentGame.currentmatrix, hints[difficult][level])) {
      clearInterval(timerId);
      console.log(
        `Вы разгадали кроссворд за ${currentGame.currentTime}`,
      );
    }
    console.log(currentGame.currentmatrix);
  };

  for (let i = 0; i < difficult ** 2; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('id', i);
    cellsContainer.append(cell);

    // Навешивание слушателей на ячейку
    cell.addEventListener('click', (e) => clickCell(e.target));
    cell.addEventListener('contextmenu', (e) => {
      // e.preventDefault(); // НЕ ЗАБЫТЬ УБРАТЬ КОММЕНТАРИЙ
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

export { resetGame, saveGame, startGame };
