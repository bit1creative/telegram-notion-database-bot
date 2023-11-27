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
import { getDatabases, findUserById } from "../notion/utils.js";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

bot.command("start", startHandler);
bot.command("help", helpHandler);
bot.command("add", addHandler);
bot.command("secretDatabaseLookup", async (ctx) => {
  const databases = await getDatabases();

  ctx.reply(JSON.stringify(databases));
});
bot.command("secretUserLookup", async (ctx) => {
  const userId = ctx.message?.text.replace("/secretUserLookup ", "") ?? "";

  const user = await findUserById(userId);

  ctx.reply(JSON.stringify(user));
});

bot.on("message", (ctx) => {
  console.log(`Handling message: ${ctx.message.text}`);
  if (ctx.message.text === "How to add an entry?") {
    // You can call your help command here
    ctx.reply(addNewEntryHelperText, { parse_mode: "MarkdownV2" });
  }
});

bot.catch(async (err) => {
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
