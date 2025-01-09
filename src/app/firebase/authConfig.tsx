import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from './config';
import { redirect } from 'next/navigation';

export const fetchCurrentUserData = async () => {
  const user = JSON.parse(sessionStorage.getItem('user') as string);
  // Handling the empty route here
  if (!user || !user.email) {
    redirect('/auth/login')
  }

  try {
    const usersRef = collection(db, "user");
    const q = query(usersRef, where("email", "==", user?.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Get the first document (assuming emails are unique)
      return {
        student_id: userDoc.data().student_id,
        role: userDoc.data().role,
      };
    } else {
      throw new Error('No user found with the given email');
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
};
