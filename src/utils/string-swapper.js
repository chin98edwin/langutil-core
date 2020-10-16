const getHash = require('./get-hash');

/**
 * @description Substitutes all occurence of a key in the string with a random hash, which the hash can be later be swapped into another value.
 * @param {string} str
 * @param {RegExp} rgx
 * @returns {string} The substituted string and the swapper used.
 */
function substituteWithUniqueSwapper(str, rgx) {
  // %p is escaped with %%p, and {:key} with {::key}
  // A random hash that temporarily substitutes %%p and {::key} makes it possible
  // Random hash cannot be subset of the original string
  let hashLength = 2, swapper = '%q';
  while (str.includes(swapper)) {
    swapper = getHash(hashLength++);
  }
  str = str.replace(rgx, swapper);
  return { newStr: str, swapper };
}

/**
 * @description Level down unused escaped placeholders, %%p -> %p, {::key} -> {:key} and so on
 * NOTE: This is not needed if applyParams is called because it already uses a
 * swapping technique for escaped placeholders.
 * This is for when param is undefined.
 * @param {string} str
 * @returns {string}
 */
function MANGLE_cleanupUnusedPlaceholders(str) {
  if (typeof str === 'string') {
    let { newStr, swapper } = substituteWithUniqueSwapper(str, /(%%p)/g);
    newStr = newStr.replace(/(%p)/g, '');
    newStr = newStr.replace(new RegExp(`(${swapper})`, 'g'), '%p');
    newStr = newStr.replace(/({::)/g, '{:');
    return newStr;
  } else {
    return str;
  }
}

/**
 * @description Allows you to access object properties by dot notation.
 * @param {object} data The data that you wish to access it's value by dot notation.
 * @param {string} key The key of the item in dot notation.
 * @see https://stackoverflow.com/a/6491621
 */
function getItemByDotNotation(data, key) {
  let _key = key;
  _key = _key.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  _key = _key.replace(/^\./, '');           // strip a leading dot
  const paths = _key.split('.');
  for (let i = 0, n = paths.length; i < n; ++i) {
    const k = paths[i];
    if (k in data) {
      data = data[k];
    } else {
      return;
    }
  }
  return data;
}

/**
 * @description Replaces all {:placeholder} in `string` with `data.placeholder`.
 * @param {string} str The original string containing {:placeholders}.
 * Use double-colon such as {::placeholder} to escape from swapping.
 * @param {object} obj The supplementary data where its items will be swapped
 * into the string.
 */
function MANGLE_stringMapObject(str = '', obj = {}) {
  let newString = `${str}`;
  // 1. Get array of placeholders
  const rawPlaceholders = newString.match(/{:[a-z][a-z0-9.]*}/gi);
  // 2. Remove duplicates
  const placeholders = Array.from(new Set(rawPlaceholders));
  // 3. For each placeholder, replace them with _data
  for (const p of placeholders) {
    const rgx = new RegExp(p, 'g');
    // 4. remove the '{:' and '}'
    const _p = p.replace(/^{:/, '').replace(/}$/, '');
    // Data is accessed based on dot notation only when needed instead of
    // accessing it by flattening out the children
    const valueToSwap = getItemByDotNotation(obj, _p);
    if (valueToSwap) { newString = newString.replace(rgx, `${valueToSwap}`); }
  }
  newString = newString.replace(/{::/g, '{:'); // level-down
  return newString;
}

/**
 * @description Substitutes each element in an array into a given string.
 * @param {string} newStr String to modify
 * @param {Array} arr Array to use
 * @param {string} keyword Keyword of localization (for debug use)
 * @returns {string} The modified string.
 */
function MANGLE_stringMapArray(str, arr = []) {
  let { newStr, swapper } = substituteWithUniqueSwapper(str, /(%%p)/g);

  // Detect real placeholders and substitute them with parameters
  let placeholderCount = 0;
  // eslint-disable-next-line
  try { placeholderCount = newStr.match(/(%p)/g).length; } catch (e) { }

  // Avoid getting undefined values in case `placeholderCount !== arr.length`
  let maximumLoopCount = Math.min((placeholderCount + 1), arr.length);
  for (let i = 0; i < maximumLoopCount; i++) {
    newStr = newStr.replace(/(%p)/, arr[i]);
  }

  // Replace empty placeholders with empty string
  newStr = newStr.replace(/(%p)/g, '');

  // Restore escaped %p
  newStr = newStr.replace(new RegExp(`(${swapper})`, 'g'), '%p');

  return newStr;
}

module.exports = {
  MANGLE_cleanupUnusedPlaceholders,
  MANGLE_stringMapArray,
  MANGLE_stringMapObject,
};
