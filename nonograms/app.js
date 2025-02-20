import hints from './assets/js/hints.js';
import {
  resetGame, saveGame, startGame, stopTime,
} from './assets/js/buttonActions.js';
import * as ct from './assets/js/constants.js';
import {
  getRandom, changeTheme, getWinTable, fillCells,
} from './assets/js/functions.js';

import { showModal, closeModal } from './assets/js/modal.js';
import { soundStatus } from './assets/js/audio.js';

const currentGame = {
  difficult: 5,
  level: 'camel',
  currentmatrix: [],
  currentTime: 0,
};

// Создание и поиск элементов
const body = document.querySelector('body');
body.classList.add('page', 'light');

// Создание модального окна
const modal = document.createElement('div');
modal.classList.add('modal');
modal.addEventListener('click', (e) => closeModal(e.target));

// Создание header
const header = document.createElement('header');
header.classList.add('header');

const headerContent = document.createElement('div');
headerContent.classList.add('header-content');

const logoElement = document.createElement('div');
logoElement.classList.add('logo');

const score = document.createElement('div');
score.classList.add('score');
score.textContent = ct.scoreText;
score.addEventListener('click', (e) => {
  e.preventDefault();
  const table = getWinTable();
  if (table) {
    showModal(table, 'score', modal);
  } else {
    showModal(table, 'errorScore', modal);
  }
});

const changeVisualContainer = document.createElement('div');
changeVisualContainer.classList.add('change-container');
const soundElement = document.createElement('div');
soundElement.classList.add('sound', 'on');
soundElement.addEventListener('click', (e) => {
  const sound = soundStatus;
  sound.on = !sound.on;
  e.target.classList.toggle('on');
});

const themeSelector = document.createElement('div');
themeSelector.classList.add('theme', 'light');

changeVisualContainer.append(soundElement, themeSelector);

themeSelector.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('light')) {
    changeTheme('dark', body, e.target);
  } else {
    changeTheme('light', body, e.target);
  }
});

headerContent.append(logoElement, score, changeVisualContainer);
header.append(headerContent);

// Создание основного контейнера с ячейками
const container = document.createElement('div');
container.classList.add('container');

// Создание элемента-таймера
const timerElement = document.createElement('div');
timerElement.classList.add('timer');
timerElement.textContent = ct.initialTimerCount;

// Создание контейнера и вариантов кроссворда
const optionsWrapper = document.createElement('div');
optionsWrapper.classList.add('options-wrapper');

const optionsComplexity = document.createElement('select');
optionsComplexity.classList.add('options');

const optionsCrossword = document.createElement('select');
optionsCrossword.classList.add('options');

const levelMapping = {
  5: 'easy',
  10: 'medium',
  15: 'hard',
};

// Создание опций выбора сложности
Object.keys(hints).forEach((key) => {
  const option = document.createElement('option');
  option.classList.add('option');
  option.setAttribute('value', key);

  option.textContent = levelMapping[key];
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
loadButton.classList.add('button-load', 'button');
loadButton.textContent = ct.loadGameText;

loadButton.addEventListener('click', (e) => {
  e.preventDefault();

  const difficult = Number(localStorage.getItem(ct.difficultKey));
  const level = localStorage.getItem(ct.levelKey);
  const matrix = JSON.parse(localStorage.getItem(ct.matrixKey));
  const time = Number(localStorage.getItem(ct.timeKey));
  if (!difficult && !level && !matrix && !time) {
    showModal(currentGame, 'errorSave', modal);
  } else {
    optionsComplexity.value = difficult;
    optionsCrossword.replaceChildren();
    selectCrossword(difficult, optionsCrossword);
    optionsCrossword.value = level;
    startGame(currentGame, difficult, level, timerElement, container, matrix, time);
  }
});

const resetButton = document.createElement('button');
resetButton.classList.add('button-reset', 'button');
resetButton.textContent = ct.resetGameText;

resetButton.addEventListener('click', (e) => {
  e.preventDefault();
  resetGame(currentGame, timerElement);
});

const saveButton = document.createElement('button');
saveButton.classList.add('button-save', 'button');
saveButton.textContent = ct.saveGameText;

saveButton.addEventListener('click', (e) => {
  e.preventDefault();
  saveGame(currentGame);
});

const randomGameButton = document.createElement('button');
randomGameButton.classList.add('button-random', 'button');
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

// Создание кнопки, решающей кроссворд
const buttonSolution = document.createElement('button');
buttonSolution.classList.add('button-solution', 'button');
buttonSolution.textContent = ct.solutionGameText;
buttonSolution.addEventListener('click', (e) => {
  e.preventDefault();
  const { difficult, level } = currentGame;
  fillCells(hints[difficult][level]);
  const blockCells = document.querySelector('.block-cells');
  blockCells.classList.add('blocked');
  stopTime();

  saveButton.disabled = true;
});

header.append(optionsWrapper, buttonContainer);
body.prepend(header, container, buttonSolution, modal);

startGame(currentGame, optionsComplexity.value, optionsCrossword.value, timerElement, container);
