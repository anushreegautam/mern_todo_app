declare global {
  namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        PORT: string;
        ATLAS_URI: string;
        PRIVATE_RSA_KEY: string;
        PUBLIC_RSA_KEY: string;
      }
  }
}

export {}