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

                this._super(id);

                this.addClass('info');

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
                data.Title && this._title.setText(data.Title);
                data.Year && this._year.setText(data.Year);
                data.Runtime && this._runtime.setText(data.Runtime);
                data.Genre && this._genre.setText(data.Genre);
                data.imdbRating && this._rating.setText(data.imdbRating);
                data.Plot && this._plot.setText(data.Plot);
                data.Language && this._language.setText(data.Language);
                data.Country && this._country.setText(data.Country);
            }
        });
    });