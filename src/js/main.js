import '../scss/style.scss';
import { createProgressSubtitleEl } from './elementsUI';
import { firebaseUpload } from './firebase';
import { upload } from './upload';

upload('#file', {
  limit: 3,
  accept: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'text/plain',
  ],
  fileUploadTasks: {},
  onUpload(files, fileUploadCallback) {
    files.forEach(async (file) => {
      const { name, type } = file;

      const uploadUploaded = document.querySelector('.upload__uploaded');
      const progressElement = document.getElementById(`${name}`);
      const uploadedSubtitle = createProgressSubtitleEl(uploadUploaded);

      if (!this.fileUploadTasks[name]) {
        const uploadTask = firebaseUpload(file);
        this.fileUploadTasks[name] = { uploadTask };
      } else {
        return;
      }

      const fileInfo = {
        name,
        type,
        progressElement,
        uploadedSubtitle,
        uploadUploaded,
      };

      fileUploadCallback(fileInfo);
    });
  },
});
