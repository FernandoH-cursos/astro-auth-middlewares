/// <reference path="../.astro/types.d.ts" />

interface User {
  email: string;
  name: string;
  avatar: string;
  emailVerified: boolean;
}

declare namespace App{
  //* Tipando el objeto locals de astro que se usa en el middleware 
  interface Locals {
    isLoggedIn: boolean;
    user: User | null;
  }
}

interface ImportMetaEnv {
  readonly WEBSITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
