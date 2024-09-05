import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/config";

const privateRoutes = ["/protected"];
const notAuthenticatedRoute = ["/login", "/register"];

//* Este middleware se ejecutará antes de cada petición(endpoint o pagina) 
export const onRequest = defineMiddleware(({ url, locals,redirect }, next) => {
  //* Data del usuario logueado
  const user = firebase.auth.currentUser;
  //* Verificar que el usuario este logueado
  const isLoggedIn = !!user;

  //* Seteando variable para determinar si el usuario esta logueado y se pase a las vistas
  locals.isLoggedIn = isLoggedIn;

  if (user) {
    //* Seteando el usuario en la variable locals para que se pueda acceder en las vistas
    locals.user = {
      email: user.email!,
      name: user.displayName!,
      avatar: user.photoURL ?? "",
      emailVerified: user.emailVerified,
    };
  }

  //* Redireccionar a la pagina de inicio si el usuario no esta logueado y trata de acceder a una ruta privada 
  if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
    return redirect("/");
  }

  //* Redireccionar a la pagina de inicio si el usuario esta logueado y trata de acceder a una ruta de login o register
  if (isLoggedIn && notAuthenticatedRoute.includes(url.pathname)) {
    return redirect("/");
  }

  return next();
});

