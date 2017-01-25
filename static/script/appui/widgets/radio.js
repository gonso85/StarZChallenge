/**
 * Radio buttons: Only one button can be selected at once.
 *
 * @typedef {Object} RadioButtons
 */
define(
    'starz/appui/widgets/radio',
    [
        'antie/widgets/horizontallist',
        'antie/widgets/label',
        'starz/appui/widgets/button',
        'starz/utils'
    ],
    function (HorizontalList,
              Label,
              Button,
              Utils) {
        'use strict';

        /**
         * Radio buttons bar widget.
         *
         * @param {string} id - Id of the widget.
         * @param {Object} buttonsData - The data of the buttons: title and id.
         */
        return HorizontalList.extend({
            /**
             * @constructor
             * @ignore
             */
            init: function (id, buttonsData) {
                this._super(id);

                this.addClass('radio-buttons');

                this._selected = null;

                this.setButtons(buttonsData);

                this._onSelectBound = Utils.bind(this._onSelect, this);

                this.addEventListener('select', this._onSelectBound);
            },

            /**
             * Get the selected button of the widget;
             *
             * @return {Button} Selected button.
             */
            getSelectedButton: function () {
                return this._selected;
            },

            /**
             * Set the selected button of the widget;
             *
             * @param {Button|string} button - New selected button or id of the button.
             */
            setSelectedButton: function (button) {
                var buttons,
                    item,
                    i;

                if (!(button instanceof Button)) {
                    buttons = this.getChildWidgets();

                    for (i = 0; i < buttons.length; i++) {
                        item = buttons[i];

                        if (item.id === button) {
                            button = item;
                            break;
                        }
                    }
                }

                this.updateSelected(button);
            },

            /**
             * Set buttons in the widgets. The object should be composed of parameters: id, title,
             * and data (for additional data item).
             *
             * @param {Object} data - Data of the buttons.
             * @param {Object} data.id - Id of the language.
             * @param {Object} data.title - title of the button.
             *
             */
            setButtons: function (data) {
                var i = 0,
                    buttonData,
                    button;

                for (; i < data.length; i++) {
                    buttonData = data[i];

                    button = new Button(buttonData.id, buttonData.title);
                    button.addClass('radio');
                    button.setDataItem(buttonData.data);

                    this.appendChildWidget(button);
                }
            },

            /**
             * Select button handler. Update the selected button.
             *
             * @param {Event} evt - On select event.
             * @private
             */
            _onSelect: function (evt) {
                var button = evt.target;

                this.setSelectedButton(button);
            },

            /**
             * Update selected button.
             *
             * @param button
             */
            updateSelected: function (button) {

                // Update selected button
                var current = this.getSelectedButton();

                if (current !== button) {
                    current && current.removeClass('selected');
                    button.addClass('selected');
                    this._selected = button;
                }
            }
        });
    });