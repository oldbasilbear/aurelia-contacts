"use strict";
var App = (function () {
    function App() {
    }
    App.prototype.configureRouter = function (config, router) {
        config.title = 'Contacts';
        config.map([
            { route: '', moduleId: 'no-selection', title: 'Select' },
            { route: 'contacts/:id', moduleId: 'contact-detail', name: 'contacts' }
        ]);
        this.router = router;
    };
    return App;
}());
exports.App = App;
