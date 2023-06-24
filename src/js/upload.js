import { async } from '@firebase/util';
import {
  app,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from './firebase';

import {
  createProgressFile,
  createErrorFile,
  createUploadedFile,
} from './htmlLayouts.js';

export function upload(options = {}) {
  const dragArea = document.querySelector('.upload__dragarea');
  const browseArea = document.querySelector('.upload__form');
  const inputHidden = document.querySelector('.input-hidden');
  const uploadErrorField = document.querySelector('.upload__error');
  const uploadLoading = document.querySelector('.upload__loading');
  const uploadUploaded = document.querySelector('.upload__uploaded');
  const uploadBtn = document.querySelector('.upload__btn');
  const storageRef = ref(storage);
  let totalFiles = 0;
  let uploadedFiles = 0;
  let filesToUpload = [];
  let uploadedFileIds = [];

  function loadingFile() {
    if (totalFiles > 3) {
      filesToUpload.pop();
      return;
    }

    filesToUpload.forEach((file) => {
      let fileName = file[0].name;
      let fileType = file[0].type;

      if (!options.validFormatas.includes(fileType)) {
        uploadErrorField.innerHTML = createErrorFile(fileName);
      } else {
        if (!uploadedFileIds.includes(fileName)) {
          uploadedFileIds.push(fileName);
          uploadedFiles++;
          uploadLoading.innerHTML += `<h3 class="upload__subtitle"> Uploading - ${uploadedFiles}/3 files </h3>`;
          uploadLoading.innerHTML += createProgressFile(fileName);
        }
      }
    });
  }

  function uploadToStorage() {
    if (document.querySelector('.upload__error--wrap')) {
      // выводим куда-то ошибку что нельзя зягрузить ошибочный файл и нужно его удалить
      console.log('Please delete error file');
    } else {
      filesToUpload.forEach((file) => {
        let fileName = file[0].name;
        let fileType = file[0].type;

        const fileRef = ref(storageRef, `files/${fileName}`);

        const closeButton = document.querySelector('.btn-close');

        if (closeButton) {
          closeButton.addEventListener('click', () => {
            // находим этот файл в массиве
            const errorFile = filesToUpload.find(
              (file) => file[0].name === closeButton.getAttribute('id')
            );

            console.log(errorFile); // здесь вместо вывода нужно удалить этот файл из массива filesToUpload и из разметки
          });
        }

        if (options.validFormatas.includes(fileType)) {
          const uploadTask = uploadBytesResumable(fileRef, file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const progressBar = document.querySelectorAll('.progress__bar');

              progressBar.forEach((e) => {
                e.style.width = progress + '%';
              });

              if (progress === 100) {
                uploadLoading.innerHTML = '';
              }
            },
            (error) => {
              console.log(error);
            },
            async () => {
              const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
              // здесь еще хорошо бы удалить файлы из незагруженных
              return (uploadUploaded.innerHTML += createUploadedFile(
                fileName,
                fileURL
              ));
            }
          );
        } else {
          return;
        }
      });
    }
  }

  browseArea.onclick = () => {
    inputHidden.click();
  };

  inputHidden.addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);
    totalFiles += newFiles.length;
    filesToUpload.push(newFiles);
    loadingFile();
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
    const newFiles = Array.from(e.dataTransfer.files);
    totalFiles += newFiles.length;
    filesToUpload.push(newFiles);
    loadingFile();
  });

  uploadBtn.addEventListener('click', uploadToStorage);
}
