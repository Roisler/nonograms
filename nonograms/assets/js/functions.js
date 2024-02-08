import { tableKey } from './constants.js';
import { getTime } from './timer.js';

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
const isEqual = (arr, hint) => {
  const arr2 = arr.map((row) => row.map((el) => (el === 0.5 ? 0 : el)));
  return JSON.stringify(arr2) === JSON.stringify(hint);
};

// Закрашивание ячеек по сохраненной матрице
const fillCells = (matrix) => {
  const flatMatrix = matrix.flat(Infinity);
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    if (flatMatrix[cell.id] === 1) {
      cell.classList.remove('cross');
      cell.classList.add('fill');
    } else if (flatMatrix[cell.id] === 0.5) {
      cell.classList.remove('fill');
      cell.classList.add('cross');
    } else {
      cell.classList.remove('cross');
      cell.classList.remove('fill');
    }
  });
};

// Получение таблицы результатов
const getWinTable = () => {
  const table = JSON.parse(localStorage.getItem(tableKey));
  if (!table) {
    return false;
  }
  table.sort((a, b) => Number(a.time.split(':')[1]) - Number(b.time.split(':')[1]));
  return table;
};

// Добавление таблицы результатов
const setWinTable = (result) => {
  const { difficult, level, time } = result;
  const table = JSON.parse(localStorage.getItem(tableKey)) ?? [];
  if (table.length >= 5) {
    table.shift();
  }
  const timeString = getTime(time);
  table.push({ difficult, level, time: timeString });

  localStorage.setItem(tableKey, JSON.stringify(table));
};

const randomize = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const getRandom = (arr, previous) => {
  const difficultArr = Object.keys(arr);
  const difficultIndex = randomize(0, difficultArr.length - 1);
  const difficult = difficultArr[difficultIndex];
  const levelsArr = Object.keys(arr[difficult]);
  const levelIndex = randomize(0, levelsArr.length - 1);
  const level = levelsArr[levelIndex];
  if (level === previous) {
    return getRandom(arr, previous);
  }

  return { difficult, level };
};

const changeTheme = (theme, mainElement, themeChangeElement) => {
  themeChangeElement.classList.remove('light');
  themeChangeElement.classList.remove('dark');
  themeChangeElement.classList.add(theme);
  mainElement.classList.remove('light');
  mainElement.classList.remove('dark');
  mainElement.classList.add(theme);
};

export {
  generateArrHints,
  initialMatrix,
  isEqual,
  fillCells,
  setWinTable,
  getRandom,
  changeTheme,
  getWinTable,
};
