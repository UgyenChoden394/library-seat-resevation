import { db } from '@/app/firebase/config';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

export const addSeat = async (seatData: any) => {
    const seatsCollection = collection(db, 'seats');
    return await addDoc(seatsCollection, seatData);
  };

export const getSeatsData = async () => {
  const seatsCollection = collection(db, 'seats');
  const seatsSnapshot = await getDocs(seatsCollection);
  return seatsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()} ));
}

export const deleteSeat = async (seatId: string) => {
  const seatDoc = doc(db, 'seats', seatId);
  return await deleteDoc(seatDoc);
};

export const updateSeat = async (seatId: string, updatedData: any) => {
  const seatDoc = doc(db, 'seats', seatId);
  return await updateDoc(seatDoc, updatedData);
};
