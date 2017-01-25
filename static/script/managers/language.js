/**
 * Language manager.
 *
 * @typedef {Object} LanguageManager
 */
define('starz/managers/language',
    [
        'antie/runtimecontext'
    ],
    function (RuntimeContext) {
        'use strict';

        var LANGUAGES = {
                ARABIC: 'arabic',
                ENGLISH: 'english'
            };

        /**
         * Movie info widget.
         */
        return {

            getTranslationsPath: function (lang) {
                var translations;

                switch (lang) {
                    case LANGUAGES.ARABIC:
                        translations = './static/loc/arabic.json';
                        break;
                    case LANGUAGES.ENGLISH:
                        translations = './static/loc/english.json';
                        break;
                }

                return translations;
            }
        };
    });

