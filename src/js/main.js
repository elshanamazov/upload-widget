import '../scss/style.scss';

const dragArea = document.querySelector('.js-dragarea');
const btnBrowse = document.querySelector('.js-btn');
const inputHidden = document.querySelector('.js-input');

btnBrowse.onclick = () => {
  inputHidden.click();
};

dragArea.addEventListener('dragover', () => {
  dragArea.classList.add('_active');
});

dragArea.addEventListener('dragleave', () => {
  dragArea.classList.remove('_active');
});
