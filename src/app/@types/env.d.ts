declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
    readonly OPEN_AI_API_KEY: string;
    readonly OPEN_AI_PROJECT_KEY: string;
  }
}
