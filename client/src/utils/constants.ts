export const CATEGORIES = Object.freeze([
  "animal",
  "anime",
  "art",
  "book",
  "business",
  "celebrity",
  "education",
  "entertainment",
  "food",
  "fun",
  "gaming",
  "geography",
  "health",
  "history",
  "holiday",
  "kids",
  "language",
  "literature",
  "love",
  "math",
  "misc",
  "movies",
  "music",
  "personality",
  "politics",
  "religion",
  "science",
  "sports",
  "tech",
  "television",
] as const);

export const SERVER_ADDRESS =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_SERVER_ADDR
    : process.env.REACT_APP_SERVER_ADDR_DEV;
