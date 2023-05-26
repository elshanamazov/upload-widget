export function upload(options = {}) {
  const dragArea = document.querySelector('.upload__dragarea');
  const btnBrowse = document.querySelector('.upload__btn');
  const inputHidden = document.querySelector('.input-hidden');
  const errorClose = document.querySelector('.btn-close');
  const errorField = document.querySelector('.upload__error');
  const uploadLoading = document.querySelector('.upload__loading');
  let loadingProgress = document.querySelector('.progress');
  let file;
  let number = 1;

  const createSubTitle = document.createElement('h3');

  errorClose.addEventListener('click', () => {
    errorField.classList.add('visually-hidden');
  });

  btnBrowse.onclick = () => {
    inputHidden.click();
  };

  inputHidden.addEventListener('change', (e) => {
    file = e.target.files[0];
    fileLoad();
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
    fileLoad();
  });

  function fileLoad() {
    let fileType = file.type;

    if (!options.validFormates.includes(fileType)) {
      errorField.classList.remove('visually-hidden');
    } else {
      return createProgressEl();
    }
  }

  function fileLoadError() {}

  function createProgressEl() {
    uploadLoading.append(createSubTitle);
    createSubTitle.classList.add('upload__subtitle');

    if (number === 4) {
      return;
    } else {
      return (createSubTitle.innerHTML = `Uploading - ${number++}/3 files`);
    }
  }
}
