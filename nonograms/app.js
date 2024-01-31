const cellsContainer = document.querySelector('.cells');
const collsContainer = document.querySelector('.cols');
const rowsContainer = document.querySelector('.rows');

const initialGame = {
  complexity: 10,
};

const { complexity } = initialGame;

for (let i = 1; i <= complexity ** 2; i += 1) {
  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.setAttribute('id', i);
  cellsContainer.append(cell);
}

rowsContainer.classList.add(`row-${complexity}`);
collsContainer.classList.add(`col-${complexity}`);

for (let i = 1; i <= complexity; i += 1) {
  const row = document.createElement('div');
  row.classList.add('row');
  const col = document.createElement('div');
  col.classList.add('col');

  rowsContainer.append(row);
  collsContainer.append(col);
}

/*const ctx = canvas.getContext('2d');

canvas.width = cellsContainer.offsetWidth;
canvas.height = cellsContainer.offsetHeight;*/

/*const cells = document.querySelectorAll('.cell');
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
})*/



