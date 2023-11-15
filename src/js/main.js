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
const uploadingStatus = document.querySelector('.upload__status');
const uploadLoading = document.querySelector('.upload__loading');
const uploadUploaded = document.querySelector('.upload__uploaded');
const uploadBtn = document.querySelector('.upload__btn');
let filesToUpload = [];

const loadingFilesHandler = (event) => {
  event.preventDefault();
  const newfiles = Array.from(
    event.dataTransfer?.files ?? event.target?.files ?? []
  );

  newfiles.forEach((file) => {
    if (
      !filesToUpload.some((existingFile) => existingFile.name === file.name)
    ) {
      filesToUpload.push({
        name: file.name,
        type: file.type,
        status: 'loading',
      });
    } else {
      return errorMessage('You have already added this file');
    }
  });

  loadingFile(filesToUpload);
};

const loadingFile = (files) => {
  if (files.length > UPLOAD_LIMIT) {
    files.pop();
    errorMessage('You can only upload 3 files at a time');
    return;
  }

  files.forEach((file) => {
    const fileName = file.name;
    const fileType = file.type;

    uploadLoading.innerHTML += createProgressFile(fileName, fileType);
  });
  loadingCounter(files);
};

const loadingCounter = (files) => {
  const uploadSubtitle = createSubtitle(uploadLoading);

  files.length
    ? (uploadSubtitle.innerHTML = `Uploading - ${files.length}/${UPLOAD_LIMIT} files`)
    : uploadSubtitle.remove();
};

const handleFileDelete = (event) => {
  if (event.target.tagName.toLowerCase() === 'button') {
    const targetElement = event.target.closest('.upload__file, .progress');
    if (targetElement) {
      const fileNameElement = targetElement.querySelector(
        '.upload__file__name, .progress__name'
      );
      const fileName = fileNameElement.innerHTML;

      targetElement.remove();

      if (fileName) {
        filesToUpload = filesToUpload.filter((file) => file.name !== fileName);
        loadingCounter(filesToUpload);
      }
    }
  }
};

const uploadToStorage = (files) => {
  const progressElements = document.querySelectorAll('.progress');
  const uploadedSubtitle = createSubtitle(uploadUploaded);

  files.forEach((file) => {
    const fileName = file.name;
    const fileType = file.type;

    progressElements.forEach((el) => {
      if (!validFormatas.includes(fileType)) {
        el.classList.add('_error');
      } else {
        if (el.dataset.type === fileType) {
          el.remove();
          uploadedSubtitle.textContent = 'Uploaded';
          uploadUploaded.innerHTML += createUploadedFile(fileName);
        }
      }
    });
  });

  loadingCounter(files);
};

//Handlers

fileUploadArea.addEventListener('click', () => {
  inputHidden.click();
  inputHidden.value = '';
});

fileUploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileUploadArea.classList.add('_active');
});

fileUploadArea.addEventListener('dragleave', () => {
  fileUploadArea.classList.remove('_active');
});

inputHidden.addEventListener('change', loadingFilesHandler);

fileUploadArea.addEventListener('drop', loadingFilesHandler);

uploadingStatus.addEventListener('click', handleFileDelete);

uploadBtn.addEventListener('click', () => {
  if (filesToUpload.length > 0) {
    uploadToStorage(filesToUpload);
  } else {
    errorMessage('Please select files before uploading.');
    return;
  }
});
