import { getFirestore } from "firebase/firestore/lite";
import { firebaseApp } from "./firebase-app";

export const publicDb = getFirestore(firebaseApp);
