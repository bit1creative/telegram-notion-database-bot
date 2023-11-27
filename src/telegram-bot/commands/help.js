export const helpHandler = (ctx) =>
  ctx.reply(
    "Here is the list of the supported commands:\n`/start\n/help\n/add - add a new entry to the database`",
    {
      parse_mode: "MarkdownV2",
    }
  );

export const addNewEntryHelperText = `You can use the following command to add a new entry to the database:
                                    \n\`/add [event], [date], [severity], [lead]\`
                                    \n Where:
                                    \n*\`event\`* is the name of the event,
                                    \n*\`date\`* is the date of the event, formatted like this: DD/MM/YYYY,
                                    \n*\`severity\`* is the severity of the event and should be one of S, M, L,
                                    \n*\`lead\`* is the lead of the event, type the name of the lead as he named in the Notion workspace
                                    \n Example: \`/add New Drop, 15/09/2024, M, Severyn\`
                                    `;
