import { tableKey } from './constants.js';
import hints from './hints.js';

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

// Закрашивание ячеек по сохраненной матрице
const fillCells = (matrix) => {
  const flatMatrix = matrix.flat(Infinity);
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    if (flatMatrix[cell.id]) {
      cell.classList.add('fill');
    }
  });
};

// Получение таблицы результатов
const getWinTable = () => {
  const table = JSON.parse(localStorage.getItem(tableKey));
  return table;
};

// Добавление таблицы результатов
const setWinTable = (result) => {
  console.log(result);
  const date = new Date();

  const table = getWinTable() ?? [];
  const hours = date.getHours().toString().padStart(2, 0);
  const minutes = date.getMinutes().toString().padStart(2, 0);
  console.log(minutes);
  const timeString = `${hours}:${minutes}`;
  table.push({ [timeString]: result });
  table.sort();
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

getRandom(hints);

export {
  generateArrHints, initialMatrix, isEqual, fillCells, setWinTable, getRandom,
};
