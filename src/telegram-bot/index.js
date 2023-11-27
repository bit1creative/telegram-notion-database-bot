import { Bot } from "grammy";
import { parseMessageToNewEntry } from "./utils.js";
import {
  findDatabase,
  createNotionDatabaseEntry,
  addPageToDatabase,
} from "../notion/utils.js";
import { spawn } from "child_process";
import { argv } from "process";
import { cwd } from "process";
import {
  helpHandler,
  startHandler,
  addNewEntryHelperText,
} from "./commands/index.js";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.command("start", startHandler);
bot.command("help", helpHandler);

bot.on("message", (ctx) => {
  if (ctx.message.text === "How to add an entry?") {
    // You can call your help command here
    ctx.reply(addNewEntryHelperText, { parse_mode: "MarkdownV2" });
  }
});

bot.command("add", async (ctx) => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const notionDatabase = await findDatabase(databaseId);

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
    const newNotionDatabaseEntry = await createNotionDatabaseEntry(
      parsedMessage,
      databaseProperties
    );

    await addPageToDatabase(databaseId, newNotionDatabaseEntry);

    ctx.reply("Entry added!");
  } catch (e) {
    ctx.reply(`Error adding entry. \nError: ${e.message}`);
  }
});

bot.catch((err) => {
  console.log("Ooops", err);
  setTimeout(function () {
    process.on("exit", function () {
      spawn(argv.shift(), argv, {
        cwd: cwd(),
        detached: true,
        stdio: "inherit",
      });
    });
    process.exit();
  }, 5000);
});

bot.start();
