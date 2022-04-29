import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

export default {
  type: "postgresql",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dbName: process.env.DATABASE_NAME,
  name: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  metadataProvider: TsMorphMetadataProvider,
  entities: ["dist/app/core/entities/**/*.js"],
  entitiesTs: ["src/app/core/entities/**/*.ts"],
  migrations: {
    path: "dist/database/migrations",
    pathTs: "src/database/migrations",
  },
  debug: true,
};
