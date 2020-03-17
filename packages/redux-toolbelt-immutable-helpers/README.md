# Redux-Toolbelt Immutable Helpers

A set of helper functions to reduce verbosity inside Redux reducers.  
Written in ES6.

<p align="center">
  <img align="center" src="https://raw.githubusercontent.com/welldone-software/redux-toolbelt/master/redux-toolbelt-logo.png" alt="redux-toolbelt logo"/>
</p>

## TOC

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
  * [Example](#example)
- [API Reference](#api-reference)
  * [`addItemsInIndex()`](#additemsinindex)
  * [`filterByIds()`](#filterbyids)
  * [`pushItems()`](#pushitems)
  * [`removeItem()`](#removeitem)
  * [`removeItemsById()`](#removeitemsbyid)
  * [`replaceItem()`](#replaceitem)
  * [`repositionItem()`](#repositionitem)
  * [`repositionItemById()`](#repositionitembyid)
  * [`unshiftItems()`](#unshiftitems)
  * [`updateItem()`](#updateitem)
  * [`updateItemById()`](#updateitembyid)
  * [`updateItemsByFilter()`](#updateitemsbyfilter)
  * [`updateItemsById()`](#updateitemsbyid)
  * [`updateObjectProperty()`](#updateobjectproperty)
  * [`updateObjectProperties()`](#updateobjectproperties)
  * [`upsertItemsById()`](#upsertitemsbyid)

<!-- tocstop -->

## Article

[Read about `redux-toolbelt` here](https://medium.com/welldone-software/redux-toolbelt-supercharge-your-redux-ec16e704fe93)

## Installation
The helpers are available in the [`redux-toolbelt-immutable-helpers`](https://www.npmjs.com/package/redux-toolbelt-immutable-helpers) npm package.
```sh
npm install --save redux-toolbelt-immutable-helpers

# or

yarn add redux-toolbelt-immutable-helpers
```

## Usage

These utility functions are pure functions, they never change the provided arguments. If no changes are necessary, the original reference is returned.

Usually you can reduce complex code inside switch cases to just one or 2 functions calls. They are also great for writing selectors.

You may import the functions you'd like to use using one of these two methods:
```js
import {pushItems, addItemsInIndex /* ... */} from 'redux-toolbelt-immutable-helpers'

// or

import pushItems from 'redux-toolbelt-immutable-helpers/lib/pushItems'
import addItemsInIndex from 'redux-toolbelt-immutable-helpers/lib/addItemsInIndex'

```

### Example
Using the provided functions to reduce the verbosity inside Redux reducers:
```js
// instead of:
const todosReducer(state = [], action) {
  switch(action.type) {
    case 'ADD_TODO': {
      const {todoItem} = action.payload
      return todoItem
        ? [...state, todoItem]
        : state
    }
    case 'UPDATE_TODO': {
      const {idx, todoItem} = action.payload
      const todoItem
        ? [
          ...state.slice(0, idx),
          todoItem,
          ...state.slice(idx + 1)
        ]
        : state
    }
    default:
      return state
  }
}

// you can do
import {pushItems, pushItems} from 'redux-toolbelt-immutable-helpers'
const todosReducer(state = [], action) {
  switch(action.type) {
    case 'ADD_TODO': {
      const {todoItem} = action.payload
      return pushItems(state, todoItem)
    }
    case 'UPDATE_TODO': {
      const {idx, todoItem} = action.payload
      return updateItem(state, idx, todoItem)
    }
    default:
      return state
  }
}
```

## API Reference

### `addItemsInIndex()`
Adds items to an array at the specified index.
```js
const a = [1, 2, 3]

const b = addItemsInIndex(a, 2, [4, 5])
// a ==> [1, 2, 3]
// b ==> [1, 2, 4, 5, 3]
```

### `filterByIds()`
Filters array items by `id` field or other calculated primitive value.
```js
const a = [
  {id: 1, name: 'Alex'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Charlie'},
  {id: 4, name: 'Donna'}
]

const b = filterByIds(a, [2, 3])
// b ==> [
//    {id: 2, name: 'Bob'},
//    {id: 3, name: 'Charlie'}
//  ]

const c = filterByIds(a, ['Alex', 'Donna'], item => item.name)
// c ==> [
//    {id: 1, name: 'Alex'},
//    {id: 4, name: 'Donna'}
//  ]
```

### `pushItems()`
Adds items to the end of an array.
```js
const a = [1]

const b = pushItems(a, [2, 3])
// a ==> [1]
// b ==> [1, 2, 3]
```

### `removeItem()`
Removes an item from the specified index of an array.
```js
const a = [1, 2, 3, 4, 5]

const b = removeItem(a, 3)
// a ==> [1, 2, 3, 4, 5]
// b ==> [1, 2, 3, 5]
```

### `removeItemsById()`
Removes array items by the `id` field value or other calculated primitive value.
```js
const a = [
  {id: 1, name: 'Alex'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Charlie'},
  {id: 4, name: 'Donna'}
]

const b = removeItemsById(a, [{id: 2}, {id: 3}])
// b ==> [
//    {id: 1, name: 'Alex'},
//    {id: 4, name: 'Donna'}
//  ]

const c = removeItemsById(a, [{name: 'Alex'}, {name: 'Donna'}], item => item.name)
// c ==> [
//    {id: 2, name: 'Bob'},
//    {id: 3, name: 'Charlie'}
//  ]
```

### `replaceItem()`
Replaces an item at the specified index of an array.
```js
const a = [1, 2, 3, 4, 5]

const b = replaceItem(a, 2, 7)
// a ==> [1, 2, 3, 4, 5]
// b ==> [1, 2, 7, 4, 5]
```

### `repositionItem()`
Moves an item in an array from one index to another.
```js
const a = [1, 2, 3, 4, 5]

const b = repositionItem(a, 1, 3)
// a ==> [1, 2, 3, 4, 5]
// b ==> [1, 3, 4, 2, 5]
const c = repositionItem(a, 3, 'start')
// c ==> [4, 1, 2, 3, 5]

const c = repositionItem(a, 2, 'end')
// c ==> [1, 2, 4, 5, 3]
```

### `repositionItemById()`
Moves an array item to a new position by the `id` field value or other calculated primitive value.
```js
const a = [
  {id: 1, name: 'Alex'},
  {id: 2, name: 'Bob'},
  {id: 3, name: 'Charlie'},
  {id: 4, name: 'Donna'}
]

const b = repositionItemById(a, 2, 'start')
// b ==> [
//    {id: 2, name: 'Bob'},
//    {id: 1, name: 'Alex'},
//    {id: 3, name: 'Charlie'},
//    {id: 4, name: 'Donna'}
//  ]

const c = repositionItemById(a, 2, 'end')
// c ==> [
//    {id: 1, name: 'Alex'},
//    {id: 3, name: 'Charlie'},
//    {id: 4, name: 'Donna'},
//    {id: 2, name: 'Bob'}
//  ]

const c = repositionItemById(a, 2, 2)
// c ==> [
//    {id: 1, name: 'Alex'},
//    {id: 3, name: 'Charlie'},
//    {id: 2, name: 'Bob'},
//    {id: 4, name: 'Donna'}
//  ]

const c = repositionItemById(a, 'Donna', 'start', item => item.name)
// c ==> [
//    {id: 4, name: 'Donna'},
//    {id: 1, name: 'Alex'},
//    {id: 3, name: 'Charlie'},
//    {id: 2, name: 'Bob'}
//  ]
```

### `unshiftItems()`
Adds items to the beginning of an array.
```js
const a = [1]

const b = pushItems(a, [2, 3])
// a ==> [1]
// b ==> [2, 3, 1]
```

### `updateItem()`
Updates the properties of an item at a specified index of an array.
```js
const a = [
  {id: 1, name: 'Alex', height: 170},
  {id: 2, name: 'Bob', height: 160},
  {id: 3, name: 'Charlie', height: 180},
  {id: 4, name: 'Donna', height: 150}
]

const b = updateItem(a, 3, {height: 160, hairColor: 'blond'})
// b ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 160},
//    {id: 3, name: 'Charlie', height: 180},
//    {id: 4, name: 'Donna', height: 160, hairColor: 'blond'}
//  ]
```

### `updateItemById()`
Updates the properties of an item by `id` field or other calculated primitive value..
```js
const a = [
  {id: 1, name: 'Alex', height: 170},
  {id: 2, name: 'Bob', height: 160},
  {id: 3, name: 'Charlie', height: 180},
  {id: 4, name: 'Donna', height: 150}
]

const b = updateItemById(a, 2, {height: 160, hairColor: 'blond'})
// b ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 160, hairColor: 'blond'},
//    {id: 3, name: 'Charlie', height: 180},
//    {id: 4, name: 'Donna', height: 140}
//  ]

const c = updateItemById(a, 'bob', {height: 160, hairColor: 'blond'}, item => item.name)
// c ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 160, hairColor: 'blond'},
//    {id: 3, name: 'Charlie', height: 180},
//    {id: 4, name: 'Donna', height: 140}
//  ]

// you can also use an update function
const b = updateItemById(a, 2, item => ({height: item.height + 20, hairColor: 'blond'}))
// b ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 180, hairColor: 'blond'},
//    {id: 3, name: 'Charlie', height: 180},
//    {id: 4, name: 'Donna', height: 140}
//  ]
```

### `updateItemsByFilter()`
Updates items in an array that match the specified criteria.
```js
const a = [
  {id: 1, val: 10},
  {id: 2, val: 50},
  {id: 3, val: 30},
  {id: 4, val: 40}
]

const b = updateItemsByFilter(a, val => val > 30, {val: 0, flag: true})
// b ==> [
//    {id: 1, val: 10},
//    {id: 2, val: 0, flag: true},
//    {id: 3, val: 30},
//    {id: 4, val: 0, flag: true}
//  ]

const b = updateItemsByFilter(a, item => item.val > 30, item => ({val: item.val - 20}))
// b ==> [
//    {id: 1, val: 10},
//    {id: 2, val: 30},
//    {id: 3, val: 30},
//    {id: 4, val: 20}
//  ]
```

### `updateItemsById()`
Updates items in an array by the `id` field value or other calculated primitive value.
```js
const a = [
  {id: 1, name: 'Alex', height: 170},
  {id: 2, name: 'Bob', height: 160},
  {id: 3, name: 'Charlie', height: 180},
  {id: 4, name: 'Donna', height: 150}
]

const b = updateItemsById(a, [{id: 2, height: 160, hairColor: 'blond'}, {id: 3, height: 150}])
// b ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 160, hairColor: 'blond'},
//    {id: 3, name: 'Charlie', height: 150},
//    {id: 4, name: 'Donna', height: 140}
//  ]

const c = updateItemsById(a, [{name: 'bob', height: 160, hairColor: 'blond'}], item => item.name)
// c ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 160, hairColor: 'blond'},
//    {id: 3, name: 'Charlie', height: 180},
//    {id: 4, name: 'Donna', height: 140}
//  ]
```

### `updateObjectProperty()`
Updates a single property of an object.
```js
const a = {id: 1, val: 5, type: 'something'}

const b = updateObjectProperty(a, 'val', 10})
// a ==> {id: 1, val: 5, type: 'something'}
// b ==> {id: 1, val: 10, type: 'something'}
```

### `updateObjectProperties()`
Updates multiple properties of an object.
```js
const a = {id: 1, val1: 5, val2: 6, type: 'something'}

const b = updateObjectProperties(a, {val1: 9, otherval: 20})
// a ==> {id: 1, val1: 5, val2: 6, type: 'something'}
// b ==> {id: 1, val1: 9, val2: 6, type: 'something', otherVal: 20}
```
You can also update multiple items with the same value.
```js
const a = {id: 1, val1: 5, val2: 6, type: 'something'}

const b = updateObjectProperties(a, ['val1', 'val2'], 10)
// a ==> {id: 1, val1: 5, val2: 6, type: 'something'}
// b ==> {id: 1, val1: 10, val2: 10, type: 'something'}
```
Or update the chosen properties using an updater function.
```js
const a = {id: 1, val1: 5, val2: 6, type: 'something'}

const b = updateObjectProperties(a, ['val1', 'val2'], (value, prop) => value + 1)
// a ==> {id: 1, val1: 5, val2: 6, type: 'something'}
// b ==> {id: 1, val1: 6, val2: 7, type: 'something'}
```
Or you can update all properties using an updater function.
```js
const a = {id: 1, val1: 5, val2: 6, type: 'something'}

const b = updateObjectProperties(a, (value, prop) => `${prop}-${value}`)
// a ==> {id: 1, val1: 5, val2: 6, type: 'something'}
// b ==> {id: 'id-1', val1: 'val1-5', val2: 'val2-6', type: 'type-something'}
```

### `upsertItemsById()`
Updates or adds items to an array by the `id` field value or other calculated primitive value.
```js
const a = [
  {id: 1, name: 'Alex', height: 170},
  {id: 2, name: 'Bob', height: 160},
  {id: 3, name: 'Charlie', height: 180},
  {id: 4, name: 'Donna', height: 150}
]

const b = updateItemsById(a, [
  {id: 2, height: 150, hairColor: 'blond'},
  {id: 5, name: 'Ebby', height: 150}
])
// b ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 150, hairColor: 'blond'},
//    {id: 3, name: 'Charlie', height: 180},
//    {id: 4, name: 'Donna', height: 140},
//    {id: 5, name: 'Ebby', height: 150}
//  ]

const c = upsertItemsById(a, [{name: 'bob', height: 160, hairColor: 'blond'}], item => item.name)
// c ==> [
//    {id: 1, name: 'Alex', height: 170},
//    {id: 2, name: 'Bob', height: 160, hairColor: 'blond'},
//    {id: 3, name: 'Charlie', height: 180},
//    {id: 4, name: 'Donna', height: 140}
//  ]
```
