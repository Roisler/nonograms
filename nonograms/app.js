import hints from './assets/js/hints.js';
import { resetGame, saveGame, startGame } from './assets/js/buttonActions.js';
import * as ct from './assets/js/constants.js';
import { getRandom } from './assets/js/functions.js';

const currentGame = {
  difficult: 5,
  level: 'key',
  currentmatrix: [],
  currentTime: 0,
};

// Создание и поиск элементов
const body = document.querySelector('body');
body.classList.add('page');

// Создание основного контейнера с ячейками
const container = document.createElement('div');
container.classList.add('container');

// Создание элемента-таймера
const timerElement = document.createElement('div');
timerElement.classList.add('timer');
timerElement.textContent = ct.initialTimerCount;

// Создание контейнера и вариантов кроссворда
const optionsWrapper = document.createElement('fieldset');
optionsWrapper.classList.add('options-wrapper');

const optionsComplexity = document.createElement('select');
optionsComplexity.classList.add('options');

const optionsCrossword = document.createElement('select');
optionsCrossword.classList.add('options');

// Создание опций выбора сложности
Object.keys(hints).forEach((key) => {
  const option = document.createElement('option');
  option.classList.add('option');
  option.setAttribute('value', key);

  option.textContent = `${key}x${key}`;
  optionsComplexity.append(option);
});

const selectCrossword = (value, parent) => {
  // Создание опций выбора кроссворда
  Object.keys(hints[value]).forEach((optionKey) => {
    const crossword = document.createElement('option');
    crossword.classList.add('option');
    crossword.setAttribute('value', optionKey);

    crossword.textContent = optionKey;
    parent.append(crossword);
  });
};

// Навешивание слушателя на изменение первой опции, для отображения верных вариантов кроссворда
optionsComplexity.addEventListener('change', (e) => {
  optionsCrossword.replaceChildren();
  const { value } = e.target;
  selectCrossword(value, optionsCrossword);
  startGame(currentGame, value, optionsCrossword.value, timerElement, container);
});

// Старт игры при выборе кроссворда
optionsCrossword.addEventListener('change', (e) => {
  const { value } = e.target;
  startGame(currentGame, optionsComplexity.value, value, timerElement, container);
});

// Установка начального значения уровня сложности при загрузке страницы
selectCrossword(5, optionsCrossword);

optionsWrapper.append(optionsComplexity);
optionsWrapper.append(optionsCrossword);

// Создание контейнера и кнопок, навешивание на них слушателей
const buttonContainer = document.createElement('div');
buttonContainer.classList.add('buttons');

const loadButton = document.createElement('button');
loadButton.classList.add('button', 'button-load');
loadButton.textContent = ct.loadGameText;

loadButton.addEventListener('click', (e) => {
  e.preventDefault();

  const difficult = Number(localStorage.getItem(ct.difficultKey));
  const level = localStorage.getItem(ct.levelKey);
  const matrix = JSON.parse(localStorage.getItem(ct.matrixKey));
  const time = Number(localStorage.getItem(ct.timeKey));
  if (!difficult && !level && !matrix && !time) {
    console.log('У вас нет сохраненных игр!');
  } else {
    optionsComplexity.value = difficult;
    optionsCrossword.replaceChildren();
    selectCrossword(difficult, optionsCrossword);
    optionsCrossword.value = level;
    startGame(currentGame, difficult, level, timerElement, container, matrix, time);
  }
});

const resetButton = document.createElement('button');
resetButton.classList.add('button', 'button-reset');
resetButton.textContent = ct.resetGameText;

resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  resetGame(currentGame, timerElement);
});

const saveButton = document.createElement('button');
saveButton.classList.add('button', 'button-save');
saveButton.textContent = ct.saveGameText;

saveButton.addEventListener('click', (e) => {
  e.preventDefault();
  saveGame(currentGame);
});

const randomGameButton = document.createElement('button');
randomGameButton.classList.add('button', 'button-random');
randomGameButton.textContent = ct.randomGameText;

randomGameButton.addEventListener('click', (e) => {
  e.preventDefault();
  const { difficult, level } = getRandom(hints, currentGame.level);
  optionsComplexity.value = difficult;
  optionsCrossword.replaceChildren();
  selectCrossword(difficult, optionsCrossword);
  optionsCrossword.value = level;
  startGame(currentGame, difficult, level, timerElement, container);
});

buttonContainer.append(loadButton, resetButton, saveButton, randomGameButton);
optionsWrapper.append(buttonContainer);

body.prepend(container);
body.prepend(optionsWrapper);

startGame(currentGame, optionsComplexity.value, optionsCrossword.value, timerElement, container);

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
