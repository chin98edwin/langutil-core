const {
  MANGLE_stringMapArray,
  MANGLE_stringMapObject,
  MANGLE_cleanupUnusedPlaceholders,
} = require('./utils/string-swapper');
// const plugins = require('./utils/plugins');
const extractAB = require('./utils/extract-ab');

function MANGLE_AutoDetect() {
  try {
    return (navigator.language || navigator.userLanguage).toLowerCase();
  } catch (e) {
    return null;
  }
}

/**
 * @param {string} unconfirmedLanguage
 * @param {Array<string>} availableLanguages
 * @returns {string|null}
 */
function MANGLE_getResolvedClosestLanguage(unconfirmedLanguage, availableLanguages) {
  for (let availableLanguage of availableLanguages) {
    const _a = availableLanguage.toLowerCase(), _l = unconfirmedLanguage.toLowerCase();
    if (_l.includes(_a) || _a.includes(_l)) { return availableLanguage; }
    // If still no match, check substring of both sides
    const splitter = /_|-/g;
    const _aSub = _a.split(splitter), _lSub = _l.split(splitter);
    for (let u of _aSub) {
      for (let s of _lSub) {
        if (s.length > 0 && u.length > 0) {
          if (s.includes(u) || u.includes(s)) { return availableLanguage; }
        }
      }
    }
  }
  return null;
}

/**
 * @description Gets a language that is already in the dictionary from auto-detection
 * @param {Function} detector This assumes detector is provied
 * @param {Array<string>} availableLanguages
 * @param {string} fallbackLanguage
 * @returns {{ language: string, successful: boolean, extraInfo?: Array<string> }}
 */
function MANGLE_getGuidedLanguage(detector, availableLanguages, fallbackLanguage) {
  if (typeof detector === 'function') {
    let guidedLanguage = null;
    let guideSuccessful = false;
    if (process.env.NODE_ENV !== 'production') {
      var extraInfo = [];
    }

    // (1) Attempt to detect language
    const detectedLanguage = detector();
    if (detectedLanguage) {
      // Check if detected language is among available languages
      if (availableLanguages.includes(detectedLanguage)) {
        guidedLanguage = detectedLanguage;
        guideSuccessful = true;
        if (process.env.NODE_ENV !== 'production') {
          extraInfo.push(`Auto detected language: ${detectedLanguage}`);
        }
      } else {
        // No exact match, then attempt to find similar language instead
        const similarLanguage = MANGLE_getResolvedClosestLanguage(detectedLanguage, availableLanguages);
        if (typeof similarLanguage === 'string') {
          guidedLanguage = similarLanguage;
          guideSuccessful = true;
          if (process.env.NODE_ENV !== 'production') {
            extraInfo.push(`Closest possible language '${similarLanguage}' is used since no localizations are found for auto-detected language '${detectedLanguage}'`);
          }
        }
      }
    }

    // (2) If nothing is successful, we use the fallback language
    if (!guideSuccessful) {
      if (fallbackLanguage) {
        // If fallback language is available, we use it
        if (availableLanguages.includes(fallbackLanguage)) {
          guidedLanguage = fallbackLanguage;
          if (process.env.NODE_ENV !== 'production') {
            extraInfo.push(`Using fallback language '${fallbackLanguage}' since no localizations are found for auto-detected language '${detectedLanguage}' or its closest possible language`);
          }
        } else {
          if (process.env.NODE_ENV === 'production') {
            throw new TypeError(`5,${fallbackLanguage}`);
          } else {
            throw new TypeError(`Fallback language (${fallbackLanguage}) is not found among availableLanguages [${availableLanguages.join(', ')}]`);
          }
        }
      } else {
        // Otherwise, we pick the first available language from the list
        guidedLanguage = availableLanguages[0];
      }
    }

    // (3) Finally return the language and success status
    if (process.env.NODE_ENV !== 'production') {
      return { language: guidedLanguage, successful: guideSuccessful, extraInfo };
    } else {
      return { language: guidedLanguage, successful: guideSuccessful };
    }

  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new TypeError(`1,${typeof detector}`);
    } else {
      throw new TypeError(`Expected detector to be a function but got ${typeof detector}`);
    }
  }
}

