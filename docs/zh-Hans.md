# API 索引

## init

`setDictionary` 和 `setLanguage` 的速记。

```js
import langutil, { AutoDetect } from '@langutil/core'
import dictionary from './dictionary'

langutil.init(dictionary, 'zh', AutoDetect)
```

## setDictionary

设定词典的数值。

```js
import langutil from '@langutil/core'
import dictionary from './dictionary'

langutil.setDictionary(dictionary)
```

## appendDictionary

把另一个词典合并入当前词典。

```js
import langutil from '@langutil/core'
import dictionary2 from './dictionary-2'

langutil.appendDictionary(dictionary2)
```
## setLanguage

设定语言数值。

```js
import langutil from '@langutil/core'

langutil.setDictionary('zh')
```
## getLanguage

返回当前语言数值。

```js
// 假设当前语言数值是 'zh'
const language = langutil.getLanguage()
console.log(language) // zh
```

## getGuidedLanguage

把当前提供的语言数值和一系列的语言数值列表做比较，然后返回一个最相近的语言数值。

```js
const availableLanguages = ['en', 'ja', 'my', 'zh-Hans', 'zh-Hant'],

const example1 = langutil.getGuidedLanguage(() => 'zh', availableLanguages, 'en')
console.log(example1) // zh

const example2 = langutil.getGuidedLanguage(() => 'aeiou', availableLanguages, 'en')
console.log(example2) // en

const example3 = langutil.getGuidedLanguage(langutil.AutoDetect, availableLanguages, 'en')
// 你也可以使用 langutil 的 `AutoDetect`
```

## getAllLanguages

返回当前词典里所拥有的语言列表。

```js
const dictionary = {
    ja: { /* ... */ },
    my: { /* ... */ },
    zh: { /* ... */ },
}
const allLanguages = langutil.getAllLanguages()
console.log(allLanguages) // ['ja', 'my', 'zh']
```

## getAutoDetectStatus

返回布尔值表示自动语言设置是否在启用中。

```js
const isAuto = langutil.getAutoDetectStatus()
```

## localize

把关键词翻译成用户设定的语言的内容。

```js
langutil.init({
    zh: { 
        HELLO: '哈咯',
        HELLO_NAME_1: '哈咯，%p',
        HELLO_NAME_2: '哈咯，{:name}',
    },
}, 'en')


localize('HELLO') // 哈咯
localize('HELLO_NAME_1', ['John']) // 哈咯，John
localize('HELLO_NAME_2', { name: 'Jane' }) // 哈咯，Jane
```

## localizeExplicitly

把关键词翻译成所指定语言的内容。

```js
langutil.init({
    zh: { 
        HELLO: '哈咯',
        HELLO_NAME_1: '哈咯，%p',
        HELLO_NAME_2: '哈咯，{:name}',
    },
    en: { 
        HELLO: 'Hello',
        HELLO_NAME_1: 'Hello, %p',
        HELLO_NAME_2: 'Hello, {:name}',
    },
}, 'en')

localizeExplicitly('en', 'HELLO') // Hello
localizeExplicitly('en', 'HELLO_NAME_1', ['John']) // Hello, John
localizeExplicitly('en', 'HELLO_NAME_2', { name: 'Jane' }) // Hello, Jane
```

## addEventListener / removeEventListener

你可以利用 langutil 的监听器来有条件性地使用函数。能被观察的事变名称有四种：`'SetLanguage'`, `'onSetDictionary'`, `'onAppendDictionary'` 和 `'onAny'`.

在函数里，你能够通过 `type` 知道事变名称；而通过 `detail` 获得更多详细资料。如果是语言被更换，`detail` 里将会包含 `oldState` 和 `newState`；如果是词典有更动，`detail` 里将会包含 `dictionary`。

```js
const listenerId = langutil.addEventListener('onAny', (event) => {
    console.log(event)
})

langutil.setLanguage('en')
// {
//     type: 'onAny',
//     detail: { 
//         oldState: { language: 'zh', auto: false },
//         newState: { language: 'en', auto: false },
//         dictionary: { ... },
//     },
// }
```

`langutil.addEventListener` 会返回一个监听 ID. 你可以把它用在 `langutil.removeEventListener` 以停止监听。

```js
langutil.removeEventListener(listenerId)
```
