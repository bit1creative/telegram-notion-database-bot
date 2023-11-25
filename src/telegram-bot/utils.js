export const parseMessageToNewEntry = (message) => {
  const messageSplit = message.split(",");

  // we expect the message to be in the format of: event, date, effort, lead
  if (messageSplit.length !== 4) {
    return null;
  }

  const [event, date, effort, lead] = messageSplit;

  return {
    event,
    date,
    effort,
    lead,
  };
};
