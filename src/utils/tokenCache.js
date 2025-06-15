const tokenCache = new Map();

export const getCachedToken = async (idToken, verifyFn) => {
  if (tokenCache.has(idToken)) {
    return tokenCache.get(idToken);
  }

  const decoded = await verifyFn(idToken);
  tokenCache.set(idToken, decoded);

  setTimeout(() => tokenCache.delete(idToken), 5 * 60 * 1000);

  return decoded;
};
