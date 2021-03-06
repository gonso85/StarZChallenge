/**
 * Component Detail.
 */
require.def('starz/appui/components/detail',
    [
        'antie/widgets/component',
        'starz/appui/views/detail',
        'antie/widgets/container',
        'starz/utils',
        'starz/managers/language',
        'starz/managers/player',
        'antie/runtimecontext'
    ],
    function (Component,
              View,
              Container,
              Utils,
              LanguageManager,
              PlayerManager,
              RuntimeContext) {

        var app = RuntimeContext.getCurrentApplication(),
            device = RuntimeContext.getDevice(),
            INFO_URL = 'http://www.omdbapi.com/?t=Elephants+Dream&r=json',
            videoUrl;

        // All components extend Component
        return Component.extend({
            init: function () {
                var view;

                this._super('detailComponent');

                view = this._view = new View();
                this.appendChildWidget(view);

                this._firstLoad = true;
                this._top = 0;

                // Get the player by browser
                this._player = new PlayerManager().getPlayer();

                // Create binds callbacks for lifecycle events
                this._onBeforeRenderBound = Utils.bind(this._onBeforeRender, this);
                this._onBeforeShowBound = Utils.bind(this._onBeforeShow, this);
                this._onBeforeHideBound = Utils.bind(this._onBeforeHide, this);

                // Create binds callbacks for user events
                this._onSelectBound = Utils.bind(this._onSelect, this);

                // Create binds for other issues
                this._onMovieDataSuccessBound = Utils.bind(this._onMovieDataSuccess, this);
                this._onMovieDataErrorBound = Utils.bind(this._onMovieDataError, this);
                this._onCompleteMoveBound = Utils.bind(this._onCompleteMove, this);

                // Add listeners for the lifecycle events
                this.addEventListener('beforerender', this._onBeforeRenderBound);
                this.addEventListener('beforeshow', this._onBeforeShowBound);
                this.addEventListener('beforehide', this._onBeforeHideBound);
            },

            /**
             * On before render handler.
             *
             * @param {Event} evt - On before render event.
             * @private
             */
            _onBeforeRender: function (evt) {
                var params = evt.args || {};

                this._language = params.language || 'english';

                // Set default selected language
                this._view.getLanguageSwitcher().setSelectedButton(this._language);

                // Set non-lifecycle handlers
                this.addEventListener('select', this._onSelectBound);
            },

            /**
             * On before show handler.
             *
             * @private
             */
            _onBeforeShow: function () {
                var error;

                this._view._toggleOverlay(true);

                // Focus the play button
                this._view.getPlayButton().focus();

                // Show detail section
                this._view._toggleDetailVisibility(true);

                // Hide player section
                this._view._togglePlayerWrapper(false);

                // Set up the player
                this._prepareVideoPlayer();

                // Hide error panel
                error = this._view.getErrorLabel();
                error.addClass('display-none');

                // Hide info panel util load
                this._view.getInfo().addClass('display-none');

                // Get movie info
                device.executeCrossDomainGet(INFO_URL, {
                    onSuccess: this._onMovieDataSuccessBound,
                    onError: this._onMovieDataErrorBound
                });
            },

            /**
             * On before hide handler.
             *
             * @private
             */
            _onBeforeHide: function () {

                this.removeEventListener('select', this._onSelectBound);
            },

            /**
             * On select handler.
             *
             * @param {Event} evt - On select event.
             * @private
             */
            _onSelect: function (evt) {
                var button = evt.target,
                    id = button.id,
                    playerSection = this._view.getPlayerSection();

                switch(id) {
                    case 'play':

                        // Show player section
                        this._view._togglePlayerWrapper(true);

                        // Show the player and begin playback
                        this._move(playerSection.outputElement, this._onCompleteMoveBound);

                        // Focus controls
                        this._view.getPlayerSection().focus();
                        break;

                    case 'subtitleBtn':

                        // Toggle ON/OFF
                        button.toggle();

                        // Switch on/off subtitles
                        this._player.toggleSubtitles(button.getState());
                        break;

                    case 'stopBtn':

                        // Reset the view
                        this._resetView();

                        // Reset the player
                        this._player.loadSource(videoUrl);
                        break;

                    case 'english':
                    case 'arabic':

                        // Reload to change language
                        if (id !== app.getLanguage()) {
                            app.setLanguage(id);

                            app.pushComponent('maincontainer',
                                'starz/appui/components/detail',
                                { language: id});
                        }
                        break;
                }
            },

            /**
             * Success handler of OMD api call to get the movie info.
             *
             * @param {Object} response - OMD API response.
             * @private
             */
            _onMovieDataSuccess: function (response) {
                var info = this._view.getInfo();

                // Set data of the movie
                info.setData(response);
                info.removeClass('display-none');

                // Remove splash screen
                if (this._firstLoad) {
                    this.getCurrentApplication().ready();
                    this._firstLoad = false;
                }

                // Translate if needed
                this._updateLanguage(this._language);

                // Hide loading overlay
                this._view._toggleOverlay(false);

            },

            /**
             * Error handler of OMD api call to get the movie info.
             *
             * @private
             */
            _onMovieDataError: function () {
                var center = this._view.getCenterPanel(),
                    error = this._view.getErrorLabel();

                center.addClass('display-none');

                // Show error panel
                error.setText('Houston, we\'ve got a problem!');
                error.removeClass('display-none');

                this.getCurrentApplication().ready();
            },

            /**
             * On complete animation complete handler.
             *
             * @private
             */
            _onCompleteMove: function () {

                // Hide detail section
                this._view._toggleDetailVisibility(false);

                // Begin playback
                this._player.play();

                // Disable subtitles (only after play)
                this._player.toggleSubtitles(false);
            },

            /**
             * Append the player to the page.
             *
             * @param {Container} container - Container for the player.
             * @private
             */
            _appendVideoPlayer: function (container) {

                return this._player.createVideoPlayer(container);
            },

            /**
             * Init the video player.
             *
             * @private
             */
            _prepareVideoPlayer: function () {
                var videoContainer = this._view.getVideoWrapper();

                // Append the player
                this._appendVideoPlayer(videoContainer);

                // Prepare video player
                this._player.prepare();
            },

            /**
             * Request translations and update the language on the app.
             *
             * @param {string} lang - Selected language: english|arabic
             * @private
             */
            _updateLanguage: function (lang) {
                var path = LanguageManager.getTranslationsPath(lang);

                if (lang === 'arabic') {
                    this._view.addClass('arabic');
                } else {
                    this._view.removeClass('arabic');
                }

                device.loadURL(path, {
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    onLoad: Utils.bind(this._onGetTranslationsSuccess, this)
                });
            },

            /**
             * Handler for getting local translations.
             *
             * @param {string} response - Translations.
             * @private
             */
            _onGetTranslationsSuccess: function (response) {

                this._translate(device.decodeJson(response));
            },

            /**
             * Translate texts of the page.
             *
             * @param {string} translations - Response of the call to resources.
             * @private
             */
            _translate: function (translations) {
                var view = this._view,
                    langButtons;

                view.getInfo().setData(translations);
                view.getPlayButton().setText(translations.watch_now);
                view.getStopButton().setText(translations.stop);
                view.getSubtitleButton().setText(translations.subtitles);

                langButtons = view.getLanguageSwitcher().getChildWidgets();
                langButtons[0].setText(translations.Language);
                langButtons[1].setText(translations.arabic);
            },

            /**
             * Reset the view.
             *
             * @private
             */
            _resetView: function () {
                this._view._toggleDetailVisibility(true);
                this._view._togglePlayerWrapper(false);
                this._view.getPlayButton().focus();
                this._view.moveTo({
                    el: this._view.outputElement,
                    to: {
                        top: 0
                    }
                });
                this._top = 0;
            },

            /**
             * Aligns the component based on the given item.
             *
             * @param {HTMLElement} item - The item.
             * @param {function} callback - Callback to call after animation.
             */
            _move: function (item, callback) {
                var dimensions,
                    listTop = this._top || 0,
                    perfectTop,
                    difference,
                    newTop;

                dimensions = item.getBoundingClientRect();
                perfectTop = (720 - dimensions.height) / 2;
                difference = dimensions.top - perfectTop;

                if (difference > 0) {
                    newTop = listTop - difference;
                } else {

                    newTop = listTop + -difference;
                }

                if (Math.abs(difference) < 1) {

                    /*
                     * If the difference is very small,
                     * we want to ignore the new alignment.
                     */
                    return;
                }

                if (newTop > 0) {
                    newTop = 0;
                }

                this._view.moveTo({
                    el: this._view.outputElement,
                    onComplete: callback,
                    to: {
                        top: newTop
                    }
                });

                this._top = newTop;
            }
        });
    }
);
