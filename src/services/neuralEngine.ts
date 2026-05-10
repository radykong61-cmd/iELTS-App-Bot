export function getGeminiKeys(): string[] {
  const keys: string[] = [];
  
  // Primary key provided by the platform
  if (process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }
  
  // Additional keys provided by the user
  for (let i = 1; i <= 10; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (key && !keys.includes(key)) {
      keys.push(key);
    }
  }
  
  return keys;
}

/**
 * A helper to get a random key from the available pool to avoid rate limits
 */
export function getRandomGeminiKey(): string {
  const keys = getGeminiKeys();
  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in environment variables.");
  }
  return keys[Math.floor(Math.random() * keys.length)];
}
