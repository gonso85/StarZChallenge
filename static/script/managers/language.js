/**
 * Language manager.
 *
 * @typedef {Object} LanguageManager
 */
define('starz/managers/language', [],
    function () {
        'use strict';

        var LANGUAGES = {
                ARABIC: 'arabic',
                ENGLISH: 'english'
            };

        return {

            /**
             * Get the path to the translations file of a language given.
             *
             * @param {string} lang - Id of the language.
             * @return {string} Path to the file.
             */
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

