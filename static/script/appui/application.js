require.def('starz/appui/application',
    [
        'antie/application',
        'antie/widgets/container'
    ],
    function (Application, Container) {

        return Application.extend({
            init: function (appDiv, styleDir, imgDir, callback) {
                var self;
                self = this;

                self._super(appDiv, styleDir, imgDir, callback);

                // Sets the root widget of the application to be an empty container
                self._setRootContainer = function () {
                    var container = new Container();
                    container.outputElement = appDiv;
                    self.setRootWidget(container);
                };

                this._language = 'english';
            },

            run: function () {

                // Called from run() as we need the framework to be ready beforehand.
                this._setRootContainer();

                // Create maincontainer and add simple component to it
                this.addComponentContainer("maincontainer",
                    "starz/appui/components/detail",
                    {
                        language: this._language
                    });
            },

            getLanguage: function (lang) {
                return this._language;
            },

            setLanguage: function (lang) {
                this._language = lang;
            }
        });
    }
);