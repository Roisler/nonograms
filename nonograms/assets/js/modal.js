import { errorSound, winSound, soundStatus } from './audio.js';
import { winText } from './constants.js';

const closeModal = (modal) => {
  modal.classList.remove('show');
};

const showScores = (data, modalContent, modalData) => {
  const scores = document.createElement('table');
  const scoresTitle = document.createElement('tr');
  const titles = ['N', 'Difficult', 'Level', 'Time'];
  titles.forEach((title) => {
    const th = document.createElement('th');
    th.textContent = title;
    scoresTitle.append(th);
  });
  scores.append(scoresTitle);
  modalData.append(scores);

  data.forEach((el, i) => {
    const line = document.createElement('tr');
    const keys = Object.keys(el);
    const index = document.createElement('td');
    index.textContent = i + 1;
    line.append(index);
    keys.forEach((key) => {
      const lineItem = document.createElement('td');
      const levelMapping = {
        5: 'easy',
        10: 'medium',
        15: 'hard',
      };

      lineItem.textContent = levelMapping[el[key]] ?? el[key];
      line.append(lineItem);
    });
    scores.append(line);
  });

  modalContent.append(modalData);
};

const showWin = (data, modalContent, modalData) => {
  if (soundStatus.on) {
    winSound.play();
  }
  const seconds = Math.floor((data.currentTime % 60000) / 1000);
  const modalText = document.createElement('div');
  modalText.classList.add('modal-text');
  modalText.textContent = `${winText}${seconds} seconds!`;
  modalData.append(modalText);
  modalContent.append(modalData);
};

const showModal = (data, type, modal) => {
  const mappingType = {
    score: 'Scores',
    win: 'You win',
    error: 'Start a new game or reset current game',
    errorScore: 'You have no games won',
    errorSave: 'You have no saved games!',
  };

  modal.replaceChildren();
  modal.classList.add('show');
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const closeModalElement = document.createElement('div');
  closeModalElement.classList.add('modal-close');
  closeModalElement.addEventListener('click', () => closeModal(modal));

  modalContent.append(closeModalElement);
  modal.append(modalContent);

  const header = document.createElement('div');
  header.classList.add('modal-header');
  header.textContent = mappingType[type];
  const modalData = document.createElement('div');
  modalData.classList.add('modal-data');

  modalContent.append(header);

  const mappingShow = {
    score: showScores,
    win: showWin,
  };

  if (mappingShow[type]) {
    mappingShow[type](data, modalContent, modalData);
  } else if (soundStatus.on) {
    errorSound.play();
  }
};

export {
  closeModal,
  showModal,
};
