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
const name = document.querySelector('.upload__name');
console.log(name);
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
    errorMessage('You can only upload 3 files at a time');
    return;
  }
  loadingCounter(files);

  files.forEach((file) => {
    const fileName = file.name;
    const fileType = file.type;
    uploadLoading.innerHTML += createProgressFile(fileName, fileType);
  });

  deleteFiles(uploadLoading, files, 'progress');
};

const loadingCounter = (files) => {
  const uploadSubtitle = createSubtitle(uploadLoading);
  files.length
    ? (uploadSubtitle.innerHTML = `Uploading - ${files.length}/${UPLOAD_LIMIT} files`)
    : uploadSubtitle.remove();
};

const deleteFiles = (element, files, elementClass) => {
  element.addEventListener('click', (event) => {
    if (event.target.tagName.toLowerCase() === 'button') {
      const targetElement = event.target.closest(`.${elementClass}`);
      if (targetElement) {
        const fileNameElement = targetElement.querySelector(
          `.${elementClass}__name`
        );
        console.log(fileNameElement);
        const fileName = fileNameElement.innerHTML;
        if (fileName) {
          targetElement.remove();
          files = files.filter((file) => file.name !== fileName);
          filesToUpload = files;
          loadingCounter(filesToUpload);
        }
      }
    }
  });
};

// const deleteFiles = (element, files, elementClass) => {
//   element.addEventListener('click', (event) => {
//     if (event.target.tagName.toLowerCase() === 'button') {
//       const progressElement = event.target.closest('.progress');
//       const uploadedFileElement = event.target.closest('.upload__file');

//       if (progressElement || uploadedFileElement) {
//         const fileName = (progressElement || uploadedFileElement).querySelector(
//           '.progress__file'
//         ).textContent;
//         (progressElement || uploadedFileElement).remove();
//         files = files.filter((file) => file.name !== fileName);
//         filesToUpload = files;
//         loadingCounter(filesToUpload);
//       }
//     }
//   });
// };

const uploadToStorage = (files) => {
  const progressElements = document.querySelectorAll('.progress');
  const uploadedSubtitle = createSubtitle(uploadUploaded);

  files.forEach((file) => {
    const fileName = file.name;
    const fileType = file.type;

    progressElements.forEach((el) => {
      if (!validFormatas.includes(el.dataset.type)) {
        el.classList.add('_error');
      } else {
        if (el.dataset.type === fileType) {
          el.remove();
          uploadedFiles.push(file);
          uploadedSubtitle.textContent = 'Uploaded';
          uploadUploaded.innerHTML += createUploadedFile(fileName);
        }
      }
    });
  });

  console.log(files);
  console.log(uploadedFiles);
  loadingCounter(files);
  deleteFiles(uploadUploaded, files, 'upload__file');
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
