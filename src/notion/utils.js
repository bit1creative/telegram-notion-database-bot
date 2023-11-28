import Fuse from "fuse.js";
// import { DateTime } from "luxon";
import { notionClient } from "./index.js";
import { USERS } from "../telegram-bot/constants.js";

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
  // const { event, date, effort, lead } = message;
  const { event, lead } = message;

  // const effortFuse = new Fuse(databaseProperties.Effort.select.options, {
  //   keys: ["name"],
  //   threshold: 0.8,
  // });

  // const parsedEffort = effortFuse.search(effort)[0].item.name;
  // const parsedDate = DateTime.fromFormat(date.trim(), "dd/MM/yyyy").toISO();
  // const parsedLead = await findUser(lead);
  const localUser = findLocalUser(lead);

  const pageOptions = {
    properties: {
      Name: {
        type: "title",
        title: [{ type: "text", text: { content: event } }],
      },
      "Person bot": {
        type: "text",
        text: [{ type: "text", text: { content: localUser } }],
      },
      Status: {
        type: "select",
        select: {
          name: "not-started",
        },
      },
      // "Focus Date": {
      //   type: "date",
      //   date: {
      //     start: parsedDate,
      //   },
      // },
      // Effort: {
      //   type: "select",
      //   select: {
      //     name: parsedEffort,
      //   },
      // },
      // Lead: {
      //   type: "people",
      //   people: [
      //     {
      //       object: "user",
      //       id: parsedLead.id,
      //     },
      //   ],
      // },
    },
  };

  return pageOptions;
};

export const findLocalUser = (userName) => {
  const userFuse = new Fuse(USERS, {
    keys: ["name"],
    threshold: 0.8,
  });

  const user = userFuse.search(userName)[0].item;
  return user;
};

export const findUser = async (userName) => {
  const userList = (await notionClient.users.list()).results.filter(
    ({ type }) => type !== "bot"
  );
  const userFuse = new Fuse(userList, {
    keys: ["name"],
    threshold: 0.8,
  });
  try {
    const user = userFuse.search(userName)[0].item;
    return user;
  } catch (e) {
    new Error(`User ${userName} not found`);
  }
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

export const findUserById = async (userId) => {
  const user = await notionClient.users.retrieve({ user_id: userId });

  return user;
};
