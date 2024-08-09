import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Input, Button, Radio, Space, message } from "antd";
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser as _deleteUser,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { firebaseConfig } from "../../data/firebaseConfig";
import {
  child,
  get,
  getDatabase,
  onValue,
  ref,
  set,
  update,
} from "firebase/database";

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
