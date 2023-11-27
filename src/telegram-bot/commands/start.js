export const startHandler = (ctx) =>
  ctx.reply(
    "Hey, I am a bot that helps you to add entries to your Notion Database\\.",
    {
      parse_mode: "MarkdownV2",
      reply_markup: {
        keyboard: [
          [
            {
              text: "How to add an entry?",
              callback_data: "help",
            },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
