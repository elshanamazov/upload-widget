import { getDownloadURL } from './firebase';
import {
  createFileProgressEl,
  createFileProgressUploadedEl,
  createProgressSubtitleEl,
  errorMessageAlert,
} from './htmlLayouts';
import { element } from './utils';

export function upload(selector, options = {}) {
  const inputHidden = document.querySelector(selector);
  const upload = document.querySelector('.upload');
  const fileUploadArea = document.querySelector('.upload__area');
  const uploadBtn = document.querySelector('.upload__btn');

  let files = [];
  let initialized = false;

  const inputHiddenTrigger = () => {
    inputHidden.click();
    inputHidden.value = '';
  };

  const initUploadElements = () => {
    const uploadStatus = element('div', ['upload__status']);
    fileUploadArea.insertAdjacentElement('afterend', uploadStatus);

    const uploadLoad = element('div', ['upload__loading']);
    uploadStatus.appendChild(uploadLoad);

    const uploadUploaded = element('div', ['upload__uploaded']);
    uploadStatus.appendChild(uploadUploaded);
  };

  const removeUploadElements = () => {
    const uploadStatus = document.querySelector('.upload__status');
    if (uploadStatus) {
      uploadStatus.remove();
      initialized = false;
    }
  };

  const loadFilesHandler = (event) => {
    event.preventDefault();

    if (!initialized) {
      initUploadElements();
      initialized = true;
    }

    const newFiles = Array.from(
      event.dataTransfer?.files ?? event.target?.files ?? []
    );
    newFiles.forEach((file) => {
      files.push(file);
    });

    displayLoadFile();
  };

  const displayLoadFile = () => {
    const uploadLoad = document.querySelector('.upload__loading');
    if (files.length > options.limit) {
      files.pop();
      errorMessageAlert('You can only upload 3 files at a time');
      return;
    }

    files.forEach((file) => {
      const fileName = file.name;
      const fileType = file.type;

      uploadLoad.innerHTML += createFileProgressEl(fileName, fileType);
    });

    loadFilesCounter();
  };

  const loadFilesCounter = () => {
    const uploadLoad = document.querySelector('.upload__loading');
    const uploadSubtitle = createProgressSubtitleEl(uploadLoad);

    files.length
      ? (uploadSubtitle.innerHTML = `Uploading - ${files.length}/${options.limit} files`)
      : removeUploadElements();
  };

  const fileDeleteHandler = (event) => {
    if (event.target.tagName.toLowerCase() === 'button') {
      const targetElement = event.target.closest('.upload__progress');
      if (targetElement) {
        const fileNameElement = targetElement.querySelector('.progress__name');
        const fileName = fileNameElement.innerText;

        targetElement.remove();

        if (fileName) {
          files = files.filter((file) => file.name !== fileName);
          loadFilesCounter();
        }
      }
    }
  };

  const displayUploadedFile = async (uploadTask, fileName, fileType) => {
    const uploadUploaded = document.querySelector('.upload__uploaded');
    const progressElements = document.querySelectorAll('.progress');
    const uploadedSubtitle = createProgressSubtitleEl(uploadUploaded);

    for (const el of progressElements) {
      if (!options.accept.includes(fileType)) {
        uploadTask.cancel();
        el.classList.add('_error');
        break;
      }

      if (el.dataset.type === fileType) {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progressBars = document.querySelectorAll('.progress__bar');
            const percentProgress = Math.floor(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            progressBars.forEach((progressBar) => {
              progressBar.style.width = percentProgress + '%';
            });
            if (percentProgress === 100) {
              el.remove();
              uploadedSubtitle.innerHTML = 'Uploaded';
            }
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
            uploadUploaded.innerHTML += createFileProgressUploadedEl(
              fileName,
              fileURL
            );
          }
        );
        continue;
      }
    }
  };

  fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('_active');
  });
  fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('_active');
  });
  inputHidden.addEventListener('change', loadFilesHandler);
  fileUploadArea.addEventListener('drop', loadFilesHandler);
  fileUploadArea.addEventListener('click', inputHiddenTrigger);
  upload.addEventListener('click', fileDeleteHandler);
  uploadBtn.addEventListener('click', () => {
    if (files.length > 0) {
      options.onUpload(files, displayUploadedFile);
    } else {
      errorMessageAlert('Please select files before uploading.');
      return;
    }
  });
}
