# SiLo - What is it?
SiLo (Simple Localize) is, you guessed it, a simple pure JS localization engine. (It might also save and launch ICBM rockets.)
Being made in pure JS it will work no matter what frameworks and libraries you use.
It is aimed explicitely at browsers.

# SiLo - How to use
1. Add your keys to the HTML tags. What you'd write as `<span>Hello World</span>` now should become `<span data-silo-key="string:silo.test.helloworld"></span>`
0. Load your dictionary into **SiLo** by calling one of the `SiLo.language.*( ... )` functions.
0. Call one of the `SiLo.localize.*( ... )` functions to have the text written into the element(s).
0. Repeat steps 2 & 3 every time you change languages. Repeat step 3 everytime your scripts add new localizable DOM Elements.

# SiLo - Library Summary

## SiLo.language
+ **SiLo.language.load( dictionary, makeFallback )**
+ **SiLo.language.cache( code, loader, makeFallback )**

## SiLo.localize
+ **SiLo.localize.all( )**
+ **SiLo.localize.recursive( element )**
+ **SiLo.localize.class( className )**

## SiLo.functions
+ **SiLo.functions.all( )**
+ **SiLo.functions.add( key, func )**
+ **SiLo.functions.remove( key )**
+ **SiLo.functions.clear( )**

## SiLo.warnings
+ **SiLo.warnings.all( func )**
+ **SiLo.warnings.fallback( func )**
+ **SiLo.warnings.no_key( func )**
+ **SiLo.warningsno_func( func )**
