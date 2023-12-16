import { createElement } from './utils.js';

export const createBaseProgressBar = (
  fileName = null,
  additionalClasses = []
) => {
  const fileProgressEl = createElement('div', [
    'upload__progress',
    'progress',
    ...additionalClasses,
  ]);
  fileProgressEl.id = fileName;
  const detailsDiv = createElement('div', ['progress__details']);
  fileProgressEl.appendChild(detailsDiv);
  return { fileProgressEl, detailsDiv };
};

export const createFileProgressEl = (fileName, progressBar, options = {}) => {
  const existingElement = document.getElementById(`progress-${fileName}`);
  if (existingElement) return null;
  return progressBar(fileName, options);
};

export const standardProgressBar = (fileName, options = {}) => {
  const { fileProgressEl, detailsDiv } = createBaseProgressBar(fileName);
  detailsDiv.innerHTML = ` 
      <span class="progress__name" id="progress-${fileName}">
        ${fileName}
      </span>
      <button type="button" class="progress__btn progress__btn--cross btn-reset btn-close">
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
      </button>`;
  const progressBg = createElement('div', ['progress__bg']);
  const progressBgBar = createElement('div', ['progress__bar']);
  const progressErrorMsg = createElement(
    'p',
    ['progress__msg'],
    'This document is not supported, please delete and upload another file.'
  );
  progressBg.appendChild(progressBgBar);
  fileProgressEl.append(progressBg, progressErrorMsg);

  return fileProgressEl;
};

export const uploadedFileProgressBar = (fileName, options = {}) => {
  const { fileProgressEl, detailsDiv } = createBaseProgressBar(fileName, [
    '_uploaded',
  ]);

  detailsDiv.innerHTML = `
        <a href="${options.url || '#'}" target="_blank" class="progress__link">
          <span class="progress__name" id="progress-${fileName}">
            ${fileName}
          </span>
        </a>
        <button type="button" class="btn-reset progress__btn progress__btn--basket btn-close">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.47692 1.14517H6.47736C6.46399 1.14054 6.45009 1.13753 6.436 1.13614H5.37174V0.253477C5.3718 0.187144 5.3458 0.12346 5.29945 0.0760839C5.25304 0.0287123 5.18995 0.00138376 5.12369 0H2.60672C2.53948 0 2.47501 0.026666 2.42752 0.0742178C2.37997 0.12177 2.35324 0.186236 2.35324 0.253475V1.13614H1.29439C1.2803 1.13753 1.2664 1.14054 1.25303 1.14517H0.253471C0.162881 1.14517 0.0792062 1.19345 0.0339488 1.27188C-0.0113163 1.35031 -0.0113163 1.44691 0.0339488 1.52535C0.0792139 1.60378 0.162882 1.65211 0.253471 1.65211H1.06783L1.72585 7.7735C1.7329 7.8358 1.76263 7.89328 1.8094 7.93511C1.85611 7.97689 1.91661 7.99994 1.97932 8H5.75462C5.81668 7.9991 5.87627 7.97556 5.92233 7.93391C5.96831 7.89219 5.99751 7.83519 6.00449 7.7735L6.66245 1.66105H7.47687C7.56746 1.66105 7.65114 1.61277 7.69639 1.53434C7.74165 1.45591 7.74166 1.35924 7.69639 1.28087C7.65113 1.20244 7.56746 1.1541 7.47687 1.1541L7.47692 1.14517ZM2.86566 0.506945H4.86472V1.13614H2.86566V0.506945ZM5.52455 7.48941H2.20582L1.57663 1.66111H6.15368L5.52455 7.48941Z" fill="#E41D1D"/>
          <path d="M3.86529 6.89624C3.93252 6.89624 3.99699 6.86951 4.04454 6.82202C4.09209 6.77447 4.11876 6.71 4.11876 6.64276V2.50796C4.11876 2.41737 4.07049 2.33369 3.99205 2.28843C3.91362 2.24311 3.81696 2.24311 3.73852 2.28843C3.66009 2.3337 3.61182 2.41737 3.61182 2.50796V6.64276C3.61182 6.71 3.63848 6.77446 3.68603 6.82202C3.73359 6.86951 3.79805 6.89624 3.86529 6.89624H3.86529Z" fill="#E41D1D"/>
          <path d="M2.8674 6.89438H2.87817C2.94511 6.89161 3.00819 6.86242 3.0537 6.81324C3.09915 6.76406 3.12334 6.69887 3.12088 6.63193L2.96805 2.49713L2.96811 2.49707C2.96672 2.42935 2.93777 2.36506 2.88787 2.3192C2.83791 2.27339 2.77146 2.24997 2.7038 2.25437C2.63687 2.2572 2.57379 2.28639 2.52834 2.33557C2.48283 2.38475 2.45869 2.44994 2.4611 2.51688L2.61393 6.65168C2.61712 6.71687 2.64517 6.77839 2.69236 6.82353C2.73949 6.86861 2.80215 6.89401 2.8674 6.89437L2.8674 6.89438Z" fill="#E41D1D"/>
          <path d="M4.85396 6.89439H4.86293C4.92975 6.8959 4.99445 6.8711 5.04321 6.82541C5.0919 6.77966 5.1208 6.71664 5.12362 6.64988L5.27646 2.51507H5.2764C5.27886 2.44814 5.25466 2.38295 5.20922 2.33377C5.16371 2.28459 5.10063 2.2554 5.03369 2.25257C4.96525 2.24553 4.89699 2.26762 4.84565 2.31348C4.79431 2.35929 4.76469 2.42466 4.76403 2.49353L4.60939 6.62833H4.60945C4.60602 6.69617 4.62998 6.76256 4.67597 6.81258C4.7219 6.8626 4.78606 6.8921 4.85396 6.89438L4.85396 6.89439Z" fill="#E41D1D"/>
          </svg>
        </button>
`;

  return fileProgressEl;
};

export const createProgressSubtitleEl = (parentElement) => {
  let uploadSubtitle = parentElement.querySelector('.upload__subtitle');

  if (!uploadSubtitle) {
    uploadSubtitle = createElement('h3', ['upload__subtitle']);
    parentElement.insertBefore(uploadSubtitle, parentElement.firstChild);
  }

  return uploadSubtitle;
};

export const initializeUploadStatusElements = (fileUploadArea) => {
  let elements = {};

  if (!document.querySelector('.upload__status')) {
    const uploadStatus = createElement('div', ['upload__status']);
    fileUploadArea.insertAdjacentElement('afterend', uploadStatus);
    elements.uploadStatus = uploadStatus;

    const uploadLoad = createElement('div', ['upload__loading']);
    uploadStatus.appendChild(uploadLoad);
    elements.uploadLoad = uploadLoad;

    const uploadUploaded = createElement('div', ['upload__uploaded']);
    uploadStatus.appendChild(uploadUploaded);
    elements.uploadUploaded = uploadUploaded;
  }

  return elements;
};

export const errorMessageAlert = (msgText) => {
  const mainNode = document.querySelector('.main');
  const existingAlert = mainNode.querySelector('.alert-message');

  if (existingAlert) {
    existingAlert.textContent = msgText;
  } else {
    const alertMessageNode = createElement('div', ['alert-message']);
    mainNode.appendChild(alertMessageNode);
    alertMessageNode.textContent = msgText;

    setTimeout(() => {
      alertMessageNode.remove();
    }, 3000);
  }
};
