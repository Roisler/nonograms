// Функция - секундомер
const getTime = (currentTime) => {
  const minutes = Math.floor(currentTime / 60000);
  const seconds = Math.floor((currentTime % 60000) / 1000);

  return `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
};

const startTime = (game, timerElement, timerInterval) => {
  const currentGame = game;
  const timer = timerElement;
  /* Добавляем по 20мс, чтобы пользователь не успел нажать второй раз до обновления currentTime,
  так как в функции, выполняемой при клике, currentTime проверяется на ненулевое значение */
  currentGame.currentTime += timerInterval;

  const time = getTime(game.currentTime);
  timer.textContent = time;
};

export { getTime, startTime };
