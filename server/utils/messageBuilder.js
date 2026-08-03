export const buildScheduleSummary = ({
  eventTitle,
  eventAt,
  location,
  eventMode,
  meetingApp
}) => {
  if (!eventTitle || !eventAt || !location || !eventMode) {
    return "";
  }

  const date = new Date(eventAt);
  if (isNaN(date)) return "";

  const formattedSchedule = date.toLocaleString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

  const modePhrase =
    eventMode === "Virtual (Video Call)"
      ? `online via ${meetingApp || "video call"} using the following link: ${location}`
      : `in-person at ${location}`;

  return `${eventTitle} is scheduled on ${formattedSchedule}, ${modePhrase}.`;
};