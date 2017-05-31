# More Sinon Chai

Extra functionality for sinon and chai.

At some point we should probably move functionality here to relevant community projects. In the meantime we need a place for this.


## API


### stub.resolves()

```js
const fn = sinon.stub();

fn.resolves('foo');

fn.then((actual) => actual.should.equal('foo'));
```


### stub.rejects()

```js
const fn = sinon.stub();

fn.rejects(new Error('bar'));

fn.catch((e) => e.message.should.equal('bar'));
```


### stub.promises()

Use this when the timing of the promise resolution matters, or when creating general, promise-returning test doubles.

```js
const fn = sinon.stub();

fn.promises();

fn.promise === fn();
```

```js
const fn = sinon.stub().promises();

fn.resolvePromise('foo');

fn.then((actual) => actual.should.equal('foo'));
```

```js
const fn = sinon.stub().promises();

fn.rejectPromise(new Error('bar'));

fn.catch((e) => e.message.should.equal('bar'));
```


### chai.should.eventuallyBeCalled()

Use this for testing that a callback is eventually called.

**Note:** Although this is more of a spy method, it can only be used on stubs due to the internals of chai.

```js
it('should call stub after some time', () => {

    const fn = sinon.stub();

    window.setTimeout(() => {
        fn('foo', 'bar');
    }, 100);

    return fn.should.eventuallyBeCalled().then(([arg1, arg2]) => {
        arg1.should.equal('foo');
        arg2.should.equal('bar');
    });

});
```
