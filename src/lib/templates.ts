import { CardConfig } from "../types";
import { v4 as uuidv4 } from "uuid";

export const defaultTemplates: Record<string, Omit<CardConfig, 'id' | 'startTime' | 'endTime'>> = {
  birthday: {
    receiverName: "Alex",
    senderName: "Sam",
    visitLimit: 5,
    tooEarlyMessage: "It's not your birthday yet! No peeking! 🎂",
    tooLateMessage: "The birthday magic has faded away! ✨",
    noVisitsMessage: "This card has vanished forever! 👻",
    visitWarningMessage: "⚠️ Warning: Only {visits} visits left before this card vanishes forever!",
    requirePassword: false,
    pages: [
      {
        id: "page-1",
        title: "Happy Birthday {{receiverName}}!",
        description: "Are you ready for your surprise? Click below to begin the magical journey.",
        photoUrl: "https://images.unsplash.com/photo-1530103862676-de8892437fc4?q=80&w=600&auto=format&fit=crop",
        bgType: "cosmic",
        options: [
          { id: "opt-1", text: "Let's Go! ✨", targetPageId: "page-2" }
        ]
      },
      {
        id: "page-2",
        title: "A Special Year Ahead",
        description: "Wishing you a year filled with joy, success, and amazing adventures.",
        photoUrl: "https://images.unsplash.com/photo-1494697536454-6f39e2cc972d?q=80&w=600&auto=format&fit=crop",
        bgType: "sunset",
        options: [
          { id: "opt-2", text: "Open Present 🎁", targetPageId: "finish" }
        ]
      }
    ]
  },
  anniversary: {
    receiverName: "My Love",
    senderName: "Me",
    visitLimit: 3,
    tooEarlyMessage: "Our special day isn't here yet! ❤️",
    tooLateMessage: "Our anniversary has passed, but my love for you remains forever.",
    noVisitsMessage: "This message has faded into memory.",
    visitWarningMessage: "⚠️ Only {visits} views remaining.",
    requirePassword: true,
    password: "love",
    pages: [
      {
        id: "page-1",
        title: "Happy Anniversary!",
        description: "Another beautiful year together. I love you more than words can say.",
        photoUrl: "https://images.unsplash.com/photo-1518199266791-5375a83164ba?q=80&w=600&auto=format&fit=crop",
        bgType: "blossom",
        options: [
          { id: "opt-1", text: "Relive Our Memories", targetPageId: "page-2" }
        ]
      },
      {
        id: "page-2",
        title: "Forever & Always",
        description: "Here's to a lifetime of adventures together.",
        photoUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop",
        bgType: "aurora",
        options: [
          { id: "opt-2", text: "Celebrate 🥂", targetPageId: "finish" }
        ]
      }
    ]
  },
  congratulations: {
    receiverName: "Champion",
    senderName: "Proud Friend",
    visitLimit: 10,
    tooEarlyMessage: "The celebration hasn't started yet! 🎉",
    tooLateMessage: "The confetti has settled.",
    noVisitsMessage: "This card has vanished forever! 👻",
    visitWarningMessage: "⚠️ You can view this {visits} more times.",
    requirePassword: false,
    pages: [
      {
        id: "page-1",
        title: "Congratulations!",
        description: "You did it! All your hard work has paid off.",
        photoUrl: "https://images.unsplash.com/photo-1561489422-45e3d0859424?q=80&w=600&auto=format&fit=crop",
        bgType: "neon",
        options: [
          { id: "opt-1", text: "See Your Reward", targetPageId: "page-2" }
        ]
      },
      {
        id: "page-2",
        title: "The World is Yours",
        description: "Keep reaching for the stars. We are so proud of you.",
        photoUrl: "https://images.unsplash.com/photo-1523580494112-071d16940d14?q=80&w=600&auto=format&fit=crop",
        bgType: "cosmic",
        options: [
          { id: "opt-2", text: "Cheers! 🎊", targetPageId: "finish" }
        ]
      }
    ]
  }
};
