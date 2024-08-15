import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  child,
  get,
  getDatabase,
  ref
} from "firebase/database";
import { firebaseConfig } from "../../data/firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const dbRef = ref(database);

export const login = (user, pass) => {
  return setPersistence(auth, browserLocalPersistence).then(() => {
    return signInWithEmailAndPassword(auth, user, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        return {
          status: "success",
          user: user,
        };
      })
      .catch((error) => {
        return {
          status: "error",
          code: error.code,
          message: error.message,
        };
      });
  });
};

export const logout = () => {
  return signOut(auth)
    .then(() => {
      return {
        status: "success",
      };
    })
    .catch((error) => {
      return {
        status: "error",
        code: error.code,
        message: error.message,
      };
    });
};

export const getUserRole = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const roleSnapshot = await get(child(dbRef, `/users/${user.uid}/role`));
          resolve({
            role: roleSnapshot.val() || null,
            ...user,
          });
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const getStudentUid = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        resolve(null);
      }
    });

    if (auth.currentUser) {
      unsubscribe();
      resolve(auth.currentUser.uid);
    }

    setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, 5000);
  });
};