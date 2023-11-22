import '../scss/style.scss';
import { ref, storage, uploadBytesResumable } from './firebase';
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
  onUpload(files, cb) {
    files.forEach((file) => {
      const fileName = file.name;
      const fileType = file.type;
      const fileRef = ref(storage, `files/${fileName}`);
      const uploadTask = uploadBytesResumable(fileRef, file);
      cb(uploadTask, fileName, fileType);
    });
  },
});
