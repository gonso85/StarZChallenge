/**
 * Default button with label.
 *
 * @typedef {Object} Button.
 */
define('starz/appui/widgets/button',
    [
        'antie/widgets/button',
        'antie/widgets/label'
    ],
    function (Button,
              Label) {
        'use strict';

        /**
         * Movie info widget.
         */
        return Button.extend({

            /**
             * @constructor
             * @ignore
             */
            init: function (id, text) {
                var label;

                this._super(id);

                label = this._label = new Label(text);

                this.appendChildWidget(label);
            },

            /**
             * Get text of the button.
             *
             * @return {string} Text of the button.
             */
            getText: function () {
                return this._label.getText();
            },

            /**
             * Set text of the button.
             *
             * @param {string} text - Text of the button.
             */
            setText: function (text) {
                this._label.setText(text);
            }
        });
    });