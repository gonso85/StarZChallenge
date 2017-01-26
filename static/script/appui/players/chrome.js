/**
 * Player for Chrome browser.
 *
 * @typedef {Object} ChromePlayer
 */
define('starz/appui/players/chrome',
    [
        'antie/class',
        'antie/runtimecontext'
    ],
    function (
        Class,
        RuntimeContext
    ) {
        'use strict';

        var device = RuntimeContext.getDevice(),
            DASH_SRC = 'http://media.axprod.net/dash/ED_TTML_NEW/Clear/Manifest_sub_in.mpd';


        return Class.extend({

            /**
             * Player constructor.
             */
            init: function () {

                // Create dash player
                this._player = dashjs.MediaPlayer().create();

                // Init the player (first of all)
                this._player.initialize();

                // Disable player logger
                this._player.getDebug().setLogToBrowserConsole(false);
            },

            /**
             * Create a video and subtitles tag.
             *
             * @param {Container} container - Widget to be appended.
             */
            createVideoPlayer: function (container) {
                var playerEl = container.outputElement,
                    videoEl,
                    subsEl;

                if (playerEl && !playerEl.children.length) {

                    // Create and add the video tag
                    videoEl = device._createElement('video', 'videoPlayer', ['player']);
                    videoEl.setAttribute('controls', true);
                    device.appendChildElement(container.outputElement, videoEl);

                    // Create and add the subtitles tag
                    subsEl = device._createElement('div', 'subtitles', ['subtitles']);
                    device.appendChildElement(container.outputElement, subsEl);

                    this._video = videoEl;
                }
            },

            /**
             * Prepare the video player.
             */
            prepare: function () {

                // Pre-load the source
                this.loadSource(DASH_SRC);

                // Set auto-play
                this._player.setAutoPlay(false);

                // Attach the video element to the dash player
                this._player.attachView(this._video);

                // Set the subtitles layer to the dash player
                this._player.attachTTMLRenderingDiv(document.querySelector("#subtitles"));
            },

            /**
             * Load video source to the player
             */
            loadSource: function () {

                this._player.attachSource(DASH_SRC);
            },

            /**
             * Playback the video.
             */
            play: function () {
                this._player.play();
            },

            /**
             * Toggle subtitles of the player.
             *
             * @param {boolean} show - True to show.
             */
            toggleSubtitles: function (show) {
                if (show) {

                    this._player.setTextTrack(0);
                } else {

                    this._player.setTextTrack(-1);
                }
            }
        });
    });
