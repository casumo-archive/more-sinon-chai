(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.index = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.moreSinon = moreSinon;
    exports.moreChai = moreChai;
    /**
     * Usage:
     *
     *  import _ from 'my/underscore/lib';
     *  import Promise from 'my/promise/lib';
     *  import sinon from 'sinon';
     *  import { moreSinon, moreChai } from 'moreSinonChai';
     *
     *  moreSinon(_, Promise, sinon);
     *  chai.use(moreChai(_, Promise));
     */
    function moreSinon(_, Promise, sinon) {

        /**
         * Use this to stub a promise which you can manually resolve later.
         */
        sinon.stub.promises = function () {

            let resolvePromise;
            let rejectPromise;

            const promise = new Promise((resolve, reject) => {
                resolvePromise = resolve;
                rejectPromise = reject;
            });

            return _.extend(this.returns(promise), {
                promise,
                resolvePromise,
                rejectPromise
            });
        };

        /**
         * Use this to stub a promise resolved with value.
         */
        sinon.stub.resolves = function (value) {
            return this.returns(Promise.resolve(value));
        };

        /**
         * Use this to stub a promise rejected with error.
         */
        sinon.stub.rejects = function (error) {
            return this.returns(Promise.reject(error));
        };
    }

    function moreChai(_, Promise) {

        return function (chai, utils) {

            utils.addMethod(chai.Assertion.prototype, 'eventuallyBeCalled', function () {
                // eslint-disable-next-line no-underscore-dangle
                const stub = this._obj;
                const originalInvoke = stub.defaultBehavior ? stub.defaultBehavior.invoke : _.noop;

                return new Promise(resolve => {

                    stub.defaultBehavior = _.extend(stub.defaultBehavior, {
                        invoke(context, args) {
                            resolve(_.toArray(args));
                            return originalInvoke.call(this, context, args);
                        }
                    });

                    if (stub.callCount > 0) {
                        resolve(stub.firstCall.args);
                    }
                });
            });
        };
    }
});