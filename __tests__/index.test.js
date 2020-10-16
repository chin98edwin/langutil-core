const i = require('import-fresh');
const { BasicTest, DictionaryVariationTest } = require('./test-suite');
const KeywordDictionary = require('./dictionaries/keyword-dictionary');
const LanguageDictionary = require('./dictionaries/language-dictionary');

// Disable warning for missing localization because it will also include the
// stack and code that emitted it, which will clutter the logs since the code
// are minified into one long line.
const baseWarn = console.warn;
console.warn = function (str = '') {
  if (!str.match(/Missing localizations/gi)) {
    baseWarn(...arguments);
  }
};

// Debugging test
// LANGUTIL_VERSION = 'LANGUTIL_VERSION';
// const LANGUTIL_DEBUG = require('../src');
// new BasicTest('DEBUG', LANGUTIL_DEBUG).run();
// new DictionaryVariationTest('DEBUG', new LANGUTIL_DEBUG.LangutilCore(), KeywordDictionary).run();
// new DictionaryVariationTest('DEBUG', new LANGUTIL_DEBUG.LangutilCore(), LanguageDictionary).run();

// Standard test: Development
// const LANGUTIL_DEV = require('../dist/langutil-core.dev.min');
new BasicTest('  DEV', i('../dist/langutil-core.dev.min')).run();
new DictionaryVariationTest('  DEV', i('../dist/langutil-core.dev.min'), KeywordDictionary).run();
new DictionaryVariationTest('  DEV', i('../dist/langutil-core.dev.min'), LanguageDictionary).run();

// Standard test: Production
// const LANGUTIL_PROD = require('../dist/langutil-core.prod.min');
new BasicTest(' PROD', i('../dist/langutil-core.prod.min')).run();
new DictionaryVariationTest(' PROD', i('../dist/langutil-core.prod.min'), KeywordDictionary).run();
new DictionaryVariationTest(' PROD', i('../dist/langutil-core.prod.min'), LanguageDictionary).run();
