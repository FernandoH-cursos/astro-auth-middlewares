import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { firebase } from "@/firebase/config";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

export const loginWithGoogle = defineAction({
  accept: "json",
  input: z.any(),
  handler: async (credentials) => {
    // console.log(credentials);

    //* Permitir que el usuario inicie sesión con Google y devuelve el usuario 
    const credential = GoogleAuthProvider.credentialFromResult(credentials);
    // console.log(credential);
    if (!credential) {
      throw new Error("No se pudo iniciar sesión con Google");
    }

    //* Permite que el usuario inicie sesión con Google 
    await signInWithCredential(firebase.auth, credential!);

    return {ok: true};
  }
});
