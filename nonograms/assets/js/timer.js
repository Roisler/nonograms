let seconds = 0;
let minutes = 0;

const getTime = (element) => {
  seconds += 1;
  if (seconds === 60) {
    minutes += 1;
    seconds = 0;
  }

  const time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  element.textContent = time;
};

export default getTime;