/**
 * @description Makes sure that event details are formatted properly
 * @param {'onSetLanguage'|'onSetDictionary'|'onAppendDictionary'|'onAny'} type
 * @param {object} detail
 * @returns {object}
 */
function MANGLE_prepareEventDetail(type, detail) {
  if (type === 'onSetLanguage') {
    const { newState, oldState } = detail;
    return { newState, oldState };
  } else if (type === 'onSetDictionary' || type === 'onAppendDictionary') {
    const { dictionary } = detail;
    return { dictionary };
  } else if (type === 'onAny') {
    return detail;
  } else {
    return {};
  }
}

/**
 * @description The master algorithm for localization lies here
 * @param {object} props
 * @returns {any}
 */
function MANGLE_localizeFromScratch({
  initByLang, dictionary, language, keyword, param, MANGLE_triggerWarning
}) {
  let localizedValue, localizedSuccess;

  // Force language and keywords into strings as they are keys after all
  keyword = `${keyword}`;
  language = `${language}`;

  try {
    // Because `localize` is going to be used frequently, it's better to cache
    // initByLang in the core; in the case where this function itself is going
    // to be used frequently, it should be used for direct swapping with
    // small-sized dictionaries, and so we export it in a wrapper that uses
    // extractAB to determine it's composition and pass the initBy type into here
    if (initByLang) {
      localizedValue = dictionary[language][keyword];
    } else {
      localizedValue = dictionary[keyword][language];
    }
    if (localizedValue) { localizedSuccess = true; }
  } catch (e) { } // eslint-disable-line

  // Apply params
  if (typeof localizedValue === 'string') {
    if (param) {
      if (Array.isArray(param)) {
        localizedValue = MANGLE_stringMapArray(localizedValue, param);
      } else if (typeof param === 'object') {
        localizedValue = MANGLE_stringMapObject(localizedValue, param);
      } else {
        if (process.env.NODE_ENV === 'production') {
          throw new TypeError(`7,${typeof param},${keyword}`);
        } else {
          throw new TypeError(`Expected param to be an array or object but got ${typeof param}\nAt: ${keyword}`);
        }
      }
    } else {
      localizedValue = MANGLE_cleanupUnusedPlaceholders(localizedValue, param);
    }
  }
  // else if is function or class
  // Need to consider which one takes precedence because react components are classes and functions too
  // Entry point for react additions
  // if (plugins.MANGLE_collection.react) {
  //   plugins.MANGLE_collection.react(localizedValue);
  // }

  if (!localizedSuccess) {
    localizedValue = keyword.toUpperCase();
    if (process.env.NODE_ENV !== 'production') {
      if (typeof MANGLE_triggerWarning === 'function') {
        MANGLE_triggerWarning(language, keyword);
      }
    }
  }

  return localizedValue;
}

/**
 * @description Flips a dictionary from being init by language to keyword and vice versa.
 * @param {object} dictionary
 * @returns {object}
 */
function MANGLE_getFlippedDictionary(dictionary) {
  let flipped = {};
  const { a, b } = extractAB(dictionary);
  for (const childB of b) {
    if (!flipped[childB]) { flipped[childB] = {}; }
    for (const childA of a) {
      flipped[childB][childA] = dictionary[childA][childB];
    }
  }
  return flipped;
}

/**
 * @description Merges two dictionaries together.
 * WARNING: Dictionaries must be of same initBy type.
 * @param {object} d1 The first dictionary
 * @param {object} d2 The second dictionary
 * @returns {object} The merged dictionary
 */
function MANGLE_getMergedDict(d1, d2) {
  let merged = {};
  const { a: a1 } = extractAB(d1);
  const { a: a2 } = extractAB(d2);
  for (const _a1 of a1) {
    for (const _a2 of a2) {
      merged[_a1] = Object.assign({}, d1[_a1], d2[_a1]);
      merged[_a2] = Object.assign({}, d1[_a2], d2[_a2]);
    }
  }
  return merged;
}

module.exports = {
  MANGLE_AutoDetect,
  MANGLE_prepareEventDetail,
  MANGLE_getResolvedClosestLanguage,
  MANGLE_getGuidedLanguage,
  MANGLE_localizeFromScratch,
  MANGLE_getMergedDict,
  MANGLE_getFlippedDictionary,
};
