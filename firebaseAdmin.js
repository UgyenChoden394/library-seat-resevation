const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

// Replace with the path to your service account key
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Or use admin.credential.cert(serviceAccount) with a service account file
  });
}

export const deleteUserFirebase = async (userId) => { 
  try {
    await admin.auth().deleteUser(userId);
    console.log(`Successfully deleted user with UID: ${userId}`);
  } catch (error) {
    console.error('Error deleting user from Firebase Authentication:', error);
    throw error;
  }
};

export const db = admin.firestore();
export const auth = admin.auth();
