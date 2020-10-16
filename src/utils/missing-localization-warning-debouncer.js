class MissingLocalizationWarningDebouncer {

  constructor() {
    this.MANGLE_missingLocalizations = {};
    this.MANGLE_memoizedStack = [];
    this.MANGLE_timer = null;

    this.MANGLE_pushWarning = this.MANGLE_pushWarning.bind(this);
    this.MANGLE_debounce = this.MANGLE_debounce.bind(this);

    this.MANGLE_printWarning = this.MANGLE_debounce(() => {
      const mIndex = Object.keys(this.MANGLE_missingLocalizations);
      if (mIndex.length > 1) {
        // Format keywords in the stack & sort them first
        // since there are multiple languages
        let messageStack = [];
        for (let i = 0; i < mIndex.length; i++) {
          messageStack.push(`(${mIndex[i]}): ${this.MANGLE_missingLocalizations[mIndex[i]].join(', ')}`);
        }
        messageStack.sort((a, b) => {
          let _a = a.match(/^\(.+(?=\):)/)[0]; _a = _a.replace(/^\(/, '');
          let _b = b.match(/^\(.+(?=\):)/)[0]; _b = _b.replace(/^\(/, '');
          return _a > _b ? 1 : -1;
        });
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Missing localizations\n${messageStack.join('\n')}`);
        }
      } else if (mIndex.length === 1) {
        // Show a one line warning, save performance
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`Missing localizations (${mIndex[0]}): ${this.MANGLE_missingLocalizations[mIndex[0]].join(', ')}`);
        }
      }
      this.MANGLE_missingLocalizations = {};
    });

  }

  MANGLE_pushWarning(language, keyword) {
    const memoKey = `${language},${keyword}`;
    if (!this.MANGLE_memoizedStack.includes(memoKey)) {
      // Since these slots are dynamically allocated, we need to make sure
      // that every language has an array slot initialized before pushing anything in
      // if (!config.missingLoc[lang]) { config.missingLoc[lang] = []; }
      if (!this.MANGLE_missingLocalizations[language]) {
        this.MANGLE_missingLocalizations[language] = [];
      }
      // Keywords themselves are pushed into missingLoc
      // so that they can all be logged at once later
      this.MANGLE_missingLocalizations[language].push(keyword);
      // Detected missing localizations are memoized so that they are only warned once
      this.MANGLE_memoizedStack.push(memoKey);
      this.MANGLE_printWarning();
    }
  }

  MANGLE_debounce(callback) {
    return function () {
      clearTimeout(this.MANGLE_timer);
      this.MANGLE_timer = setTimeout(callback);
    };
  }

}

module.exports = MissingLocalizationWarningDebouncer;
