/**
 * @description Extract all languages and keywords from a dictionary.
 * @param {object} dict The dictionary to extract from
 * @returns {{ a:Array<string>, b:Array<string> }} `a` contains all languages while `b` contains all keys in the dictionary if structured by language, otherwise it is the other way round.
 */
function extractAB(dict) {
  let a = Object.keys(dict), b = [];
  for (const childA of a) {
    const stackB = Object.keys(dict[childA]);
    for (const childB of stackB) { b.push(childB); }
  }
  b = Array.from(new Set(b)); // Remove duplicates
  return { a, b };
}

module.exports = extractAB;
