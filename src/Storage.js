import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, push, update, remove } from 'firebase/database';

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

export const getAddPersonId = (roomId) => {
  return push(child(ref(db), `room/${roomId}/people`)).key;
};

export const getPrayRoomData = async (id) => {
  return await get(child(ref(db), `rooms/${id}`)).then((snapshot) => snapshot.val());
};

export const addPrayPerson = async (roomId, personId, name) => {
  const updates = {};
  updates[`rooms/${roomId}/people/` + personId] = { name };

  return await update(ref(db), updates);
};

export const getPerson = async (roomId, personId) => {
  return await get(child(ref(db), `rooms/${roomId}/people`)).then((snapshot) => snapshot.val()[personId]);
};

export const setPrays = async (roomId, personId, prays) => {
  return await set(ref(db, `rooms/${roomId}/people/${personId}/prays`), prays);
};

export const removePerson = async (roomId, personId) => {
  await remove(ref(db, `rooms/${roomId}/people/${personId}`));
};
