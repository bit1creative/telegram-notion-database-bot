import Fuse from "fuse.js";
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

export const createNotionDatabaseEntry = async (
  message,
  databaseProperties
) => {
  const { event, date, effort, lead } = message;

  const effortFuse = new Fuse(databaseProperties.Effort.select.options, {
    keys: ["name"],
    threshold: 0.8,
  });

  const parsedEffort = effortFuse.search(effort)[0].item.name;
  const parsedDate = new Date(date.trim()).toISOString();
  const parsedLead = await findUser(lead);

  const pageOptions = {
    properties: {
      Name: {
        type: "title",
        title: [{ type: "text", text: { content: event } }],
      },
      Status: {
        type: "select",
        select: {
          name: "not-started",
        },
      },
      'Focus Date': {
        type: "date",
        date: {
          start: parsedDate,
        },
      },
      Effort: {
        type: "select",
        select: {
          name: parsedEffort,
        },
      },
      Lead: {
        type: "people",
        people: [
          {
            object: "user",
            id: parsedLead.id,
          },
        ],
      },
    },
  };

  return pageOptions;
};

export const findUser = async (userName) => {
  const userList = await notionClient.users.list();
  const userFuse = new Fuse(userList.results, {
    keys: ["name"],
    threshold: 0.8,
  });

  const user = userFuse.search(userName)[0].item;

  return user;
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

export const getDatabases = async () => {
  // starting to search for databases
  const databases = await notionClient.search({
    filter: {
      property: "object",
      value: "database",
    },
  });

  return databases;
};
