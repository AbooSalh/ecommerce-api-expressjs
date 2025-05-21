
/**
 * Generates a random 6-digit code for password reset
 * @param user - User document or user ID (not used in this implementation)
 * @param length - Length of the code to generate (default: 6)
 * @returns A string of the specified length containing only numbers
 */
export const generateCode = (
  length: number = 6
): string => {
  // Generate a random number between 0 and 999999
  const randomNum = Math.floor(Math.random() * 1000000);

  // Convert to string and pad with zeros if needed
  return randomNum.toString().padStart(length, "0");
};

export default generateCode;
