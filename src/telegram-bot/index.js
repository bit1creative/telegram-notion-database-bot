import { Bot } from "grammy";
import { parseMessageToNewEntry } from "./utils.js";
import { findDatabase, createNotionDatabaseEntry } from "../notion/utils.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.command("add", async (ctx) => {
  const notionDatabase = await findDatabase(process.env.NOTION_DATABASE_ID);

  if (!notionDatabase) {
    return ctx.reply("Database not found");
  }

  const messageContent = ctx.message?.text.replace("/add ", "") ?? "";
  const parsedMessage = parseMessageToNewEntry(messageContent);

  if (!parsedMessage) {
    return ctx.reply(
      "Invalid message format. It should be: event, date, severity, lead"
    );
  }

  const databaseProperties = notionDatabase.properties;
  const newNotionDatabaseEntry = createNotionDatabaseEntry(
    parsedMessage,
    databaseProperties
  );
});

bot.start();
