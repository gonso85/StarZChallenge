/**
 * Component Detail.
 */
require.def('starz/appui/components/detail',
    [
        'antie/widgets/component',
        'starz/appui/views/detail',
        'antie/widgets/container',
        'starz/utils',
        'antie/datasource',
        'antie/devices/mediaplayer/mediaplayer',
        'antie/runtimecontext'
    ],
    function (Component,
              View,
              Container,
              Utils,
              DataSource,
              MediaPlayer,
              RuntimeContext) {

        var device = RuntimeContext.getDevice(),
            DASH_SRC = 'http://media.axprod.net/dash/ED_TTML_NEW/Clear/Manifest_sub_in.mpd',
            HLS_SRC = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d- 8899-f0f6155f6efa.m3u8';

        // All components extend Component
        return Component.extend({
            init: function () {
                var view;

                this._super('detailComponent');

                view = this._view = new View();
                this.appendChildWidget(view);

                this._top = 0;

                // Create dash player
                this._player = dashjs.MediaPlayer().create();

                // Disable player logger
                this._player.getDebug().setLogToBrowserConsole(false);

                // Create binds callbacks for lifecycle events
                this._onBeforeRenderBound = Utils.bind(this._onBeforeRender, this);
                this._onBeforeShowBound = Utils.bind(this._onBeforeShow, this);
                this._onBeforeHideBound = Utils.bind(this._onBeforeHide, this);

                // Create binds callbacks for user events
                this._onSelectBound = Utils.bind(this._onSelect, this);

                // Create binds for other issues
                this._onOMDSuccessBound = Utils.bind(this._onOMDSuccess, this);
                this._onOMDErrorBound = Utils.bind(this._onOMDError, this);
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

                  if (params.language) {

                    // Update text

                } else {
                    this._view.getLanguageSwitcher().setSelectedButton('english');
                }

                // Set non-lifecycle handlers
                this.addEventListener('select', this._onSelectBound);
            },

            /**
             * On before show handler.
             *
             * @private
             */
            _onBeforeShow: function () {
                var url = 'http://www.omdbapi.com/?t=Elephants+Dream&r=json',
                    error;

                // Focus the play button
                this._view.getPlayButton().focus();

                // Show detail sec  tion
                this._view._toggleDetailVisibility(true);

                // Hide player section
                this._view._togglePlayerWrapper(false);

                // Hide error panel
                error = this._view.getErrorLabel();
                error.addClass('display-none');

                this._view.getInfo().addClass('display-none');

                // Get movie info
                device.executeCrossDomainGet(url, {
                    onSuccess: this._onOMDSuccessBound,
                    onError: this._onOMDErrorBound
                });
            },

            /**
             * On before hide handler.
             *
             * @param {Event} evt - On before hide event.
             * @private
             */
            _onBeforeHide: function (evt) {

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
                    playerSection = this._view.getPlayerSection(),
                    videoContainer = this._view.getVideoWrapper();

                if (button.id === 'play') {

                    // Append the player
                    this._appendVideoPlayer(videoContainer);

                    // Show player section
                    this._view._togglePlayerWrapper(true);

                    // Set up the player
                    this._initVideoPlayer();

                    this._view._toggleDetailVisibility(false);

                    // Show the player and begin playback
                    this.move(playerSection.outputElement, this._onCompleteMoveBound);

                    // Focus controls
                    this._view.getPlayerSection().focus();

                } else if (button.id === 'subtitleBtn') {
                    button.toggle();

                    // Switch on/off subtitles
                    if (button.getState()) {
                        this._player.setTextTrack(0);
                    } else {
                        this._player.setTextTrack(-1);
                    }
                } else {

                    // TODO Change language if different
                }
            },

            /**
             * Success handler of OMD api call to get the movie info.
             *
             * @param {Object} response - OMD API response.
             * @private
             */
            _onOMDSuccess: function (response) {
                var info = this._view.getInfo();

                info.setData(response);

                info.removeClass('display-none');

                this.getCurrentApplication().ready();
            },

            /**
             * Error handler of OMD api call to get the movie info.
             *
             * @private
             */
            _onOMDError: function () {
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

                // Begin playback
                this._player.play();

                // Disable subtitles (only after play)
                this._player.setTextTrack(-1);
            },

            /**
             * Instantiates a dash video player and append it to the page.
             *
             * @param {Container} container - Container for the player.
             * @private
             */
            _appendVideoPlayer: function (container) {
                var playerEl = container.outputElement,
                    videoEl,
                    subsEl;

                if (playerEl && !playerEl.children.length) {
                    videoEl = device._createElement('video', 'videoPlayer', ['player']);
                    videoEl.setAttribute('controls', true);
                    device.appendChildElement(container.outputElement, videoEl);

                    // container.appendChildWidget(new Container('subtitles'));
                    subsEl = device._createElement('div', 'subtitles', ['subtitles']);
                    device.appendChildElement(container.outputElement, subsEl);
                }
            },

            /**
             * Init the dash video player.
             *
             * @private
             */
            _initVideoPlayer: function () {
                var videoTag = document.querySelector("#videoPlayer");

                // Init the player (first of all)
                this._player.initialize(videoTag, DASH_SRC, false);

                // Set subtitles layer
                this._player.attachTTMLRenderingDiv(document.querySelector("#subtitles"));

            },

            /**
             * Aligns the component based on the given item.
             *
             * @param {HTMLElement} item - The item.
             * @param {function} callback - Callback to call after animation.
             */
            move: function (item, callback) {
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