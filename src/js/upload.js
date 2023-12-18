import {
  createFileProgressEl,
  createProgressSubtitleEl,
  errorMessageAlert,
  initializeUploadStatusElements,
  standardProgressBar,
  uploadedFileProgressBar,
} from './elementsUI';

export function upload(selector, options = {}) {
  const inputHidden = document.querySelector(selector);
  const upload = document.querySelector('.upload');
  const fileUploadArea = document.querySelector('.upload__area');
  const uploadBtn = document.querySelector('.upload__btn');

  let files = [];

  const inputHiddenTrigger = () => {
    inputHidden.click();
    inputHidden.value = '';
  };

  const loadFilesHandler = (event) => {
    event.preventDefault();

    initializeUploadStatusElements(fileUploadArea);

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
    if (!uploadLoad) return;

    const fragment = document.createDocumentFragment();

    if (files.length > options.limit) {
      files.pop();
      errorMessageAlert('You can only upload 3 files at a time');
      return;
    }

    files.forEach((file) => {
      const fileElement = createFileProgressEl(file.name, standardProgressBar);
      if (fileElement) {
        fragment.appendChild(fileElement);
      }
    });

    uploadLoad.appendChild(fragment);

    loadFilesCounter();
  };

  const loadFilesCounter = () => {
    const uploadLoad = document.querySelector('.upload__loading');
    const uploadSubtitle = createProgressSubtitleEl(uploadLoad);

    files.length
      ? (uploadSubtitle.innerHTML = `Uploading - ${files.length}/${options.limit} files`)
      : removeUploadStatus();
  };

  const fileDeleteHandler = async (target) => {
    const targetElement = target.closest('.upload__progress');
    if (!targetElement) return;

    const fileName = targetElement.id;
    if (!fileName) return;

    try {
      targetElement.remove();
      if (options.accept && options.fileUploadTasks[fileName]) {
        await options.fileUploadTasks[fileName].uploadTask.cancel();
      }
      files = files.filter((file) => file.name !== fileName);
      loadFilesCounter();
    } catch (error) {
      console.error('Error during file deletion:', error);
    }
  };

  const manageUploadTaskAndDisplay = async ({
    progressElement,
    uploadedSubtitle,
    name,
    type,
    uploadUploaded,
  }) => {
    if (!progressElement) {
      return;
    }

    if (!options.accept.includes(type)) {
      options.fileUploadTasks[name].uploadTask.cancel();
      progressElement.classList.add('_error');
      return;
    }

    try {
      options.fileUploadTasks[name].uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressBars =
            progressElement.querySelectorAll('.progress__bar');

          const percentProgress = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          progressBars.forEach((progressBar) => {
            progressBar.style.width = percentProgress + '%';
          });
          if (percentProgress === 100) {
            progressElement.remove();
            uploadedSubtitle.textContent = 'Uploaded';
          }
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const fileURL = await options.fileUploadTasks[name].uploadTask
            .snapshot.ref;

          console.log(fileURL);
          uploadUploaded.appendChild(
            createFileProgressEl(name, uploadedFileProgressBar, {
              url: `${fileURL}`,
            })
          );
        }
      );
    } catch (error) {
      console.error('Error managing upload task:', error);
    }
  };

  const removeUploadStatus = () => {
    const uploadStatus = document.querySelector('.upload__status');
    if (uploadStatus) {
      uploadStatus.remove();
    }
    return;
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
  upload.addEventListener('click', ({ target }) => {
    if (target.classList.contains('btn-close')) {
      fileDeleteHandler(target);
    } else {
      return;
    }
  });
  uploadBtn.addEventListener('click', async () => {
    if (files.length > 0) {
      await options.onUpload(files, manageUploadTaskAndDisplay);
      return;
    } else {
      errorMessageAlert('Please select files before uploading.');
      return;
    }
  });
}
