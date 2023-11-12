// export function upload(options = {}) {
//   const dragArea = document.querySelector('.upload__dragarea');
//   const inputHidden = document.querySelector('.input-hidden');
//   const browseArea = document.querySelector('.upload__form');
//   const uploadErrorField = document.querySelector('.upload__error');
//   const uploadLoading = document.querySelector('.upload__loading');
//   const uploadUploaded = document.querySelector('.upload__uploaded');
//   const uploadBtn = document.querySelector('.upload__btn');
//   const storageRef = ref(storage);
//   let totalFiles = 0;
//   let uploadedFiles = 0;
//   let filesToUpload = [];
//   let uploadedFileIds = [];
//   const UPLOAD_LIMIT = 3;

//   function createSubtitle() {
//     let uploadSubtitle = document.querySelector('.upload__subtitle');

//     if (!uploadSubtitle) {
//       uploadSubtitle = document.createElement('h3');
//       uploadSubtitle.className = 'upload__subtitle';
//       uploadLoading.appendChild(uploadSubtitle);
//     }

//     return uploadSubtitle;
//   }

//   function getUploadErrorElement() {
//     return document.querySelector('.upload__error--wrap');
//   }

//   function loadingFile() {
//     const uploadSubtitle = createSubtitle();

//     if (totalFiles > UPLOAD_LIMIT) {
//       filesToUpload.pop();
//       return;
//     }

//     filesToUpload.forEach((file) => {
//       let fileName = file[0].name;
//       let fileType = file[0].type;

//       if (!options.validFormatas.includes(fileType)) {
//         uploadErrorField.innerHTML = createErrorFile(fileName);
//       } else {
//         if (!uploadedFileIds.includes(fileName)) {
//           uploadedFileIds.push(fileName);
//           console.log(uploadedFileIds);
//           uploadedFiles++;
//           uploadSubtitle.textContent = `Uploading - ${uploadedFiles}/${UPLOAD_LIMIT} files`;
//           uploadLoading.innerHTML += createProgressFile(fileName);
//         }
//       }
//     });

//     const closeButtons = [...document.querySelectorAll('.btn-close')];
//     const fileError = getUploadErrorElement();

//     closeButtons.forEach((closeButton) => {
//       if (closeButton) {
//         closeButton.addEventListener('click', () => {
//           const fileName = closeButton.getAttribute('id');

//           const filteredFiles = filesToUpload.filter(
//             (uploadedFile) => uploadedFile[0].name !== fileName
//           );

//           filesToUpload.length = 0;
//           filesToUpload.push(...filteredFiles);
//           if (fileError) {
//             fileError.remove();
//           }
//         });
//       }
//     });
//   }

//   function uploadToStorage() {
//     const fileError = getUploadErrorElement();

//     if (fileError) {
//       errorMessage.style.display = 'block';

//       setTimeout(() => {
//         errorMessage.style.display = 'none';
//       }, 3000);
//     } else {
//       filesToUpload.forEach((file) => {
//         let fileName = file[0].name;
//         let fileType = file[0].type;
//         console.log(fileName);
//         const fileRef = ref(storageRef, `files/${fileName}`);

//         if (options.validFormatas.includes(fileType)) {
//           const uploadTask = uploadBytesResumable(fileRef, file);

//           uploadTask.on(
//             'state_changed',
//             (snapshot) => {
//               const progress =
//                 (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//               const progressBar = document.querySelectorAll('.progress__bar');

//               progressBar.forEach((e) => {
//                 e.style.width = progress + '%';
//               });

//               if (progress === 100) {
//                 uploadLoading.innerHTML = '';
//               }
//             },
//             (error) => {
//               console.log(error);
//             },
//             async () => {
//               const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
//               // здесь еще хорошо бы удалить файлы из незагруженных
//               return (uploadUploaded.innerHTML += createUploadedFile(
//                 fileName,
//                 fileURL
//               ));
//             }
//           );
//         } else {
//           return;
//         }
//       });
//     }
//   }

//   browseArea.onclick = () => {
//     inputHidden.click();
//   };

//   inputHidden.addEventListener('change', (e) => {
//     const newFiles = Array.from(e.target.files);

//     totalFiles += newFiles.length;
//     filesToUpload.push(newFiles);
//     loadingFile();
//   });

//   dragArea.addEventListener('dragover', (e) => {
//     e.preventDefault();
//     dragArea.classList.add('_active');
//   });

//   dragArea.addEventListener('dragleave', () => {
//     dragArea.classList.remove('_active');
//   });

//   dragArea.addEventListener('drop', (e) => {
//     e.preventDefault();
//     const newFiles = Array.from(e.dataTransfer.files);
//     totalFiles += newFiles.length;
//     filesToUpload.push(newFiles);
//     loadingFile();
//   });

//   uploadBtn.addEventListener('click', uploadToStorage);
// }
