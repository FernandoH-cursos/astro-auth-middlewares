import { defineAction } from "astro:actions";
import { z } from "astro:schema";

import { firebase } from "@/firebase/config";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";

export const loginUser = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ email, password, remember_me },{cookies}) => {
    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 año
        path: "/",
      });
    } else {
      cookies.delete("email", {
        path: "/",
      });
    }
    try {
      const { user } = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );
      console.log(user);

      return {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
      };
    } catch (error) {
      const firebaseError = error as AuthError;
      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error("El email ya existe");
      }
      console.log(firebaseError);
      throw new Error("No se puede iniciar sesión");
    }
  },
});
