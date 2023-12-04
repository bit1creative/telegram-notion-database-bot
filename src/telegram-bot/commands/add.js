import { parseMessageToNewEntry } from "../utils.js";
import {
  findDatabase,
  createNotionDatabaseEntry,
  addPageToDatabase,
} from "../../notion/utils.js";

export const addHandler = async (ctx) => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const notionDatabase = await findDatabase(databaseId);

    if (!notionDatabase) {
      return ctx.reply("Database not found");
    }

    const messageContent = ctx.message?.text.replaceAll("/add ", "") ?? "";
    const messageEntries = messageContent.split("\n");
    messageEntries.forEach(async (entry) => {
      const parsedMessage = parseMessageToNewEntry(entry);

      if (!parsedMessage) {
        return ctx.reply("Invalid message format. It should be: event. lead");
      }

      const databaseProperties = notionDatabase.properties;
      const newNotionDatabaseEntry = await createNotionDatabaseEntry(
        parsedMessage,
        databaseProperties
      );

      const response = await addPageToDatabase(
        databaseId,
        newNotionDatabaseEntry
      );

      if (response?.code) {
        return ctx.reply(
          `Error adding entry. \nError: ${response.code} ${response.message}`
        );
      }

      ctx.reply(`Entry added! $${JSON.stringify(response)}`);
    });

    ctx.reply(`${messageEntries.length} entries added!`);
  } catch (e) {
    ctx.reply(`Error adding entry. \nError: ${e.message}`);
  }
};
