const LAB08_SNAPNEWS_TOKEN = 'LAB08_SNAPNEWS_TOKEN_SECRET';

/**
 * Checks if the given token matches a predefined constant.
 * An Error is thrown if they do not match.
 *
 * @param {string} token
 */
export const checkAuthToken = (token: string) => {
  if (token !== LAB08_SNAPNEWS_TOKEN) {
    throw new Error('Invalid announcement token provided');
  }
};
