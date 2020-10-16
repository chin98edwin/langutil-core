/**
 * @param {number} length
 * @returns {string}
 */
function getHash(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  while (hash.length < length) { hash += charset[Math.floor(Math.random() * charset.length)]; }
  return hash;
}

module.exports = getHash;
