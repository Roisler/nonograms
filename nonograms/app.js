import hints from './assets/js/hints.js';
import { resetGame, saveGame, startGame } from './assets/js/buttonActions.js';

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

const timerElement = document.createElement('div');
timerElement.classList.add('timer');
timerElement.textContent = '00:00';

const optionsWrapper = document.createElement('fieldset');
optionsWrapper.classList.add('options-wrapper');

const optionsComplexity = document.createElement('select');
optionsComplexity.classList.add('options');

const optionsCrossword = document.createElement('select');
optionsCrossword.classList.add('options');

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('buttons');

const startButton = document.createElement('button');
startButton.classList.add('button');
startButton.textContent = 'Start Game';

startButton.addEventListener('click', (e) => {
  e.preventDefault();
  startGame(currentGame, optionsComplexity.value, optionsCrossword.value, timerElement, container);
});

const loadButton = document.createElement('button');
loadButton.classList.add('button');
loadButton.textContent = 'Continue last game';

const resetButton = document.createElement('button');
resetButton.classList.add('button');
resetButton.textContent = 'Reset Game';

resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  timerElement.textContent = '00:00';
  resetGame(currentGame);
});

const saveButton = document.createElement('button');
saveButton.classList.add('button');
saveButton.textContent = 'Save Game';

saveButton.addEventListener('click', (e) => {
  e.preventDefault();
  saveGame(currentGame);
});

// Создание опций выбора кроссворда
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

// Навешивание слушателя на изменение первой опции, для отображения верных вариантов кроссворда
optionsComplexity.addEventListener('change', (e) => {
  optionsCrossword.replaceChildren();
  selectCrossword(e.target.value, optionsCrossword);
});

// Установка начального значения уровня сложности при загрузке страницы
selectCrossword(5, optionsCrossword);

optionsWrapper.append(optionsComplexity);
optionsWrapper.append(optionsCrossword);
buttonContainer.append(startButton, loadButton, resetButton, saveButton);
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
