const BASE = require('./langutil-bases');
const LangutilCore = require('./langutil-core');
const getDictionaryInitType = require('./utils/get-dictionary-init-type');

if (process.env.NODE_ENV !== 'production') {
  const MissingLocalizationWarningDebouncer = require('./utils/missing-localization-warning-debouncer');
  var warningDebouncer = new MissingLocalizationWarningDebouncer();
}

function localizeFromScratch(dictionary, specA, specB, specC) {
  const byObj = typeof specA === 'object';
  return BASE.MANGLE_localizeFromScratch({
    initByLang: getDictionaryInitType(dictionary) === 'lang',
    dictionary: dictionary,
    language: byObj ? specA.language : specA,
    keyword: byObj ? specA.keyword : specB,
    param: byObj ? specA.param : specC,
    MANGLE_triggerWarning: warningDebouncer ? warningDebouncer.MANGLE_pushWarning : undefined,
  });
}

const BUNDLE = {
  AutoDetect: BASE.MANGLE_AutoDetect,
  getResolvedClosestLanguage: BASE.MANGLE_getResolvedClosestLanguage,
  localizeFromScratch,
  LangutilCore,
  VERSION: LANGUTIL_VERSION, // eslint-disable-line
};

const DEFAULT_CORE = new LangutilCore();
const copy = [
  'init',
  'setDictionary',
  'appendDictionary',
  'setLanguage',
  'getLanguage',
  'getGuidedLanguage',
  'getAllLanguages',
  'getAutoDetectStatus',
  'localize',
  'localizeExplicitly',
  'addEventListener',
  'removeEventListener',
  '__getDictionary',
];
for (const c of copy) { BUNDLE[c] = DEFAULT_CORE[c]; }

module.exports = BUNDLE;
