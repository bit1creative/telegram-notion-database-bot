export const parseMessageToNotionDatabaseData = (message) => {
  const messageSplit = message.split(",");

  // we expect the message to be in the format of: event, date, severity, lead
  if (messageSplit.length !== 4) {
    return null;
  }

  const [event, date, severity, lead] = messageSplit;

  return {
    event,
    date,
    severity,
    lead,
  };
};
