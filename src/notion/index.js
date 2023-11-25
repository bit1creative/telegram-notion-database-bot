import { Client as NotionClient } from "@notionhq/client";
import { findDatabase } from "./utils.js";

export const notionClient = new NotionClient({
  auth: process.env.NOTION_API_TOKEN,
});

const database = await findDatabase(process.env.NOTION_DATABASE_ID);
