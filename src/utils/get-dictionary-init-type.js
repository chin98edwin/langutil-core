/**
 * @description Determines whether a dictionary is structured by language or not
 * @param {object} dictionary
 * @returns {'lang'|'key'}
 */
function getDictionaryInitType(dictionary) {
  const dictionaryKeys = Object.keys(dictionary);
  if (dictionaryKeys.length <= 0) {
    return 'lang';
  } else {
    // If Object.keys(dict)[0] does not contains any lowercase letters
    // This means it is not structured by keyword because keywords should be in MACRO_CASE

    // If Object.keys(dict)[0] HAS lowercase letters,
    // then it is probably a language code, otherwise it is a keyword
    // because keywords should be in MACRO_CASE and contain no lower case letters
    return /^[a-z_-]+$/g.test(Object.keys(dictionary)[0]) ? 'lang' : 'key';
  }
}

module.exports = getDictionaryInitType;
