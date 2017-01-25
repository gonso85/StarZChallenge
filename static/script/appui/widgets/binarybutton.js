/**
 * Binary button: ON/OFF button.
 * False by default if defValue parameter is not set.
 *
 * @typedef {Object} BinaryButton.
 */
define(
    'starz/appui/widgets/binarybutton',
    [
        'starz/appui/widgets/button',
        'antie/widgets/label'
    ],
    function (Button,
              Label) {
        'use strict';

        var STATES = {
            ON: 'ON',
            OFF: 'OFF'
        };

        /**
         * Movie info widget.
         */
        return Button.extend({
            /**
             * @constructor
             * @ignore
             */
            init: function (id, text, defValue) {
                var binary;

                this._super(id, text);
                this.addClass('binary');

                this._state = false;

                binary = this._binary = new Label();
                binary.addClass('state');

                this.appendChildWidget(binary);

                if (defValue !== undefined) {
                    this.toggleTo(defValue);
                }
            },

            /**
             * Get state of the button.
             *
             * @return {boolean} True if the button is on.
             */
            getState: function () {
                return this._state;
            },

            /**
             * Creation of the widgets.
             *
             * @private
             */
            toggle: function () {
                this.toggleTo(!this._state);
            },

            /**
             * Set the info of the movie.
             *
             * @param {boolean} state - True to switch on.
             */
            toggleTo: function (state) {
                this._state = state;

                if (state) {
                    this._binary.setText(STATES.ON);
                } else {
                    this._binary.setText(STATES.OFF);
                }
            }
        });
    });