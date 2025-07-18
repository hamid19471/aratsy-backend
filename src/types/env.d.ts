namespace NodeJS {
  interface ProcessEnv {
    APP_PORT: number;
    DB_URL: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    ACCESS_TOKEN_SECRET_KEY: string;
    REFRESH_TOKEN_SECRET_KEY: string;
  }
}
