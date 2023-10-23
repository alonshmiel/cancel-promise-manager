# cancel-promise-manager
Cancel all async operations when one of them fails

## Table of contents
* [Motivation](#motivation)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Documentation](#documentation)

## Motivation
[Medium article](https://medium.com/@alonshmiel/imagine-that-there-are-multiple-async-tasks-running-in-parallel-i-e-11852dd9a3d4)

## Getting Started

installation:
```
npm install cancel-promise-manager
```
## Usage

```
import { CancelPromiseManager, CancelPromiseManagerEnum } from "cancel-promise-manager";

const onCancelAllPromises = async ({ resolvedPromisesData, rejectedPromiseData }) => {
  // it's called when one promise is rejected
};

const cpm = new CancelPromiseManager({
    isManagerEnabled: true,
    onCancelAllPromises,
});

const p = await cpm.addPromise({
      promiseFunc: () => { your async function },
      onCancel: (resolvedData) => { // you can cancel by your resolved data }
});

if (p === CancelPromiseManagerEnum.STATE.CANCELED) {
  // do something
}
```

## Documentation

The ``CancelPromiseManager`` class can be used to manage and cancel promises.

The class constructor takes two arguments:

* ``isManagerEnabled``: A boolean value that indicates whether or not the promise manager is enabled.
* ``onCancelAllPromises``: A callback function that is invoked when the ``cancelAllPromises()`` method is called. This function receives an object as an argument, which contains the following properties:

  * ``resolvedPromisesData``: An array of objects that represent the resolved promises. Each object has the following properties:
    * ``result``: The result of the resolved promise.
    * ``onCancel``: The callback function that was specified when the promise was added to the manager.
    * ``props``: Any additional properties that were specified when the promise was added to the manager.

  * ``rejectedPromiseData``: An object that represents the rejected promise, if any. This object has the same properties as the objects in the ``resolvedPromisesData`` array.

The ``CancelPromiseManager`` class has multiple methods:

* ``addPromise()`` method adds a promise to the manager. It takes three arguments:
  * ``promiseFunc``: A function that returns a promise.
  * ``onCancel``: optional. A callback function may be invoked when the promise is cancelled.
  * ``props``: Any additional properties that were specified when the promise was added to the manager.

* ``cancelAllPromises()`` method cancels all promises that are currently being managed by the class. It takes one argument:
  * ``rejectedPromiseData``: An object that represents the rejected promise. This object has the same properties as the objects in the ``resolvedPromisesData`` array that is passed to the ``onCancelAllPromises()`` callback function.

The ``cancelAllPromises()`` method will also invoke the ``onCancelAllPromises()`` callback function with an object that contains the ``resolvedPromisesData`` and ``rejectedPromiseData`` arrays.
