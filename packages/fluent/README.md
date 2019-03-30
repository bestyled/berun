# @berun/fluent

Use a chaining API to generate and simplify the modification of
front end build and development configurations.

\_Note: This is just a thin wrapper around `webpack-chain` with just the core
fluent (chainable) maps and sets included, to enable the development of
a fluent interface for any such tool, not just webpack.

## FluentMap

One of the core API interfaces in @berun/fluent is a `FluentMap`. A `FluentMap` operates
similar to a JavaScript Map, with some conveniences for chaining and generating configuration.
If a property is marked as being a `FluentMap`, it will have an API and methods as described below:

**Unless stated otherwise, these methods will return the `FluentMap`, allowing you to chain these methods.**

```js
// Remove all entries from a Map.
clear()
```

```js
// Remove a single entry from a Map given its key.
// key: *
delete key
```

```js
// Fetch the value from a Map located at the corresponding key.
// key: *
// returns: value
get(key)
```

```js
// Set a value on the Map stored at the `key` location.
// key: *
// value: *
set(key, value)
```

```js
// Returns `true` or `false` based on whether a Map as has a value set at a particular key.
// key: *
// returns: Boolean
has(key)
```

```js
// Returns an array of all the values stored in the Map.
// returns: Array
values()
```

```js
// Returns an object of all the entries in the backing Map
// where the key is the object property, and the value
// corresponding to the key. Will return `undefined` if the backing
// Map is empty.
// This will order properties by their name if the value is
// a FluentMap that used .before() or .after().
// returns: Object, undefined if empty
entries()
```

```js
// Provide an object which maps its properties and values
// into the backing Map as keys and values.
// You can also provide an array as the second argument
// for property names to omit from being merged.
// obj: Object
// omit: Optional Array
merge(obj, omit)
```

```js
// Execute a function against the current configuration context
// handler: Function -> FluentMap
// A function which is given a single argument of the FluentMap instance
batch(handler)
```

```js
// Conditionally execute a function to continue configuration
// condition: Boolean
// whenTruthy: Function -> FluentMap
// invoked when condition is truthy, given a single argument of the FluentMap instance
// whenFalsy: Optional Function -> FluentMap
// invoked when condition is falsy, given a single argument of the FluentMap instance
when(condition, whenTruthy, whenFalsy)
```

## FluentSet

Another of the core API interfaces in [BeRun Fluent](https://github.com/bestyled/berun/master/packages/fluent)is a `FluentSet`. A `FluentSet` operates
similar to a JavaScript Set, with some conveniences for chaining and generating configuration.
If a property is marked as being a `FluentSet`, it will have an API and methods as described below:

**Unless stated otherwise, these methods will return the `FluentSet`, allowing you to chain these methods.**

```js
// Add/append a value to the end of a Set.
// value: *
add(value)
```

```js
// Add a value to the beginning of a Set.
// value: *
prepend(value)
```

```js
// Remove all values from a Set.
clear()
```

```js
// Remove a specific value from a Set.
// value: *
delete value
```

```js
// Returns `true` or `false` based on whether or not the
// backing Set contains the specified value.
// value: *
// returns: Boolean
has(value)
```

```js
// Returns an array of values contained in the backing Set.
// returns: Array
values()
```

```js
// Concatenates the given array to the end of the backing Set.
// arr: Array
merge(arr)
```

```js
// Execute a function against the current configuration context
// handler: Function -> FluentSet
// A function which is given a single argument of the FluentSet instance
batch(handler)
```

```js
// Conditionally execute a function to continue configuration
// condition: Boolean
// whenTruthy: Function -> FluentSet
// invoked when condition is truthy, given a single argument of the FluentSet instance
// whenFalsy: Optional Function -> FluentSet
// invoked when condition is falsy, given a single argument of the FluentSet instance
when(condition, whenTruthy, whenFalsy)
```
