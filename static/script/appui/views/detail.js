/**
 * View of the detail component.
 */
define('starz/appui/views/detail',
    [
        'antie/widgets/verticallist',
        'antie/widgets/horizontallist',
        'antie/widgets/container',
        'antie/widgets/button',
        'antie/widgets/label',
        'antie/widgets/image',
        'starz/appui/widgets/radio',
        'starz/appui/widgets/info',
        'starz/appui/widgets/binarybutton'
    ],
    function (VerticalList,
              HorizontalList,
              Container,
              Button,
              Label,
              Image,
              Radio,
              Info,
              BinaryButton) {
        'use strict';

        var LOGO_URL = 'http://mena-cdn-lb.aws.playco.com/prd-peg-data/default/images/logos/starz/starzplay.svg',
            BANNER_URL = './static/img/landscape.jpeg',
            POSTER_URL = './static/img/poster.jpeg';

        /**
         * Radio buttons bar widget.
         *
         * @param {string} id - Id of the widget.
         * @param {Object} buttonsData - The data of the buttons: title and id.
         */
        return VerticalList.extend({

            /**
             * @constructor
             * @ignore
             */
            init: function () {
                var top,
                    helper,
                    banner,
                    logo,
                    center,
                    error,
                    movie,
                    poster,
                    languageSwitch,
                    movieInfo,
                    playerWrapper,
                    playBtn,
                    videoContainer,
                    buttonBar;

                this._super('detailView');

                this.addClass('view');

                // TOP PANEL
                helper = new Label('');
                helper.addClass('helper');
                logo = new Image('logo', LOGO_URL);
                logo.addClass('logo');
                banner = new Image('banner', BANNER_URL);
                banner.addClass('banner');

                top = new Container('top');
                top.addClass('top');
                top.appendChildWidget(helper);
                top.appendChildWidget(logo);
                top.appendChildWidget(banner);

                // CENTER PANEL
                languageSwitch = this._language = this._createRadioButtons();
                poster = new Image('poster', POSTER_URL);
                poster.addClass('poster');
                movieInfo = this._info = new Info();

                movie = new Container('movie');
                movie.addClass('movie');
                movie.appendChildWidget(poster);
                movie.appendChildWidget(movieInfo);

                error = this._error = new Label('error');
                error.addClass('error');

                center = this._center = new Container('content');
                center.addClass('content');
                center.appendChildWidget(movie);
                center.appendChildWidget(languageSwitch);

                // PLAY BUTTON
                playBtn = this._playBtn = new Button('play');
                playBtn.addClass('play');
                playBtn.appendChildWidget(new Label('WATCH NOW'));

                // PLAYER
                buttonBar = this._createButtonBar();

                videoContainer = this._videoContainer = new Container('videoContainer');
                videoContainer.addClass('video-container');

                playerWrapper = this._playerWrapper = new Container('playerWrapper');
                playerWrapper.addClass('player-wrapper');
                playerWrapper.appendChildWidget(videoContainer);
                playerWrapper.appendChildWidget(buttonBar);

                this.appendChildWidget(top);
                this.appendChildWidget(error);
                this.appendChildWidget(center);
                this.appendChildWidget(playBtn);
                this.appendChildWidget(playerWrapper);
            },

            /**
             * Get info widget.
             *
             * @return {Info} Info widget.
             */
            getInfo: function () {
                return this._info;
            },

            /**
             * Get language switcher.
             *
             * @return {Radio} Language widget.
             */
            getLanguageSwitcher: function () {
                return this._language;
            },

            /**
             * Get play button.
             *
             * @return {Button} Play button.
             */
            getPlayButton: function () {
                return this._playBtn;
            },

            /**
             * Get player wrapper.
             *
             * @return {Container} Player section.
             */
            getPlayerSection: function () {
                return this._playerWrapper;
            },

            /**
             * Get video wrapper.
             *
             * @return {Container} Video container.
             */
            getVideoWrapper: function () {
                return this._videoContainer;
            },

            /**
             * Get error label.
             *
             * @return {Label} Error widget.
             */
            getErrorLabel: function () {
                return this._error;
            },

            /**
             * Get center panel.
             *
             * @return {Container} Center panel.
             */
            getCenterPanel: function () {
                return this._center;
            },

            /**
             * Create a radio buttons widgets for the language switcher.
             *
             * @return {RadioButtons} Buttons for language change.
             * @private
             */
            _createRadioButtons: function () {
                var switcher = new Radio('language', [
                    {
                        id: 'english',
                        title: 'English'
                    }, {
                        id: 'arabic',
                        title: 'Arabic'
                    }]);

                switcher.addClass('language');

                return switcher;
            },

            /**
             * Create a buttons bar for the player.
             *
             * @return {HorizontalList} Control buttons for the player.
             * @private
             */
            _createButtonBar: function () {
                var bar = new HorizontalList(),
                    button = new BinaryButton('subtitleBtn', 'Subtitles', false);

                button.addClass('subtitles');

                bar.addClass('button-bar');
                bar.appendChildWidget(button);

                return bar;
            },

            /**
             * Toggle visibility of the detail section.
             *
             * @param {Boolean} show - True to show the section.
             * @private
             */
            _toggleDetailVisibility: function (show) {
                if (show) {
                    this._center.removeClass('visibility-hidden');
                } else {
                    this._center.addClass('visibility-hidden');
                }
            },

            /**
             * Toggle player section.
             *
             * @param {Boolean} show - True to show the player section.
             * @private
             */
            _togglePlayerWrapper: function (show) {
                if (show) {
                    this._playerWrapper.removeClass('display-none');
                } else {
                    this._playerWrapper.addClass('display-none');
                }
            }
        });
    });


