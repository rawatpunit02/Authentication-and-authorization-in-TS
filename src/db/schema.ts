import { timestamp } from "drizzle-orm/cockroach-core";
import { integer,uuid, pgTable, varchar,text,boolean } from "drizzle-orm/pg-core";
import z from "zod";

export const usersTable = pgTable("users", {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name',{length:45}).notNull(),
  lastName:varchar('last_name',{length:45}),
  email: varchar().notNull().unique(),
  emailvarified:boolean('email_varified').default(false).notNull(),
  password:varchar('password',{length:70}),
  salt:text('salt'),
  createdAt:timestamp('created_at').defaultNow().notNull(),
  updatedAt:timestamp('updated_at').$onUpdate(()=>new Date()),

});