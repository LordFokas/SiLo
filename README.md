# SiLo - What is it?
SiLo (Simple Localize) is, you guessed it, a simple pure JS localization engine. (It might also store and launch ICBM rockets.)
Being made in pure JS it will work no matter what frameworks and libraries you use.
It is aimed explicitely at browsers.

# SiLo - How to use
1. Add your keys to the HTML tags. What you'd write as `<span>Hello World</span>` now should become `<span data-silo-key="string:silo.test.helloworld"></span>`. The specification for the `data-silo-key` attribute is `func:key` where `func` represents a function that loads text into an element (more on that later) and `key` represents a path within the dictionary to a localized string to load (more on that later as well).
0. Load your dictionary into **SiLo** by calling one of the `SiLo.language.*( ... )` functions.
0. Call one of the `SiLo.localize.*( ... )` functions to have the text written into the element(s).
0. Repeat steps 2 & 3 every time you change languages. Repeat step 3 everytime your scripts add new localizable DOM Elements.

# SiLo - Dictionary Format
A dictionary is merely an object with string values. We usually store these in JSON files and retrieve them by AJAX as needed, like this:
```json
{
  "silo":{
    "test":{
      "helloworld": "Hello World"
    },

    "name": "SiLo",
    "desc": "Stores and launches ICBMs"
  }
}
```
The localization engine can look at keys such as `silo.test.helloworld` and properly traverse the dictionary to find the respective string. The translations don't all need to be in the same nesting level, you just need to select the proper keys. The behavior for when a key points to a non-string value is undefined: if it's a primitive it will likely be OK, if it's an object, function or array it will likely cause some form of error; however a custom function (more on that later) can probably handle it better.

# SiLo - Functions
Functions receive a localized string and put it in the appropriate place of an (also received) element.

## Built-in Functions
+ **string** - sets the translation as innerHTML. Be mindful of children nodes (they will be destroyed).
+ **text** - same as **string** but replaces `\n` by `<br />`.
+ **tooltip** - sets the translation as the `title` attribute, which shows up as a tooltip when the mouse hovers over it.
+ **hint** - sets the translation as the `placeholder` attribute, which shows up on empty text inputs.
+ **value** - sets the translation as the `value` attribute of an input. Beware that using this might mess with application state if you re-localize the page after the user has changed the input values.

## Custom Functions
You can use the `SiLo.functions.*( ... )` functions to register your own custom functions.
Custom functions must abide by the `func( element, str )` signature, where `element` is the DOM Element to localize and `str` is the localized string to set.

# SiLo - Library Summary
## SiLo.language
+ **SiLo.language.load( dictionary, makeFallback )** - Sets the `dictionary` object as the current dictionary. If `makeFallback` is true this dictionary will also be set as the fallback dictionary for when a key can't be found in the current one (for example, to write in english if a sentence is unavailable in the current language).
+ **SiLo.language.cache( code, loader, relocalize, makeFallback )** - Sets the current dictionary from cache. If there is no `code` entry in the cache, `loader` (a callback you must provide) will be asked to load it; the `loader` must follow the `loader( code, callback )` signature, where `code` is the same language/country code entry missing from cache and `callback( dictionary )` must be called once you successfuly load the dictionary file -- not calling it simply results in the operation being aborted. When the language finishes loading, `relocalize` will be called: this is a callback you provide so that you can relocalize the document once the language switching is done successfully. `makeFallback` works in the same way as in the simpler **load** function.

## SiLo.localize
+ **SiLo.localize.all( )** - Localizes the entire document. The same as calling `Silo.localize.recursive(document.body)`.
+ **SiLo.localize.recursive( element )** - Localizes `element` and all its descendants recursively.
+ **SiLo.localize.class( className )** - Localizes all elements of class `className`.

## SiLo.functions
+ **SiLo.functions.all( )** - Retrieves the entire function map (object) so that you may read or modify it as you wish.
+ **SiLo.functions.add( key, func )** - Sets the `key` entry in the function map to `func`. This will replace the entry if it already exists, including built-in functions.
+ **SiLo.functions.remove( key )** - Removes the entry under this `key`. Can be used to remove added or built-in functions alike.
+ **SiLo.functions.clear( )** - Replaces the function map with a new blank object.

## SiLo.warnings
+ **SiLo.warnings.all( func )** - Registers `func` as the listener for all 3 warnings. Listeners must fulfill the `func( warn, param, full)` signature, where `warn` is a string describing the warning type, `param` is the parameter that failed, and `full` is the complete `data-silo-key` attribute of the element where the failure occured. This (and the other warning functions) is mostly useeful for development and debug purposes.
+ **SiLo.warnings.fallback( func )** - Sets `func` as the listener for when a key was not found in the current dictionary but is present in the fallback one (if one was set). The listener must respect the signature described in **SiLo.warnings.all**.
+ **SiLo.warnings.no_key( func )** - Sets `func` as the listener for when a key was not found in the current dictionary nor in the fallback one (if one was set). The listener must respect the signature described in **SiLo.warnings.all**.
+ **SiLo.warnings.no_func( func )** - Sets `func` as the listener for when a function is specified in an element but does not exist in the function map (if, for example, you made a typo or removed a function that was in use). The listener must respect the signature described in **SiLo.warnings.all**.
