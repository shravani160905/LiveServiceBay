import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // This safely passes your Supabase connection string from the .env file to Prisma 7
    url: process.env.DATABASE_URL,
  }
});