import { Bot } from "grammy";
import { parseMessageToNewEntry } from "./utils.js";
import {
  findDatabase,
  createNotionDatabaseEntry,
  addPageToDatabase,
} from "../notion/utils.js";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.command("start", (ctx) =>
  ctx.reply(
    "Welcome! \nUse /add to add a new entry \nUse the following format: `/add event, focus date iso string, effort, lead name`"
  )
);

bot.command("add", async (ctx) => {
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

  try {
    await addPageToDatabase(databaseId, newNotionDatabaseEntry);
  } catch (error) {
    console.log(error);
  }

  ctx.reply("Entry added!");
});

bot.catch((err) => {
  console.log("Ooops", err);
  setTimeout(function () {
    process.on("exit", function () {
      require("child_process").spawn(process.argv.shift(), process.argv, {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit",
      });
    });
    process.exit();
  }, 5000);
});

bot.start();
