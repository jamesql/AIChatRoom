export const bioMessages = [
    "Exploring the unknown, one step at a time.",
    "Adventure awaits, are you ready?",
    "Dream big, achieve bigger.",
    "Your journey starts here.",
    "Every profile tells a story.",
    "Keep moving forward, no matter what.",
    "Discover, create, inspire.",
    "Life is an open world, explore it.",
    "Level up your potential today.",
    "Stay curious, stay adventurous."
];

export function randomBio(): string {
    const randomIndex = Math.floor(Math.random() * bioMessages.length);
    return bioMessages[randomIndex];
};

export const waitingForOtherUsersToAnswer = [
    "Waiting... patience is a virtue, right?",
    "Good things come to those who wait.",
    "Just hanging out until someone chimes in.",
    "Tick-tock, tick-tock... still waiting.",
    "Silence is golden, but answers are better.",
    "Any moment now... or so we hope.",
    "The suspense is killing me!",
    "Waiting for a reply, like a cat at a mouse hole.",
    "Cue the elevator music.",
    "Still here, still waiting, still hopeful."
];

export function randomWaitingMessage(): string {
    const randomIndex = Math.floor(Math.random() * waitingForOtherUsersToAnswer.length);
    return waitingForOtherUsersToAnswer[randomIndex];
};