// 🔥 Shared config + generator for virtual interview app instructions
// Used by ForInterview.jsx and RescheduleInterview.jsx whenever
// Interview Mode is set to "Virtual (Video Call)".

export const MEETING_APP_OPTIONS = [
    { value: "Zoom", name: "Zoom" },
    { value: "Google Meet", name: "Google Meet" },
    { value: "Microsoft Teams", name: "Microsoft Teams" }
];

const APP_INSTRUCTIONS = {
    Zoom: {
        join: [
            "Click the meeting link provided at your scheduled interview time.",
            "If prompted, click \"Open Zoom Meetings\" to launch the app, or choose \"Join from your browser\" if you don't want to install anything.",
            "Alternatively, open the Zoom app, select \"Join a Meeting,\" and enter the Meeting ID and passcode included with your invite."
        ],
        download: [
            "Download Zoom for free at https://zoom.us/download (desktop) or from the App Store / Google Play (mobile).",
            "Installation isn't required — you can join directly from your web browser."
        ],
        usage: [
            "Once admitted from the waiting room, click \"Join with Video\" and \"Join with Computer Audio.\"",
            "Use the microphone and camera icons in the bottom-left corner to mute/unmute or turn your video on/off.",
            "Use the \"Chat\" icon to send messages, and \"Leave\" (bottom-right) to exit the meeting when finished."
        ]
    },
    "Google Meet": {
        join: [
            "Click the meeting link provided at your scheduled interview time.",
            "Sign in with a Google account, or click \"Ask to join\" to continue as a guest.",
            "Click \"Join now\" once you're ready to enter the meeting."
        ],
        download: [
            "No installation is needed on desktop — Google Meet runs directly in Chrome, Edge, or Safari.",
            "On mobile, download the Google Meet app from the App Store or Google Play for the best experience."
        ],
        usage: [
            "Use the microphone and camera icons at the bottom of the screen to mute/unmute or turn your video on/off.",
            "Click the three-dot \"More options\" menu for settings such as captions or layout.",
            "Click the red phone icon to leave the meeting when finished."
        ]
    },
    "Microsoft Teams": {
        join: [
            "Click the meeting link provided at your scheduled interview time.",
            "Choose \"Continue on this browser\" to join without installing anything, or \"Open Microsoft Teams app\" if you already have it installed.",
            "Enter your name (if prompted) and click \"Join now.\""
        ],
        download: [
            "Download Microsoft Teams for free at https://www.microsoft.com/microsoft-teams/download-app.",
            "Installation isn't required — you can join directly from your web browser."
        ],
        usage: [
            "Use the microphone and camera icons at the top of the call window to mute/unmute or turn your video on/off.",
            "Use the chat icon to send messages during the call.",
            "Click the red \"Leave\" button to exit the meeting when finished."
        ]
    }
};

/**
 * Generates step-by-step joining instructions for the selected virtual
 * meeting application, formatted as a plain-text block ready to be
 * appended to the interview Notes.
 *
 * @param {string} app - One of the MEETING_APP_OPTIONS values (Zoom, Google Meet, Microsoft Teams)
 * @param {string} meetingLink - The meeting link/location entered for the interview
 * @returns {string} Formatted instructions, or an empty string if app is not recognized
 */
export function generateMeetingAppInstructions(app, meetingLink) {
    const config = APP_INSTRUCTIONS[app];
    if (!config) return "";

    const linkLine = meetingLink
        ? `Meeting Link: ${meetingLink}`
        : "";

    const numbered = (items) =>
        items.map((item, i) => `${i + 1}. ${item}`).join("\n");

    return [
        `Joining Instructions (${app}):`,
        linkLine,
        "",
        "How to Join:",
        numbered(config.join),
        "",
        `Getting ${app} (if not already installed):`,
        numbered(config.download),
        "",
        `Basic Tips for Using ${app}:`,
        numbered(config.usage)
    ]
        .filter((line) => line !== "")
        .join("\n");
}