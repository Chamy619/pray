import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js';

const firebaseConfig = {
  apiKey: 'AIzaSyC5LLvcicXUaHy6b1SwyKVKpicNqXqYf-4',
  authDomain: 'pray-80ba6.firebaseapp.com',
  projectId: 'pray-80ba6',
  databaseURL: 'https://pray-80ba6-default-rtdb.asia-southeast1.firebasedatabase.app',
  storageBucket: 'pray-80ba6.appspot.com',
  messagingSenderId: '506173166495',
  appId: '1:506173166495:web:04d01c518c4a896a6aa3aa',
  measurementId: 'G-9WPTT04XQH',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const getPrayRoomData = async (id) => {
  return await get(child(ref(db), `rooms/${id}`)).then((snapshot) => snapshot.val());
};

export const addPrayPerson = async (id, name) => {
  const newPersonKey = push(child(ref(db), `rooms/${id}/people`)).key;

  const updates = {};
  updates[`rooms/${id}/people/` + newPersonKey] = { name };

  return await update(ref(db), updates);
};

export const getPerson = async (roomId, personId) => {
  return await get(child(ref(db), `rooms/${roomId}/people`)).then((snapshot) => snapshot.val()[personId]);
};

export const setPray = async (roomId, personId, prays) => {
  return await set(ref(db, `rooms/${roomId}/people/${personId}/prays`), prays);
};
