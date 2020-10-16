function getRandomNumber() {
  // Note: 0 is a falsey value and we don't want that
  return Math.round(1 + Math.random() * 9);
}

class BasicTest {

  constructor(label, langutilInstance) {
    this.label = `${label}: `;
    this.langutil = langutilInstance;
  }

  run() {

    it(`${this.label}localizeFromScratch`, () => {
      const dictionary = { 'NEW_WORD': { en: 'New word' } };
      const language = 'en';
      const keyword = 'NEW_WORD';
      const output1 = this.langutil.localizeFromScratch(dictionary, language, keyword);
      expect(output1).toBe('New word');
      const output2 = this.langutil.localizeFromScratch(dictionary, { language, keyword });
      expect(output2).toBe('New word');
    });

    it(`${this.label}getResolvedClosestLanguage`, () => {
      const output1 = this.langutil.getResolvedClosestLanguage('en', ['en-us', 'es']);
      expect(output1).toBe('en-us');
      const output2 = this.langutil.getResolvedClosestLanguage('zh-Hans', ['zh', 'ja']);
      expect(output2).toBe('zh');
    });

  }

}

class DictionaryVariationTest {

  constructor(label, langutilBuild, dictionary) {
    this.label = `${label}: `;
    this.dictionary = dictionary;
    this.langutil = langutilBuild;
    this.langutil.init(this.dictionary, 'en');
  }

