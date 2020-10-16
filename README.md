# Introduction

Langutil is a very flexible tool for localizing in JavaScript. It also works with React and React Native.

The core of langutil is now exposed as a class. The package ships with one that's ready to use out of the box, but in rare cases where you need a separate core for special tasks, it is now possible.

Other links:
* [Documentations](https://langutil.web.app)
* [Support me on Patreon](https://www.patreon.com/langutil)

# Important Notes
This package is created to replace [langutil](https://www.npmjs.com/package/langutil). The old langutil tried to do too many things and end up being bloated and hard to maintain. The new langutil aims just to do a few things and do it right.

# Installation

    # NPM
    npm install @langutil/core

    # Yarn
    yarn add @langutil/core

    # Unpkg
    <script src="https://unpkg.com/@langutil/core@latest/dist/langutil-core.dev.min.js" crossorigin></script>

# API References

## init

Shorthand for `setDictionary` & `setLanguage`.

```js
import langutil, { AutoDetect } from '@langutil/core'
import dictionary from './dictionary'

langutil.init(dictionary, 'en', AutoDetect)
```

## setDictionary

Sets the dictionary.

```js
import langutil from '@langutil/core'
import dictionary from './dictionary'

langutil.setDictionary(dictionary)
```

## appendDictionary

Merge another dictionary into the current one.

```js
import langutil from '@langutil/core'
import dictionary2 from './dictionary-2'

langutil.appendDictionary(dictionary2)
```
## setLanguage

Sets the language.

```js
    import langutil from '@langutil/core'

    langutil.setDictionary('en')
```
## getLanguage

Gets the current active language.

```js
// Assuming previously set language is 'en'
const language = getLanguage()
console.log(language) // en
```

## getGuidedLanguage

## getAllLanguages

## getAutoDetectStatus

## localize

## localizeExplicitly

## addEventListener

## removeEventListener


