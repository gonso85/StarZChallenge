/**
 * Player manager. It returns a player instance depending on the client browser.
 *
 * @typedef {Object} PlayerManager
 */
define('starz/managers/player',
    [
        'antie/class',
        'starz/appui/players/chrome',
        'starz/appui/players/safari'
    ],
    function (
        Class,
        Chrome,
        Safari
    ) {
        'use strict';

        var NAVIGATOR = {
            CHROME: 'chrome',
            SAFARI: 'safari'
        };

        return Class.extend({
            /**
             * Constructor
             */
            init: function () {

            },

            /**
             * Get the right player: Chrome | Safari.
             *
             * @return {Object} Player for Chrome or Safari
             */
            getPlayer: function () {
                var player;

                switch(this.getBrowserName()){
                    case NAVIGATOR.CHROME:
                        player = new Chrome();
                        break;
                    case NAVIGATOR.SAFARI:
                        player = new Safari();
                        break;
                    default:
                        player = new Chrome();
                        break;
                }

                return player;
            },

            /**
             * Get the browser name. TODO Improve this.
             *
             * @return {boolean}
             */
            getBrowserName: function () {
                var isSafari = navigator.userAgent.indexOf('Safari/') != -1 &&
                    navigator.userAgent.indexOf('Chrome/') === -1 &&
                    navigator.userAgent.indexOf('Chromium/') === -1,
                    browser;

                if (isSafari) {
                    browser = isSafari ? NAVIGATOR.SAFARI : NAVIGATOR.CHROME;
                }

                return browser;
            }
        });
    });

