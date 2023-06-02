import { initializeApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag);

  if (classes.length) {
    node.classList.add(...classes);
  }

  if (content) {
    node.textContent = content;
  }

  return node;
};

const firebaseConfig = {
  apiKey: 'AIzaSyAFxj1iSgSZMBLu86Lj1cwklRQx-BKs8l8',
  authDomain: 'fe-upload-f3229.firebaseapp.com',
  projectId: 'fe-upload-f3229',
  storageBucket: 'fe-upload-f3229.appspot.com',
  messagingSenderId: '757466309479',
  appId: '1:757466309479:web:c94ffa2c7e4c405386c5c2',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export function upload(options = {}) {
  const dragArea = document.querySelector('.upload__dragarea');
  const btnBrowse = document.querySelector('.upload__btn');
  const inputHidden = document.querySelector('.input-hidden');
  const uploadErrorField = document.querySelector('.upload__error');
  const uploadLoading = document.querySelector('.upload__loading');
  let file;
  let number = 0;
  const storageRef = ref(storage);
  const createSubTitle = element('h3', ['upload__subtitle']);

  btnBrowse.onclick = () => {
    inputHidden.click();
  };

  function loadingFile() {
    let fileName = file.name;
    let progress = document.querySelectorAll('.progress');
    const fileRef = ref(storageRef, fileName);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get the progress percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const progressBar = document.querySelector('.progress__bar');
        progressBar.style.width = progress + '%';
      },
      (error) => {
        console.error('Error uploading file:', error);
        // Handle any errors that occur during the upload
      },
      () => {
        console.log('File uploaded');
      }
    );

    uploadLoading.innerHTML += `
		<div class="progress">
			<div class="progress__details">
				<p class="progress__file">${fileName}.PDF</p>
				<button class="btn-reset progress__btn">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8 16C5.87833 16 3.84331 15.1571 2.34315 13.6568C0.842901 12.1565 0 10.1217 0 8C0 5.87833 0.842901 3.84331 2.34315 2.34315C3.84353 0.842902 5.87833 2.49558e-07 8 2.49558e-07C10.1217 2.49558e-07 12.1567 0.842902 13.6568 2.34315C15.1571 3.84353 16 5.87833 16 8C15.9974 10.121 15.1538 12.1545 13.654 13.654C12.1543 15.1538 10.1207 15.9974 8 16V16ZM11.0851 5.94242V5.94229C11.2254 5.80678 11.3053 5.62063 11.3071 5.42558C11.3088 5.23053 11.2321 5.04292 11.0941 4.90496C10.9562 4.76701 10.7686 4.69031 10.5735 4.69202C10.3784 4.69372 10.1923 4.77371 10.0568 4.91397L8 6.97149L5.94323 4.91397C5.75853 4.7356 5.49346 4.66779 5.2457 4.73572C4.99805 4.80366 4.8046 4.99713 4.73665 5.24478C4.66871 5.49254 4.73653 5.7576 4.9149 5.9423L6.97167 7.99983L4.9149 10.0573C4.77464 10.1929 4.69465 10.379 4.69294 10.5741C4.69124 10.7691 4.76794 10.9567 4.90589 11.0947C5.04383 11.2326 5.23145 11.3093 5.4265 11.3076C5.62155 11.3059 5.8077 11.2259 5.94322 11.0857L7.99999 9.02815L10.0568 11.0857C10.1923 11.2259 10.3784 11.3059 10.5735 11.3076C10.7685 11.3093 10.9561 11.2326 11.0941 11.0947C11.2321 10.9567 11.3088 10.7691 11.307 10.5741C11.3053 10.379 11.2253 10.1929 11.0851 10.0573L9.02832 7.99983L11.0851 5.94242Z"
							fill="#E41D1D"
						/>
					</svg>
				</button>
			</div>
			<div class="progress__bg">
				<div style="width: 10% " class="progress__bar"></div>
			</div>
		</div>`;

    return uploadLoading;
  }

  function loadingCounter() {
    uploadLoading.append(createSubTitle);

    if (number === 3) {
      return;
    } else {
      return (createSubTitle.innerHTML = `Uploading - ${(number += 1)}/3 files`);
    }
  }

  function fileLoadError() {
    let fileName = file.name;
    uploadErrorField.innerHTML = `<div class="upload__error--wrap">
		<div class="upload__file upload__file--error">
			<p class="upload__name">${fileName}</p>
			<button type="button" class="btn-reset btn-close">
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8 16C5.87833 16 3.84331 15.1571 2.34315 13.6568C0.842901 12.1565 0 10.1217 0 8C0 5.87833 0.842901 3.84331 2.34315 2.34315C3.84353 0.842902 5.87833 2.49558e-07 8 2.49558e-07C10.1217 2.49558e-07 12.1567 0.842902 13.6568 2.34315C15.1571 3.84353 16 5.87833 16 8C15.9974 10.121 15.1538 12.1545 13.654 13.654C12.1543 15.1538 10.1207 15.9974 8 16V16ZM11.0851 5.94242V5.94229C11.2254 5.80678 11.3053 5.62063 11.3071 5.42558C11.3088 5.23053 11.2321 5.04292 11.0941 4.90496C10.9562 4.76701 10.7686 4.69031 10.5735 4.69202C10.3784 4.69372 10.1923 4.77371 10.0568 4.91397L8 6.97149L5.94323 4.91397C5.75853 4.7356 5.49346 4.66779 5.2457 4.73572C4.99805 4.80366 4.8046 4.99713 4.73665 5.24478C4.66871 5.49254 4.73653 5.7576 4.9149 5.9423L6.97167 7.99983L4.9149 10.0573C4.77464 10.1929 4.69465 10.379 4.69294 10.5741C4.69124 10.7691 4.76794 10.9567 4.90589 11.0947C5.04383 11.2326 5.23145 11.3093 5.4265 11.3076C5.62155 11.3059 5.8077 11.2259 5.94322 11.0857L7.99999 9.02815L10.0568 11.0857C10.1923 11.2259 10.3784 11.3059 10.5735 11.3076C10.7685 11.3093 10.9561 11.2326 11.0941 11.0947C11.2321 10.9567 11.3088 10.7691 11.307 10.5741C11.3053 10.379 11.2253 10.1929 11.0851 10.0573L9.02832 7.99983L11.0851 5.94242Z"
						fill="#E41D1D"
					/>
				</svg>
			</button>
		</div>
			<p class="upload__msg">
				This document is not supported, please delete and upload another
				file.
			</p>
		</div>`;

    const errorFile = document.querySelector('.upload__error--wrap');

    document.querySelector('.btn-close').addEventListener('click', () => {
      errorFile.remove();
    });

    return uploadErrorField;
  }

  // ====================================

  function fileLoad() {
    let fileType = file.type;

    if (!options.validFormates.includes(fileType)) {
      return fileLoadError();
    } else {
      return loadingFile();
    }
  }

  // ===================================

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
    console.log(file);
    fileLoad();
  });
}

export default app;
