import '../scss/style.scss';
import { UPLOAD_LIMIT, validFormatas } from './vars';
// import { ref, storage } from './firebase';
import {
  createProgressFile,
  createSubtitle,
  createUploadedFile,
  errorMessage,
} from './htmlLayouts';

const inputHidden = document.querySelector('.input-hidden');
const fileUploadArea = document.querySelector('.upload__area');
const uploadLoading = document.querySelector('.upload__loading');
const uploadUploaded = document.querySelector('.upload__uploaded');
const uploadBtn = document.querySelector('.upload__btn');
let filesToUpload = [];
let uploadedFiles = [];

const loadingFilesHandler = (event) => {
  event.preventDefault();
  const newfiles = Array.from(
    event.dataTransfer?.files ?? event.target?.files ?? []
  );

  newfiles.forEach((file) => {
    if (
      !filesToUpload.some((existingFile) => existingFile.name === file.name)
    ) {
      filesToUpload.push(file);
    } else {
      return errorMessage('You have already added this file');
    }
  });

  loadingFile(filesToUpload);
};

const loadingFile = (files) => {
  if (files.length > UPLOAD_LIMIT) {
    files.pop();
    return errorMessage('You can only upload 3 files at a time');
  }
  loadingCounter(files);

  files.forEach((file) => {
    const fileName = file.name;
    const fileType = file.type;
    uploadLoading.innerHTML += createProgressFile(fileName, fileType);
  });

  deleteFiles(uploadLoading, files);
};

const loadingCounter = (files) => {
  const uploadSubtitle = createSubtitle(uploadLoading);
  files.length
    ? (uploadSubtitle.innerHTML = `Uploading - ${files.length}/${UPLOAD_LIMIT} files`)
    : uploadSubtitle.remove();
};

const deleteFiles = (element, files) => {
  element.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'button') {
      const progressElement = event.target.closest('.upload__status');
      if (progressElement) {
        const fileName =
          progressElement.querySelector('.progress__file').textContent;
        progressElement.remove();
        files = files.filter((file) => file.name !== fileName);
        console.log('Files after deletion:', files);
        loadingCounter(files);
      }
    }
  });
};

const uploadToStorage = (files) => {
  const progressElements = document.querySelectorAll('.progress');
  const uploadedSubtitle = createSubtitle(uploadUploaded);

  files = files.filter((file) => {
    const fileName = file.name;
    const fileType = file.type;
    let isUploaded = false;
    progressElements.forEach((el) => {
      if (!validFormatas.includes(el.dataset.type)) {
        el.classList.add('_error');
      } else {
        if (el.dataset.type === fileType) {
          el.remove();
          isUploaded = true;
          uploadedFiles.push(file);
          uploadedSubtitle.textContent = 'Uploaded';
          uploadUploaded.innerHTML += createUploadedFile(fileName);
        }
      }
    });

    return !isUploaded;
  });
  console.log(uploadUploaded);
  deleteFiles(uploadUploaded, files);
  loadingCounter(files);
};

//Handlers

fileUploadArea.addEventListener('click', () => {
  inputHidden.click();
  inputHidden.value = '';
});

inputHidden.addEventListener('change', loadingFilesHandler);
fileUploadArea.addEventListener('drop', loadingFilesHandler);

fileUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileUploadArea.classList.add('_active');
});

fileUploadArea.addEventListener('dragleave', () => {
  fileUploadArea.classList.remove('_active');
});

uploadBtn.addEventListener('click', () => {
  if (filesToUpload.length > 0) {
    uploadToStorage(filesToUpload);
  } else {
    errorMessage('Please select files before uploading.');
    return;
  }
});
