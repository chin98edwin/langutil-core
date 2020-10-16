const extractAB = require('./utils/extract-ab');
const getDictionaryInitType = require('./utils/get-dictionary-init-type');
const BASE = require('./langutil-bases');

class LangutilCore {

  constructor(dictionary, language, detector) {
    this.MANGLE_dictionary = {};
    this.MANGLE_appendCache = [];
    this.MANGLE_language = null;
    this.MANGLE_allLanguages = [];
    this.MANGLE_initByLang = false;
    this.MANGLE_isAutoDetected = false;
    // Prefer counter over random hashes to avoid collision
    this.MANGLE_hookCounter = 0;
    this.MANGLE_hookedReferences = {
      onSetLanguage: {},
      onSetDictionary: {},
      onAppendDictionary: {},
      onAny: {},
    };

    if (process.env.NODE_ENV !== 'production') {
      const MissingLocalizationWarningDebouncer = require('./utils/missing-localization-warning-debouncer');
      this.MANGLE_warningDebouncer = new MissingLocalizationWarningDebouncer();
    }

    this.init = this.MANGLE_init.bind(this);
    this.setDictionary = this.MANGLE_setDictionary.bind(this);
    this.appendDictionary = this.MANGLE_appendDictionary.bind(this);
    this.setLanguage = this.MANGLE_setLanguage.bind(this);
    this.getLanguage = () => { return this.MANGLE_language; };
    this.getGuidedLanguage = (detector) => {
      // NOTE: Type checking is already done in BASE
      return BASE.MANGLE_getGuidedLanguage(
        detector,
        this.MANGLE_allLanguages,
        this.MANGLE_language
      ).language;
    };
    this.__getDictionary = () => { return this.MANGLE_dictionary; };
    this.getAllLanguages = () => { return this.MANGLE_allLanguages; };
    this.getAutoDetectStatus = () => { return this.MANGLE_isAutoDetected; };
    this.localize = this.MANGLE_localize.bind(this);
    this.localizeExplicitly = this.MANGLE_localizeExplicitly.bind(this);
    this.addEventListener = this.MANGLE_addEventListener.bind(this);
    this.removeEventListener = this.MANGLE_removeEventListener.bind(this);
    this.MANGLE_SECRET_updateHookedItems = this.MANGLE_SECRET_updateHookedItems.bind(this);

    // If constructor is not empty, automatically initialize the core
    if (dictionary) { this.init(dictionary, language, detector); }
  }

  MANGLE_init(dictionary, language, detector) {
    this.setDictionary(dictionary);
    this.setLanguage(language, detector);
  }

  MANGLE_setDictionary(dictionary) {
    if (typeof dictionary !== 'object') {
      if (process.env.NODE_ENV === 'production') {
        throw new TypeError(`8,${typeof dictionary}`);
      } else {
        throw new TypeError(`Expected dictionary to be an object but got ${typeof dictionary}`);
      }
    }
    this.MANGLE_dictionary = dictionary;
    this.MANGLE_appendCache = [];
    this.MANGLE_initByLang = getDictionaryInitType(this.MANGLE_dictionary) === 'lang';
    const compositionAB = extractAB(this.MANGLE_dictionary);
    this.MANGLE_allLanguages = compositionAB[this.MANGLE_initByLang ? 'a' : 'b'];
    this.MANGLE_SECRET_updateHookedItems('onSetDictionary', { dictionary });
  }

  MANGLE_appendDictionary(dictionary, diffKey) {

    diffKey = `${diffKey}`;

    // If no diffKey is provided, dictionary will be appended repeatedly
    // If diffKey is found in cache, skip remaining code execution
    if (this.MANGLE_appendCache.includes(diffKey)) { return; }

    if (typeof dictionary !== 'object') {
      if (process.env.NODE_ENV === 'production') {
        throw new TypeError(`9,${typeof dictionary}`);
      } else {
        throw new TypeError(`Expected dictionary to be an object but got ${typeof dictionary}`);
      }
    }

    // If dictionary is empty, skip appending...
    if (Object.keys(dictionary).length > 0) {
      const newDictionaryIsInitByLang = getDictionaryInitType(dictionary) === 'lang';
      if (newDictionaryIsInitByLang !== this.MANGLE_initByLang) {
        dictionary = BASE.MANGLE_getFlippedDictionary(dictionary);
      }
      this.MANGLE_dictionary = BASE.MANGLE_getMergedDict(this.MANGLE_dictionary, dictionary);
    }

    // ...but events should still be fired
    this.MANGLE_SECRET_updateHookedItems('onAppendDictionary', { dictionary });
    if (diffKey) { this.MANGLE_appendCache.push(diffKey); }
  }

