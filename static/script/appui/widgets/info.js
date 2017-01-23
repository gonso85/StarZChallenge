/**
 * Movie info.
 *
 * @typedef {Object} Info.
 */
define(
    'starz/appui/widgets/info',
    [
        'antie/widgets/container',
        'antie/widgets/label'
    ],
    function (Container,
              Label) {
        'use strict';

        /**
         * Movie info widget.
         */
        return Container.extend({
            /**
             * @constructor
             * @ignore
             */
            init: function (id) {
                this._super(id);

                this.addClass('info');

                this._build();
            },

            /**
             * Creation of the widgets.
             *
             * @private
             */
            _build: function () {
                var titleRow = new Container(),
                    row1 = new Container(),
                    row2 = new Container(),
                    row3 = new Container(),
                    title = this._title = new Label(),
                    year = this._year = new Label(),
                    runtime = this._runtime = new Label(),
                    genre = this._genre = new Label(),
                    rating = this._rating = new Label(),
                    plot = this._plot = new Label(),
                    language = this._language = new Label(),
                    country = this._country = new Label();

                titleRow.addClass('info-row');

                row1.addClass('info-row');
                row2.addClass('info-row');
                row3.addClass('info-row');

                title.addClass('title');
                titleRow.appendChildWidget(title);

                row1.appendChildWidget(year);
                row1.appendChildWidget(runtime);
                row1.appendChildWidget(country);

                row2.appendChildWidget(rating);
                row2.appendChildWidget(genre);
                row2.appendChildWidget(language);

                plot.addClass('plot');
                row3.appendChildWidget(plot);

                this.appendChildWidget(titleRow);
                this.appendChildWidget(row1);
                this.appendChildWidget(row2);
                this.appendChildWidget(row3);
            },

            /**
             * Set the info of the movie.
             *
             * @param {Object} data - Info provided by the API.
             */
            setData: function (data) {
                this._title.setText(data.Title || '');
                this._year.setText(data.Year || '');
                this._runtime.setText(data.Runtime || '');
                this._genre.setText(data.Genre || '');
                this._rating.setText(data.imdbRating || '');
                this._plot.setText(data.Plot || '');
                this._language.setText(data.Language || '');
                this._country.setText(data.Country || '');
            }
        });
    });