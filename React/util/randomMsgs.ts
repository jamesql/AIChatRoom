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
}