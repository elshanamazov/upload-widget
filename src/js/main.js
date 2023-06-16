import '../scss/style.scss';
import { upload } from './upload.js';

upload({
  validFormatas: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'text/plain',
  ],
});
