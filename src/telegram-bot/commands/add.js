import { parseMessageToNewEntry } from "../utils.js";
import {
  findDatabase,
  createNotionDatabaseEntry,
  addPageToDatabase,
} from "../../notion/utils.js";

export const addHandler = async (ctx) => {
  try {
    ctx.reply("Trying to add a new entry");
    const databaseId = process.env.NOTION_DATABASE_ID;
    const notionDatabase = await findDatabase(databaseId);

    if (!notionDatabase) {
      return ctx.reply("Database not found");
    }

    const messageContent = ctx.message?.text.replace("/add ", "") ?? "";
    const parsedMessage = parseMessageToNewEntry(messageContent);

    if (!parsedMessage) {
      return ctx.reply(
        "Invalid message format. It should be: event. lead"
      );
    }

    const databaseProperties = notionDatabase.properties;
    const newNotionDatabaseEntry = await createNotionDatabaseEntry(
      parsedMessage,
      databaseProperties
    );

    await addPageToDatabase(databaseId, newNotionDatabaseEntry);

    ctx.reply("Entry added!");
  } catch (e) {
    ctx.reply(`Error adding entry. \nError: ${e.message}`);
  }
};
