declare namespace langutil {

  // Markers for Project-based Autosuggestions
  // marker-start-language
  type LangutilLanguage = string
  // marker-end-language
  // marker-start-keyword
  type LangutilKeyword = string
  // marker-end-keyword

  type LangutilDetector = Function
  type LangutilDictionary = object
  type LangutilEventId = string
  type LangutilSetLanguageEvent = 'onSetLanguage'
  type LangutilSetDictionaryEvent = 'onSetDictionary'
  type LangutilAppendDictionaryEvent = 'onAppendDictionary'
  type LangutilAnyEvent = 'onAny'
  type LangutilEventType =
    | LangutilSetLanguageEvent
    | LangutilSetDictionaryEvent
    | LangutilAppendDictionaryEvent
    | LangutilAnyEvent
  interface LangutilState { language: LangutilLanguage, autoDetect: boolean }
  interface LangutilLanguageEventDetail {
    oldState: LangutilState
    newState: LangutilState
  }
  interface LangutilDictionaryEventDetail {
    dictionary: LangutilDictionary
  }
  type LangutilEvent<T, D> = { type: T, detail: D }
  type LangutilParam = Array<any> | object

  interface InitSpecs {
    (
      dictionary: LangutilDictionary,
      language: LangutilLanguage,
      detector?: LangutilDetector
    ): void
  }

  interface SetLanguageSpecs {
    (
      language: LangutilLanguage,
      detector?: LangutilDetector
    ): void
  }

  interface SetDictionarySpecs {
    (dictionary: LangutilDictionary): void
  }

  interface LocalizeSpecs {
    (
      keyword: LangutilKeyword,
      param?: LangutilParam
    ): any
    (props: {
      keyword: LangutilKeyword,
      param?: LangutilParam
    }): any
  }

  interface LocalizeExplicitlySpecs {
    (
      language: LangutilLanguage,
      keyword: LangutilKeyword,
      param?: LangutilParam
    ): any
    (props: {
      language: LangutilLanguage,
      keyword: LangutilKeyword,
      param?: LangutilParam
    }): any
  }

  interface LocalizeFromScratchSpecs {
    (
      dictionary: LangutilDictionary,
      language: LangutilLanguage,
      keyword: LangutilKeyword,
      param?: LangutilParam
    ): any
    (
      dictionary: LangutilDictionary,
      props: {
        language: LangutilLanguage,
        keyword: LangutilKeyword,
        param?: LangutilCore
      }
    ): any
  }

  interface AddEventListenerSpecs {
    (
      type: LangutilSetLanguageEvent,
      callback: (event: LangutilEvent<
        LangutilSetLanguageEvent,
        LangutilLanguageEventDetail
      >) => {}
    ): LangutilEventId
    (
      type: LangutilSetDictionaryEvent,
      callback: (event: LangutilEvent<
        LangutilSetDictionaryEvent,
        LangutilDictionaryEventDetail
      >) => {}
    ): LangutilEventId
    (
      type: LangutilAppendDictionaryEvent,
      callback: (event: LangutilEvent<
        LangutilAppendDictionaryEvent,
        LangutilDictionaryEventDetail
      >) => {}
    ): LangutilEventId
    (
      type: LangutilAnyEvent,
      callback: (event: LangutilEvent<
        | LangutilSetLanguageEvent
        | LangutilSetDictionaryEvent
        | LangutilAppendDictionaryEvent,
        | LangutilLanguageEventDetail
        | LangutilDictionaryEventDetail
      >) => {}
    ): LangutilEventId
  }

  interface RemoveEventListenerSpecs {
    (listenerId: LangutilEventId): void
  }

  const localizeFromScratch: LocalizeFromScratchSpecs
  function getResolvedClosestLanguage(
    unconfirmedLanguage: LangutilLanguage,
    availableLanguages: Array<LangutilLanguage>
  ): LangutilLanguage
  const AutoDetect: LangutilDetector
  const VERSION: string

  const init: InitSpecs;
  const setDictionary: SetDictionarySpecs
  const appendDictionary: SetDictionarySpecs
  const setLanguage: SetLanguageSpecs
  function getLanguage(): LangutilLanguage
  function getGuidedLanguage(detector: LangutilDetector): LangutilLanguage
  function getAllLanguages(): Array<LangutilLanguage>
  function getAutoDetectStatus(): boolean
  const localize: LocalizeSpecs
  const localizeExplicitly: LocalizeExplicitlySpecs
  const addEventListener: AddEventListenerSpecs
  const removeEventListener: RemoveEventListenerSpecs

  class LangutilCore {
    constructor(
      dictionary: LangutilDictionary,
      language: LangutilLanguage,
      detector?: LangutilDetector
    )
    init: InitSpecs
    setDictionary: SetDictionarySpecs
    appendDictionary: SetDictionarySpecs
    setLanguage: SetLanguageSpecs
    getLanguage(): LangutilLanguage
    getGuidedLanguage(detector: LangutilDetector): LangutilLanguage
    getAllLanguages(): Array<LangutilLanguage>
    getAutoDetectStatus(): boolean
    localize: LocalizeSpecs
    localizeExplicitly: LocalizeExplicitlySpecs
    addEventListener: AddEventListenerSpecs
    removeEventListener: RemoveEventListenerSpecs
  }

}

export = langutil;
export as namespace langutil;
