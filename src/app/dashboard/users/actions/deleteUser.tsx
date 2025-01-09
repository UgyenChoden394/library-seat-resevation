'use server'
import { db } from '@/app/firebase/config';
import { deleteDoc, doc } from 'firebase/firestore';
// import { deleteUserFirebase } from '../../../../../firebaseAdmin';

export const deleteUserFromFirebase = async (userId: string) => {
    try { 
      // Delete user from Firebase Authentication Please help me to code for delete user of authentication 

      // await deleteUserFirebase(userId);
      // console.log(`Successfully deleted user with UID: ${userId} from Firebase Authentication`);

      const userDocRef = doc(db, 'user', userId);
      await deleteDoc(userDocRef);
      // await deleteUser(userDocRef);
      
    } catch (error) {
      console.error('Error deleting user from Firebase:', error);
      throw new Error('Error deleting user from Firebase Authentication and Firestore');
    }
  };