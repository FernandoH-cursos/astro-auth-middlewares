// No funciona por el nombre del arhivo.

// Este archivo solo es una demostracion de proteccion de rutas privadas con autenticacion basica 

import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = ["/protected"];

//* Este middleware se ejecutará antes de cada petición(endpoint o pagina) 
export const onRequest = defineMiddleware(({ url, request }, next) => {
  const authHeaders = request.headers.get("authorization") ?? '';

  //* Si la ruta solicitada es privada... 
  if (privateRoutes.includes(url.pathname)) {
   return checkLocalAuth(authHeaders, next);
  }

  return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  //* Si hay un header de autenticación... 
  if (authHeaders) {
    //* Obtenemos el valor de autenticación
    const authValue = authHeaders.split(" ").at(-1) ?? "user:pass";
    //* Decodificamos el valor en base64 de la autenticación
    const decodedValue = atob(authValue).split(":");
    console.log(decodedValue);
    const [user, password] = decodedValue;

    //* Si el usuario y contraseña son correctos...
    if (user === "admin" && password === "admin") {
      return next();
    }
  }

 return new Response("Auth Necesaria", {
   //* "401" significa que el cliente debe autenticarse para obtener la respuesta solicitada.
   status: 401,
   headers: {
     //* Este header indica que el cliente debe autenticarse para obtener la respuesta solicitada.
     //* El valor de este header debe ser "Basic" seguido de un espacio y el nombre de usuario y contraseña codificados en base64.
     "WWW-Authenticate": 'Basic realm="Secure Area"',
   },
 });
}
