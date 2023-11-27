import { Bot } from "grammy";

import { spawn } from "child_process";
import { argv } from "process";
import { cwd } from "process";
import {
  helpHandler,
  startHandler,
  addNewEntryHelperText,
  addHandler,
} from "./commands/index.js";
import { getDatabases } from "../notion/utils.js";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.command("start", startHandler);
bot.command("help", helpHandler);
bot.command("add", addHandler);
bot.command("secretDatabaseLookup", async (ctx) => {
  const databases = await getDatabases();

  ctx.reply(JSON.stringify(databases));
});

bot.on("message", (ctx) => {
  console.log(`Handling message: ${ctx.message.text}`);
  if (ctx.message.text === "How to add an entry?") {
    // You can call your help command here
    ctx.reply(addNewEntryHelperText, { parse_mode: "MarkdownV2" });
  }
});

bot.command("getDatabases", async (ctx) => {
  const databases = await getDatabases();

  ctx.reply(`DATABASES: ${databases}`);
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
