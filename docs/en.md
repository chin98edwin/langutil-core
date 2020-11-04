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
const language = langutil.getLanguage()
console.log(language) // en
```

## getGuidedLanguage

Resolves a given language into one that exists within the specified list by returning the closest match.

```js
const availableLanguages = ['en', 'ja', 'my', 'zh-Hans', 'zh-Hant'],

const example1 = langutil.getGuidedLanguage(() => 'zh', availableLanguages, 'en')
console.log(example1) // zh

const example2 = langutil.getGuidedLanguage(() => 'gibberish', availableLanguages, 'en')
console.log(example2) // en

const example3 = langutil.getGuidedLanguage(langutil.AutoDetect, availableLanguages, 'en')
// You may also use the `AutoDetect` imported from Langutil
```

## getAllLanguages

Gets all existing languages in the dictionary.

```js
const dictionary = {
    en: { /* ... */ },
    ja: { /* ... */ },
    my: { /* ... */ },
}
const allLanguages = langutil.getAllLanguages()
console.log(allLanguages) // ['en', 'ja', 'my']
```

## getAutoDetectStatus

Get whether auto language detection is active.

```js
const isAuto = langutil.getAutoDetectStatus()
```

## localize

Translate keywords into contents of the user's preferred language.

```js
langutil.init({
    en: { 
        HELLO: 'Hello',
        HELLO_NAME_1: 'Hello, %p',
        HELLO_NAME_2: 'Hello, {:name}',
    },
}, 'en')


localize('HELLO') // Hello
localize('HELLO_NAME_1', ['John']) // Hello, John
localize('HELLO_NAME_2', { name: 'Jane' }) // Hello, Jane
```

## localizeExplicitly

Translate keywords into contents of a specific language, regardless of the user's preference.

```js
langutil.init({
    en: { 
        HELLO: 'Hello',
        HELLO_NAME_1: 'Hello, %p',
        HELLO_NAME_2: 'Hello, {:name}',
    },
    zh: { 
        HELLO: '哈咯',
        HELLO_NAME_1: '哈咯，%p',
        HELLO_NAME_2: '哈咯，{:name}',
    },
}, 'en')

localizeExplicitly('zh', 'HELLO') // 哈咯
localizeExplicitly('zh', 'HELLO_NAME_1', ['John']) // 哈咯，John
localizeExplicitly('zh', 'HELLO_NAME_2', { name: 'Jane' }) // 哈咯，Jane
```

## addEventListener / removeEventListener

Add a listener to trigger a callback when the language or dictionary changes. There are 4 event types that you can listen to: `'SetLanguage'`, `'onSetDictionary'`, `'onAppendDictionary'` or `'onAny'`.

In each callback, you will have access to `type` which is the event type and `detail` where it contains `oldState` and `newState` for language-based events and `dictionary` for dictionary-based events.

```js
const listenerId = langutil.addEventListener('onAny', (event) => {
    console.log(event)
})

langutil.setLanguage('zh')
// {
//     type: 'onAny',
//     detail: { 
//         oldState: { language: 'en', auto: false },
//         newState: { language: 'zh', auto: false },
//         dictionary: { ... },
//     },
// }
```

`langutil.addEventListener` returns a listener ID. To stop listening, pass the listener ID into `langutil.removeEventListener`.

```js
langutil.removeEventListener(listenerId)
```
