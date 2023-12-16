import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

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

export const firebaseUpload = (file) => {
  const storageRef = ref(storage, `uploads/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return uploadTask;
};
