import { defineAction } from 'astro:actions';

import { firebase } from '@/firebase/config';
import { signOut } from 'firebase/auth';

export const logout = defineAction({
  accept: "json",
  handler: async () => {
    //* signOut() es un método que cierra la sesión del usuario actual. 
    return await signOut(firebase.auth);
  },
});