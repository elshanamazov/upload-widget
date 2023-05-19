import '../scss/style.scss';

const dragArea = document.querySelector('.js-dragarea');
const btnBrowse = document.querySelector('.js-btn');
const inputHidden = document.querySelector('.js-input');
const errorBtn = document.querySelector('.js-btn-error');
const errorField = document.querySelector('.js-error-field');
console.log(errorField);
let file;

errorBtn.addEventListener('click', () => {
  errorField.classList.add('visually-hidden');
});

btnBrowse.onclick = () => {
  inputHidden.click();
};

btnBrowse.addEventListener('change', () => {
  file = this.files[0];
  console.log(file);
});

dragArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dragArea.classList.add('_active');
});

dragArea.addEventListener('dragleave', () => {
  dragArea.classList.remove('_active');
});

dragArea.addEventListener('drop', (e) => {
  e.preventDefault();
  file = e.dataTransfer.files[0];

  let fileType = file.type;
  let validFormates = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'text/plain',
  ];

  if (!validFormates.includes(fileType)) {
    errorField.classList.remove('visually-hidden');
  }
});

function errorFormat() {}
