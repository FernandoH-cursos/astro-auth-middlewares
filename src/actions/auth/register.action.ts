import { defineAction} from 'astro:actions';
import { z } from 'astro:schema';

import { firebase } from '@/firebase/config';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, type AuthError } from 'firebase/auth';

export const registerUser = defineAction({
  //* "form" significa que el server action espera un FormData. 
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, password, remember_me, email }, { cookies }) => {
    //* Las 'cookies' son un objeto que permite leer, escribir y borrar cookies del cliente. Son utilizadas para almacenar 
    //* información en el navegador del usuario y se pueden leer en el cliente y en el servidor.
    if (remember_me) {
      //* Se crea una cookie con el email del usuario que expira en 1 año.
      //* 'expires' es la fecha de expiración de la cookie. Sirve para indicar al navegador cuándo debe eliminar la cookie, es decir,
      //* cuándo debe dejar de enviarla en las solicitudes.
      //* 'path' es la ruta en la que la cookie es válida. Si se establece en '/', la cookie será válida en todo el sitio. 
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 año
        path: "/",
      });
    } else {
      //* Si el usuario no selecciona 'recordarme', se elimina la cookie.
      //* 'delete' elimina una cookie. Se le pasa el nombre de la cookie y un objeto con las opciones de la cookie.
      //* Se usa 'path' para eliminar la cookie en la misma ruta en la que se creó. 
      cookies.delete("email", {
        path: "/",
      });
    }

    try {
      //* createUserWithEmailAndPassword() crea un nuevo usuario con un email y contraseña.
      const { user } = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password
      );

      //* updateProfile() actualiza el perfil de un usuario. En este caso, se actualiza el nombre del usuario.
      updateProfile(firebase.auth.currentUser!, {
        displayName: name,
      });

      //* sendEmailVerification() envía un email de verificación al usuario.
      await sendEmailVerification(firebase.auth.currentUser!, {
        //* 'url' es la URL a la que se redirigirá al usuario después de verificar su email. 
        url: `${import.meta.env.WEBSITE_URL}?emailVerified=true`,
      });

      return {
        email: user.email,
        name: user.displayName,
        uid: user.uid,
      };
    } catch (error) {
      const firebaseError = error as AuthError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        throw new Error('El email ya está en uso');
        
      }
      throw new Error('Auxilio, algo salió mal');
    }

  },
});
