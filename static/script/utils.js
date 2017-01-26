define('starz/utils', [], function () {
    'use strict';

    var nBind = Function.prototype.bind,
        proArr = Array.prototype,
        slice = proArr.slice,
        Utils = {

            /**
             * Bind shim, will delegate to native bind if supported.
             *
             * @param  {Function}   func        target function
             * @param  {*}          thisArg     'this' to bind
             * @param  {...*}       [params]    params that you want to bind
             * @returns {Function}               bound function
             */
            bind: function (func, thisArg) {
                var args,
                    bound,
                    fcon;

                // native bind
                if (nBind && func.bind === nBind) {
                    return nBind.apply(func, slice.call(arguments, 1));
                }

                // check of fist func is a function
                if (!Utils.isFunction(func)) {
                    throw new TypeError();
                }

                // arguments that we want to bind
                args = slice.call(arguments, 2);
                fcon = function () {
                };

                // bound function
                bound = function () {
                    var self = this instanceof fcon && thisArg ? this : thisArg;

                    return func.apply(self, args.concat(slice.call(arguments)));
                };

                // bound constructor
                fcon.prototype = func.prototype;
                bound.prototype = new fcon();
                return bound;
            }
        };

    return Utils;
});
