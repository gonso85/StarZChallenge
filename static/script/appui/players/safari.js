/**
 * Player for Safari browser.
 *
 * @typedef {Object} SafariPlayer
 */
define('starz/appui/players/safari',
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
            HLS_SRC = 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8';

        return Class.extend({

            /**
             * Player constructor.
             */
            init: function () {

            },

            /**
             * Create a video and subtitles tag.
             *
             * @param {Container} container - Widget to be appended.
             */
            createVideoPlayer: function (container) {
                var playerEl = container.outputElement,
                    videoEl;

                if (playerEl && !playerEl.children.length) {

                    // Create and add the video tag
                    videoEl = device._createElement('video', 'videoPlayer', ['player']);
                    videoEl.setAttribute('controls', true);

                    device.appendChildElement(container.outputElement, videoEl);
                }

                this._video = videoEl;
            },

            /**
             * Prepare the video player.
             */
            prepare: function () {
                this.loadSource(HLS_SRC);
            },

            /**
             * Load video source to the player
             */
            loadSource: function () {
                var source = device._createElement('source');

                source.setAttribute('src', HLS_SRC);
                device.appendChildElement(this._video, source);

                this._video.load();
            },

            /**
             * Playback the video.
             */
            play: function () {
                this._video.play();
            },

            /**
             * Toggle subtitles of the player.
             *
             * @param {boolean} show - True to show.
             */
            toggleSubtitles: function (show) {
                var tracks = this._video.textTracks;
                var track = tracks[0];

                if (show) {
                    track.mode = 'visible';
                } else {

                    track.mode = 'hidden';
                }
            }
        });
    });
