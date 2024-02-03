// Функция - секундомер
const getTime = (game, timerElement, timerInterval) => {
  const currentGame = game;
  const timer = timerElement;
  /* Добавляем по 20мс, чтобы пользователь не успел нажать второй раз до обновления currentTime,
  так как в функции, выполняемой при клике, currentTime проверяется на ненулевое значение */
  currentGame.currentTime += timerInterval;
  const minutes = Math.floor(currentGame.currentTime / 60000);
  const seconds = Math.floor((currentGame.currentTime % 60000) / 1000);

  const time = `${minutes.toString().padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;

  timer.textContent = time;
};

export default getTime;
