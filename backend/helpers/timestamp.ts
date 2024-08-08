// generates a aleatory timestamp in accordance with the current date
export default function generateTimestamp() {
  // Get the current date and time
  const currentDate = new Date();

  // Calculate the start of the current week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  // Calculate the end of the current week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  let randomTimestamp;

  do {
    // Generate a random timestamp within the current week
    randomTimestamp = new Date(
      startOfWeek.getTime() +
        Math.random() * (endOfWeek.getTime() - startOfWeek.getTime())
    );
  } while (randomTimestamp > currentDate); // Ensure the timestamp is not in the future

  return randomTimestamp.getTime() / 1000;
}
