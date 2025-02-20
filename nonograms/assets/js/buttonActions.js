import {
  fillCells, generateArrHints, initialMatrix, isEqual, setWinTable,
} from './functions.js';
import { showModal } from './modal.js';
import hints from './hints.js';
import { getTime, startTime } from './timer.js';
import {
  difficultKey, levelKey, matrixKey, timeKey, timerInterval,
} from './constants.js';
import * as sound from './audio.js';

let timerId;

// Сохранение кроссворда в local storage
const saveGame = (game) => {
  const {
    difficult, level, currentmatrix, currentTime,
  } = game;

  localStorage.removeItem(difficultKey);
  localStorage.removeItem(levelKey);
  localStorage.removeItem(matrixKey);

  localStorage.setItem(difficultKey, difficult.toString());
  localStorage.setItem(levelKey, level);
  localStorage.setItem(matrixKey, JSON.stringify(currentmatrix));
  localStorage.setItem(timeKey, currentTime.toString());
};

// Сброс кроссворда к начальному состоянию
const resetGame = (game, timer) => {
  clearInterval(timerId);
  const currentGame = game;
  currentGame.currentTime = 0;
  currentGame.currentmatrix = initialMatrix(currentGame.difficult);
  const timerElement = timer;
  timerElement.textContent = getTime(currentGame.currentTime);
  const cells = document.querySelectorAll('.cell');

  const saveButton = document.querySelector('.button-save');
  saveButton.disabled = false;
  const blockCells = document.querySelector('.block-cells');
  blockCells.classList.remove('blocked');
  cells.forEach((e) => {
    e.classList.remove('fill');
    e.classList.remove('cross');
  });
};

// Начало игры
const startGame = (game, difficult, level, timerElement, wrapper, matrix = null, time = null) => {
  wrapper.replaceChildren();

  clearInterval(timerId);

  const currentGame = game;
  const timer = timerElement;

  currentGame.currentmatrix = matrix ?? initialMatrix(difficult);
  currentGame.currentTime = time ?? 0;
  timer.textContent = getTime(currentGame.currentTime);

  currentGame.difficult = difficult;
  currentGame.level = level;

  const saveButton = document.querySelector('.button-save');
  saveButton.disabled = false;

  const collsContainer = document.createElement('div');
  collsContainer.classList.add('cols');
  const rowsContainer = document.createElement('div');
  rowsContainer.classList.add('rows');
  const cellsContainer = document.createElement('div');
  cellsContainer.classList.add('cells');

  // Элемент-костыль для блокировки действий по ячейкам
  const blockCells = document.createElement('div');
  blockCells.classList.add('block-cells');
  const modal = document.querySelector('.modal');
  blockCells.addEventListener('click', (e) => {
    e.preventDefault();
    showModal(currentGame, 'error', modal);
  });
  blockCells.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showModal(currentGame, 'error', modal);
  });

  wrapper.append(timer, collsContainer, rowsContainer, cellsContainer, blockCells);

  // Действие при клике на ячейку

  const clickCell = (cell) => {
    if (sound.soundStatus.on) {
      const currentSound = cell.classList.contains('fill')
        ? sound.emptySound
        : sound.clickSound;
      currentSound.play();
    }
    cell.classList.toggle('fill');
    cell.classList.remove('cross');
    if (!currentGame.currentTime || currentGame.currentTime === time) {
      timerId = setInterval(() => startTime(game, timer, timerInterval), timerInterval);
    }
    const row = Math.floor(cell.id / difficult);
    const id = cell.id % difficult;
    currentGame.currentmatrix[row][id] = currentGame.currentmatrix[row][id] < 1 ? 1 : 0;
    if (isEqual(currentGame.currentmatrix, hints[difficult][level])) {
      clearInterval(timerId);
      saveButton.disabled = true;
      setWinTable({
        level, difficult, time: currentGame.currentTime,
      });
      blockCells.classList.add('blocked');
      showModal(currentGame, 'win', modal);
    }
  };

  let index = 0;
  for (let i = 0; i < difficult; i += 1) {
    const cellRow = document.createElement('div');
    cellRow.classList.add(`row-cells-${difficult}`);
    cellRow.classList.add('row-cells');
    for (let j = 0; j < difficult; j += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', index);
      index += 1;
      cell.addEventListener('click', (e) => {
        clickCell(e.target);
      });
      // eslint-disable-next-line no-loop-func
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (sound.soundStatus.on) {
          const currentSound = e.target.classList.contains('cross')
            ? sound.emptySound
            : sound.crossSound;
          currentSound.play();
        }
        if (!currentGame.currentTime) {
          timerId = setInterval(() => startTime(game, timer, timerInterval), timerInterval);
        }
        e.target.classList.remove('fill');
        e.target.classList.toggle('cross');

        const row = Math.floor(e.target.id / difficult);
        const id = e.target.id % difficult;
        currentGame.currentmatrix[row][id] = currentGame.currentmatrix[row][id] === 0.5 ? 0 : 0.5;
        if (isEqual(currentGame.currentmatrix, hints[difficult][level])) {
          clearInterval(timerId);
          saveButton.disabled = true;
          setWinTable({
            level, difficult, time: currentGame.currentTime,
          });
          blockCells.classList.add('blocked');
          showModal(currentGame, 'win', modal);
        }
      });
      cellRow.append(cell);
    }
    cellsContainer.append(cellRow);
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
        const hint = document.createElement('div');
        hint.classList.add('hint');
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
        const hint = document.createElement('div');
        hint.classList.add('hint');
        hint.textContent = el;
        col.append(hint);
      }
    });

    rowsContainer.append(row);
    collsContainer.append(col);
  }
  if (currentGame.currentTime) {
    fillCells(currentGame.currentmatrix);
  }
};

const stopTime = () => {
  clearInterval(timerId);
};

export {
  resetGame, saveGame, startGame, stopTime,
};
