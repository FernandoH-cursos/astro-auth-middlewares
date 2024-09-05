// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPK1cSamg0iLByakvdHWJOcHbr8GXXR0E",
  authDomain: "astro-auth-e7995.firebaseapp.com",
  projectId: "astro-auth-e7995",
  storageBucket: "astro-auth-e7995.appspot.com",
  messagingSenderId: "645250712254",
  appId: "1:645250712254:web:a3db5558adb528111314ef",
};

//* 'initializeApp' inicializa una aplicación de Firebase. 
const app = initializeApp(firebaseConfig);
//* 'getAuth' devuelve una instancia de 'Auth' que se puede utilizar para autenticar con Firebase. 
const auth = getAuth(app);
//* Permite cambiar el idioma de los mensajes de error de Firebase a idioma español. 
auth.languageCode = "es";

export const firebase = {
  app,
  auth,
};
