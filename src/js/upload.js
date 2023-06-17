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
      return;
    }

    filesToUpload.forEach((file) => {
      let fileName = file.name;
      let fileType = file.type;
      if (!options.validFormatas.includes(fileType)) {
        uploadErrorField.innerHTML = createErrorMessage(fileName);
        return;
      }

      if (uploadedFileIds.includes(fileName)) {
        return;
      }

      uploadedFileIds.push(fileName);
      uploadedFiles++;
      uploadLoading.innerHTML += `<h3 class="upload__subtitle"> Uploading - ${uploadedFiles}/3 files </h3>`;
      uploadLoading.innerHTML += createProgressFile(fileName);
    });

    return uploadLoading;
  }

  function uploadToStorage() {
    filesToUpload.forEach((file) => {
      let fileName = file.name;
      let fileType = file.type;

      const fileRef = ref(storageRef, `files/${fileName}`);

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

  browseArea.onclick = () => {
    inputHidden.click();
  };

  inputHidden.addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);
    totalFiles += newFiles.length;
    filesToUpload = newFiles;
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
    filesToUpload = newFiles;
    loadingFile();
  });

  uploadBtn.addEventListener('click', uploadToStorage);
}
