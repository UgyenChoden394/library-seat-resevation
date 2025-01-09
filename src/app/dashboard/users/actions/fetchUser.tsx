import { db } from '@/app/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const fetchUsers = async () => {
    const usersRef = collection(db, 'user');
    const querySnapshot = await getDocs(usersRef);

    const usersArray = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data() // Document data
    }));

    return usersArray
}