  MANGLE_setLanguage(language, detector) {

    // Old & new languages are separated so that they can be passed into
    // event listeners independently, this makes debugging easier in case
    // this.language is tampered from another source.
    const oldLanguage = this.MANGLE_language;
    const oldAuto = this.MANGLE_isAutoDetected;

    if (detector) {
      const guidedLanguageData = BASE.MANGLE_getGuidedLanguage(detector, this.MANGLE_allLanguages, this.MANGLE_language);
      this.MANGLE_isAutoDetected = guidedLanguageData.successful;
      this.MANGLE_language = guidedLanguageData.language;
      if (process.env.NODE_ENV !== 'production') {
        if (guidedLanguageData.extraInfo.length > 0) {
          for (const ex of guidedLanguageData.extraInfo) { console.info(ex); }
        }
      }
    } else {
      this.MANGLE_isAutoDetected = false;
      if (typeof language === 'string') {
        if (this.MANGLE_allLanguages.includes(language)) {
          this.MANGLE_language = language;
        } else {
          if (process.env.NODE_ENV === 'production') {
            throw ReferenceError(`6,${language}`);
          } else {
            throw ReferenceError(`No localizations found for '${language}'`);
          }
        }
      } else {
        if (process.env.NODE_ENV === 'production') {
          throw new TypeError(`2,${typeof language}`);
        } else {
          throw new TypeError(`Expected language to be a string but got ${typeof language}`);
        }
      }
    }
    this.MANGLE_SECRET_updateHookedItems('onSetLanguage', {
      oldState: {
        language: oldLanguage,
        autoDetect: oldAuto,
      },
      newState: {
        language: this.MANGLE_language,
        autoDetect: this.MANGLE_isAutoDetected,
      },
    });
  }

  MANGLE_localize(specA, specB) {
    const byObj = typeof specA === 'object';
    return BASE.MANGLE_localizeFromScratch({
      initByLang: this.MANGLE_initByLang,
      dictionary: this.MANGLE_dictionary,
      language: this.MANGLE_language,
      keyword: byObj ? specA.keyword : specA,
      param: byObj ? specA.param : specB,
      MANGLE_triggerWarning: this.MANGLE_warningDebouncer ? this.MANGLE_warningDebouncer.MANGLE_pushWarning : undefined,
    });
  }

  MANGLE_localizeExplicitly(specA, specB, specC) {
    const byObj = typeof specA === 'object';
    return BASE.MANGLE_localizeFromScratch({
      initByLang: this.MANGLE_initByLang,
      dictionary: this.MANGLE_dictionary,
      language: byObj ? specA.language : specA,
      keyword: byObj ? specA.keyword : specB,
      param: byObj ? specA.param : specC,
      MANGLE_triggerWarning: this.MANGLE_warningDebouncer ? this.MANGLE_warningDebouncer.MANGLE_pushWarning : undefined,
    });
  }

  MANGLE_addEventListener(eventType, callback) {
    // Note: Valid event types are hard coded like this since there are only 4
    const validEventTypes = ['onSetLanguage', 'onSetDictionary', 'onAppendDictionary', 'onAny'];
    if (validEventTypes.includes(eventType)) {
      const hash = ++this.MANGLE_hookCounter;
      this.MANGLE_hookedReferences[eventType][hash] = callback;
      const listenerId = `${eventType}-${hash}`;
      return listenerId;
    } else {
      const typeofEventType = typeof eventType === 'string' ? `'${eventType}'` : typeof eventType;
      if (process.env.NODE_ENV === 'production') {
        throw new TypeError(`3,${typeofEventType}`);
      } else {
        throw new TypeError(`Expected eventType to be one of [${validEventTypes.join(', ')}] but got ${typeofEventType}`);
      }
    }
  }

  MANGLE_removeEventListener(listenerId) {
    // Note: Valid event types are hard coded like this since there are only 4
    if (/(onSetLanguage|onSetDictionary|onAppendDictionary|onAny)-\d+/.test(listenerId)) {
      const [eventType, hash] = listenerId.split('-');
      delete this.MANGLE_hookedReferences[eventType][hash];
    } else {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('4');
      } else {
        throw new Error(`Invalid listenerId: ${listenerId}`);
      }
    }
  }

  // MaNgLe_batchRemoveEventListeners(eventTypeStack = []) {
  //   // Note: Valid event types are hard coded like this since there are only 4
  //   const validEventTypes = ['onSetLanguage', 'onSetDictionary', 'onAppendDictionary', 'onAny'];
  //   if (eventTypeStack === 'all') { eventTypeStack = [...validEventTypes]; }
  //   for (const eventType of eventTypeStack) {
  //     if (validEventTypes.includes(eventType)) {
  //       this.MANGLE_hookedReferences[eventType] = {};
  //     } else {
  //       const typeofEventType = typeof eventType === 'string' ? `'${eventType}'` : typeof eventType;
  //       if (process.env.NODE_ENV === 'production') {
  //         throw new TypeError(`3,${typeofEventType}`);
  //       } else {
  //         throw new TypeError(`Expected eventType to be one of [${validEventTypes.join(', ')}] but got ${typeofEventType}`);
  //       }
  //     }
  //   }
  // }

  MANGLE_SECRET_updateHookedItems(type, detail) {
    const hookedItemsSpecific = Object.values(this.MANGLE_hookedReferences[type]);
    const hookedItemsAny = Object.values(this.MANGLE_hookedReferences.onAny);
    const relevantHookedItems = [].concat(hookedItemsSpecific, hookedItemsAny);
    for (const callback of relevantHookedItems) {
      if (typeof callback === 'function') {
        callback({
          type, // This will help 'onAny' listeners to differentiate
          detail: BASE.MANGLE_prepareEventDetail(type, detail),
        });
      }
    }
  }

}

module.exports = LangutilCore;
