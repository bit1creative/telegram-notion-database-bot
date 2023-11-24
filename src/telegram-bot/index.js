import { Bot } from "grammy";
import { parseMessageToNotionDatabaseData } from "./utils.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.command("add", (ctx) => {
  const messageContent = ctx.message?.text.replace("/add ", "") ?? "";
  const notionDatabaseData = parseMessageToNotionDatabaseData(messageContent);

  if (!notionDatabaseData) {
    ("Invalid message format. It should be: event, date, severity, lead");
  }
});

bot.start();