  run() {

    it(`${this.label}getLanguage`, () => {
      const language = this.langutil.getLanguage();
      expect(language).toBe('en');
    });

    it(`${this.label}setLanguage + getLanguage`, () => {
      this.langutil.setLanguage('zh');
      const output1 = this.langutil.getLanguage();
      expect(output1).toBe('zh');
      // Restore language to en
      this.langutil.setLanguage('en');
      const output2 = this.langutil.getLanguage();
      expect(output2).toBe('en');
    });

    it(`${this.label}setLanguage (Auto-detect) + getLanguage`, () => {
      const MockAutoDetect = () => 'en-gb';
      this.langutil.setLanguage('zh', MockAutoDetect);
      const output1 = `${this.langutil.getLanguage()}-${this.langutil.getAutoDetectStatus()}`;
      expect(output1).toBe('en-true');
      // Restore language to en
      this.langutil.setLanguage('en');
      const output2 = `${this.langutil.getLanguage()}-${this.langutil.getAutoDetectStatus()}`;
      expect(output2).toBe('en-false');
    });

    it(`${this.label}setLanguage (Not in dictionary)`, () => {
      expect(() => {
        this.langutil.setLanguage('xyz');
      }).toThrow(ReferenceError);
    });

    it(`${this.label}getGuidedLanguage`, () => {
      const MockAutoDetect = () => 'en-gb';
      const output = this.langutil.getGuidedLanguage(MockAutoDetect);
      expect(output).toBe('en');
    });

    it(`${this.label}getAllLanguages`, () => {
      const output = this.langutil.getAllLanguages();
      expect(output).toStrictEqual(['en', 'zh']);
    });

    it(`${this.label}getAutoDetectStatus`, () => {
      const output = this.langutil.getAutoDetectStatus();
      expect(output).toBe(false);
    });

    it(`${this.label}setDictionary`, () => {
      const tempDictionary = { en: { FOO: 'bar' } };
      this.langutil.setDictionary(tempDictionary);
      expect(this.langutil.__getDictionary()).toStrictEqual(tempDictionary);
      this.langutil.setDictionary(this.dictionary);
      expect(this.langutil.__getDictionary()).toStrictEqual(this.dictionary);
    });

    it(`${this.label}appendDictionary (keywords)`, () => {
      const AdditionalKeywordDictionary = { FOO: { en: 'foo', zh: '胡' } };
      this.langutil.appendDictionary(AdditionalKeywordDictionary, 'a1');
      const output1 = this.langutil.localize('FOO');
      expect(output1).toBe('foo');
      // Make sure that existing localizations are still intact
      const output2 = this.langutil.localize('HELLO_WORLD');
      expect(output2).toBe('Hello World');
    });

    it(`${this.label}appendDictionary (language)`, () => {
      const AdditionalLanguageDictionary = { en: { BAR: 'bar' }, zh: { BAR: '巴' } };
      this.langutil.appendDictionary(AdditionalLanguageDictionary, 'a2');
      const output1 = this.langutil.localize('BAR');
      expect(output1).toBe('bar');
      // Make sure that existing localizations are still intact
      const output2 = this.langutil.localize('HELLO_WORLD');
      expect(output2).toBe('Hello World');
    });

    it(`${this.label}appendDictionaryDelayed`, () => {
      const AdditionalDictionary = { en: { BAM: 'bam' }, zh: { BAR: '棒' } };
      this.langutil.appendDictionaryDelayed(AdditionalDictionary, 'a3');
      // Dictionary should NOT be appended yet
      const pre_output = this.langutil.localize('BAM');
      expect(pre_output).toBe('BAM');
      return new Promise((resolve) => {
        setTimeout(() => {
          // Dictionary SHOULD be appended now
          const output1 = this.langutil.localize('BAM');
          expect(output1).toBe('bam');
          // Make sure that existing localizations are still intact
          const output2 = this.langutil.localize('HELLO_WORLD');
          expect(output2).toBe('Hello World');
          resolve();
        });
      })
    });

    it(`${this.label}appendDictionary (empty)`, () => {
      this.langutil.appendDictionary({}, 'a2');
      // Make sure that existing localizations are still intact
      const output = this.langutil.localize('HELLO_WORLD');
      expect(output).toBe('Hello World');
    });

    it(`${this.label}localize (Valid keyword)`, () => {
      const output1 = this.langutil.localize('HELLO_WORLD');
      expect(output1).toBe('Hello World');
      const output2 = this.langutil.localize({ keyword: 'HELLO_WORLD' });
      expect(output2).toBe('Hello World');
    });

    it(`${this.label}localize (Invalid keyword - invalid type)`, () => {
      const num = getRandomNumber();
      const output = this.langutil.localize(num);
      expect(output).toBe(`${num}`);
    });

    it(`${this.label}localize (Invalid keyword - missing localization)`, () => {
      const output = this.langutil.localize('missing_word');
      expect(output).toBe('MISSING_WORD');
    });

    it(`${this.label}localize (Valid keyword, with array as param)`, () => {
      const output1 = this.langutil.localize('GREET_NAME_PARAM_ARRAY', ['John']);
      expect(output1).toBe('Hello, John. Escape %p.');
      const output2 = this.langutil.localize({
        keyword: 'GREET_NAME_PARAM_ARRAY',
        param: ['John'],
      });
      expect(output2).toBe('Hello, John. Escape %p.');
    });

    it(`${this.label}localize (Valid keyword, with object as param)`, () => {
      const data = { name1: 'John', name2: { value: 'Jane' } };
      const output1 = this.langutil.localize('GREET_NAME_PARAM_OBJECT', data);
      expect(output1).toBe('Hello, Jane & John. Escape {:name3}.');
      const output2 = this.langutil.localize({
        keyword: 'GREET_NAME_PARAM_OBJECT',
        param: data,
      });
      expect(output2).toBe('Hello, Jane & John. Escape {:name3}.');
    });

    it(`${this.label}localize (Valid keyword, invalid param type)`, () => {
      let thrownErrorType = '(No error)';
      try {
        this.langutil.localize('GREET_NAME_PARAM_ARRAY', getRandomNumber);
      } catch (e) {
        thrownErrorType = e.name;
      }
      expect(thrownErrorType).toBe('TypeError');
    });

    it(`${this.label}localizeExplicitly (in another language)`, () => {
      const output1 = this.langutil.localizeExplicitly('zh', 'HELLO_WORLD');
      expect(output1).toBe('哈咯世界');
      const output2 = this.langutil.localizeExplicitly({
        language: 'zh',
        keyword: 'HELLO_WORLD',
      });
      expect(output2).toBe('哈咯世界');
    });

    it(`${this.label}Event Listener (Basic checking)`, () => {

      let counter = 0;
      const id = this.langutil.addEventListener('onSetLanguage', () => {
        counter += 1;
      });

      // Make sure ID is returned
      expect(typeof id).toBe('string');

      // Error will be thrown if listenerId is invalid
      let hasError = false;
      try {
        this.langutil.removeEventListener(id);
      } catch (e) {
        hasError = true;
        console.error(e);
      }
      expect(hasError).toBe(false);

      // Check if listener is properly cleaned up
      // Callbacks skipped here as they are already checked below for each event
      this.langutil.setLanguage('zh');
      this.langutil.setLanguage('en');
      // The counter should remain zero because no events were fired while the
      // listener was "active"
      expect(counter).toBe(0);

    });

    it(`${this.label}Event Listener (onSetLanguage)`, () => {
      let eventData = {};
      const onEvent = (e) => { eventData = e; };
      const id = this.langutil.addEventListener('onSetLanguage', onEvent);

      // Make sure callback is invoked and returned data are appropriate
      this.langutil.setLanguage('zh');
      expect(eventData).toStrictEqual({
        type: 'onSetLanguage',
        detail: {
          oldState: { language: 'en', autoDetect: false },
          newState: { language: 'zh', autoDetect: false },
        }
      });

      // Cleanup & revert settings
      this.langutil.removeEventListener(id);
      this.langutil.setLanguage('en');
    });

    it(`${this.label}Event Listener (onSetDictionary)`, () => {
      let eventData = {};
      const onEvent = (e) => { eventData = e; };
      const id = this.langutil.addEventListener('onSetDictionary', onEvent);

      // Make sure callback is invoked and returned data are appropriate
      const tempDictionary = { en: { MEOW: 'meow' } };
      this.langutil.setDictionary(tempDictionary);
      expect(eventData).toStrictEqual({
        type: 'onSetDictionary',
        detail: { dictionary: tempDictionary }
      });

      // Cleanup & revert settings
      this.langutil.removeEventListener(id);
      this.langutil.setDictionary(this.dictionary);

    });

    it(`${this.label}Event Listener (onAppendDictionary)`, () => {

      let eventData = {};
      const onEvent = (e) => { eventData = e; };
      const id = this.langutil.addEventListener('onAppendDictionary', onEvent);

      // Make sure callback is invoked and returned data are appropriate
      const tempDictionary = { en: { MEOW: 'meow' } };
      this.langutil.appendDictionary(tempDictionary, 'event-test');
      expect(eventData.type).toBe('onAppendDictionary');
      expect(isInDictionary(eventData.detail.dictionary, 'en', 'MEOW', 'meow')).toBe(true);

      // Cleanup & revert settings
      this.langutil.removeEventListener(id);
      this.langutil.setDictionary(this.dictionary);

    });

    it(`${this.label}Event Listener (onAny)`, () => {

      let eventData = {};
      const onEvent = (e) => { eventData = e; };
      const id = this.langutil.addEventListener('onAny', onEvent);

      // Make sure callback is invoked and returned data are appropriate
      const tempDictionary = {};
      this.langutil.appendDictionary(tempDictionary, 'event-test-any');
      expect(eventData).toStrictEqual({
        type: 'onAppendDictionary',
        detail: { dictionary: tempDictionary }
      });

      // Cleanup & revert settings
      this.langutil.removeEventListener(id);

    });

  }

}

module.exports = { BasicTest, DictionaryVariationTest };

function isInDictionary(dictionary, language, keyword, value) {
  let exists = false;
  try {
    exists = dictionary[language][keyword] === value;
  } catch (e) { } // eslint-disable-line
  try {
    exists = dictionary[keyword][language] === value;
  } catch (e) { } // eslint-disable-line
  return exists;
}
