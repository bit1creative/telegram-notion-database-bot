import { notionClient } from "./index.js";

export const findDatabase = async (databaseId) => {
  const databases = await notionClient.search({
    filter: {
      property: "object",
      value: "database",
    },
  });

  return databases.results.find(({ id }) => id === databaseId);
};

export const createNotionDatabaseEntry = (message, databaseProperties) => {
  const { event, date, severity, lead } = message;

  const pageOptions = {
    properties: {
      Name: {
        type: "title",
        title: [{ type: "text", text: { content: event } }],
      },
      Status: {
        date: {
          start: date,
        },
      },
      Severity: {
        select: {
          name: severity,
        },
      },
      Lead: {
        rich_text: [
          {
            text: {
              content: lead,
            },
          },
        ],
      },
    },
  };

  return pageOptions;
};

export const addPageToDatabase = async (databaseId, pageOptions) => {
  const response = await notionClient.pages.create({
    parent: {
      database_id: databaseId,
    },
    ...pageOptions,
  });

  return response;
};
