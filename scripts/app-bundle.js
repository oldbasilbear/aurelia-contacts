define('app',["require", "exports"], function (require, exports) {
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
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('web-api',["require", "exports", 'aurelia-framework', 'aurelia-fetch-client'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    var latency = 200;
    var id = 0;
    function getId() {
        return ++id;
    }
    var WebAPI = (function () {
        function WebAPI(http) {
            this.http = http;
            this.isRequesting = false;
            this.http = http;
        }
        WebAPI.prototype.getContactList = function () {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                _this.http.fetch('http://127.0.0.1/snbportal/test/api-users.php')
                    .then(function (response) { return response.json(); })
                    .then(function (contactsAsJsonData) {
                    resolve(contactsAsJsonData);
                });
            });
        };
        WebAPI.prototype.getContactDetails = function (id) {
            var _this = this;
            this.isRequesting = true;
            return new Promise(function (resolve) {
                var formdata = {
                    'user_ID': id
                };
                _this.http.fetch('http://127.0.0.1/snbportal/test/api-users.php', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: aurelia_fetch_client_1.json(formdata)
                })
                    .then(function (response) { return response.json(); })
                    .then(function (userAsJsonData) {
                    resolve(JSON.parse(JSON.stringify(userAsJsonData)));
                });
                _this.isRequesting = false;
            });
        };
        WebAPI = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient])
        ], WebAPI);
        return WebAPI;
    }());
    exports.WebAPI = WebAPI;
});

define('messages',["require", "exports"], function (require, exports) {
    "use strict";
    var ContactUpdated = (function () {
        function ContactUpdated(contact) {
            this.contact = contact;
        }
        return ContactUpdated;
    }());
    exports.ContactUpdated = ContactUpdated;
    var ContactViewed = (function () {
        function ContactViewed(contact) {
            this.contact = contact;
        }
        return ContactViewed;
    }());
    exports.ContactViewed = ContactViewed;
});

define('utility',["require", "exports"], function (require, exports) {
    "use strict";
    function areEqual(obj1, obj2) {
        return Object.keys(obj1).every(function (key) { return obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]); });
    }
    exports.areEqual = areEqual;
    ;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('contact-detail',["require", "exports", 'aurelia-framework', 'aurelia-event-aggregator', './web-api', './messages', './utility'], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, web_api_1, messages_1, utility_1) {
    "use strict";
    var ContactDetail = (function () {
        function ContactDetail(api, ea) {
            this.api = api;
            this.ea = ea;
            var x = 1;
        }
        ContactDetail.prototype.activate = function (params, routeConfig) {
            var _this = this;
            this.routeConfig = routeConfig;
            console.log(this);
            return this.api.getContactDetails(params.id)
                .then(function (contact) {
                _this.contact = contact[0];
                _this.routeConfig.navModel.setTitle(_this.contact.user_firstname);
                _this.originalContact = JSON.parse(JSON.stringify(_this.contact));
                _this.ea.publish(new messages_1.ContactViewed(_this.contact));
                console.log(_this);
            });
        };
        Object.defineProperty(ContactDetail.prototype, "canSave", {
            get: function () {
                return this.contact.user_firstname && this.contact.user_surname && !this.api.isRequesting;
            },
            enumerable: true,
            configurable: true
        });
        ContactDetail.prototype.canDeactivate = function () {
            if (!utility_1.areEqual(this.originalContact, this.contact)) {
                var result = confirm('You have unsaved changes. Are you sure you wish to leave?');
                if (!result) {
                    this.ea.publish(new messages_1.ContactViewed(this.contact));
                }
                return result;
            }
            return true;
        };
        ContactDetail = __decorate([
            aurelia_framework_1.inject(web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator), 
            __metadata('design:paramtypes', [web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator])
        ], ContactDetail);
        return ContactDetail;
    }());
    exports.ContactDetail = ContactDetail;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('contact-list',["require", "exports", './web-api', 'aurelia-event-aggregator', './messages', 'aurelia-framework'], function (require, exports, web_api_1, aurelia_event_aggregator_1, messages_1, aurelia_framework_1) {
    "use strict";
    var ContactList = (function () {
        function ContactList(api, ea) {
            var _this = this;
            this.api = api;
            this.selectedId = 0;
            ea.subscribe(messages_1.ContactViewed, function (msg) { return _this.select(msg.contact[0]); });
            ea.subscribe(messages_1.ContactUpdated, function (msg) {
                var id = msg.contact.user_ID;
                var found = _this.contacts.find(function (x) { return x.user_ID == id; });
                Object.assign(found, msg.contact);
            });
            this.api = api;
        }
        ContactList.prototype.created = function () {
            var _this = this;
            this.api.getContactList().then(function (contacts) { return _this.contacts = contacts; });
        };
        ContactList.prototype.select = function (contact) {
            console.log('call: select ' + contact.user_firstname);
            this.selectedId = contact.user_ID;
            return true;
        };
        ContactList = __decorate([
            aurelia_framework_1.inject(web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator), 
            __metadata('design:paramtypes', [web_api_1.WebAPI, aurelia_event_aggregator_1.EventAggregator])
        ], ContactList);
        return ContactList;
    }());
    exports.ContactList = ContactList;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

define('no-selection',["require", "exports"], function (require, exports) {
    "use strict";
    var NoSelection = (function () {
        function NoSelection() {
            this.message = "Please Select a Contact.";
        }
        return NoSelection;
    }());
    exports.NoSelection = NoSelection;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('test',["require", "exports", 'aurelia-framework', './web-api', './utility'], function (require, exports, aurelia_framework_1, web_api_1, utility_1) {
    "use strict";
    var ContactDetail = (function () {
        function ContactDetail(api) {
            this.api = api;
        }
        ContactDetail.prototype.activate = function (params, routeConfig) {
            var _this = this;
            this.routeConfig = routeConfig;
            return this.api.getContactDetails(params.id).then(function (contact) {
                _this.contact = contact;
                _this.routeConfig.navModel.setTitle(_this.contact.firstName);
                _this.originalContact = JSON.parse(JSON.stringify(_this.contact));
            });
        };
        Object.defineProperty(ContactDetail.prototype, "canSave", {
            get: function () {
                return this.contact.firstName && this.contact.lastName && !this.api.isRequesting;
            },
            enumerable: true,
            configurable: true
        });
        ContactDetail.prototype.canDeactivate = function () {
            if (!utility_1.areEqual(this.originalContact, this.contact)) {
                return confirm('You have unsaved changes. Are you sure you wish to leave?');
            }
            return true;
        };
        ContactDetail = __decorate([
            aurelia_framework_1.inject(web_api_1.WebAPI), 
            __metadata('design:paramtypes', [web_api_1.WebAPI])
        ], ContactDetail);
        return ContactDetail;
    }());
    exports.ContactDetail = ContactDetail;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n  <require from=\"./contact-list\"></require>\n\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-user\"></i>\n        <span>Contacts</span>\n      </a>\n    </div>\n  </nav>\n\n  <div class=\"container\">\n    <div class=\"row\">\n      <contact-list class=\"col-md-4\"></contact-list>\n      <router-view class=\"col-md-8\"></router-view>\n    </div>\n  </div>\n</template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body { padding-top: 70px; }\n\nsection {\n  margin: 0 20px;\n}\n\na:focus {\n  outline: none;\n}\n\n.navbar-nav li.loader {\n    margin: 12px 24px 0 6px;\n}\n\n.no-selection {\n  margin: 20px;\n}\n\n.contact-list {\n  overflow-y: auto;\n  border: 1px solid #ddd;\n  padding: 10px;\n}\n\n.panel {\n  margin: 20px;\n}\n\n.button-bar {\n  right: 0;\n  left: 0;\n  bottom: 0;\n  border-top: 1px solid #ddd;\n  background: white;\n}\n\n.button-bar > button {\n  float: right;\n  margin: 20px;\n}\n\nli.list-group-item {\n  list-style: none;\n}\n\nli.list-group-item > a {\n  text-decoration: none;\n}\n\nli.list-group-item.active > a {\n  color: white;\n}\n"; });
define('text!contact-detail.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"panel panel-primary\">\n    <div class=\"panel-heading\">\n      <h3 class=\"panel-title\">Profile</h3>\n    </div>\n    <div class=\"panel-body\">\n      <form role=\"form\" class=\"form-horizontal\">\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">First Name</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"first name\" class=\"form-control\" value.bind=\"contact.user_firstname\">\n          </div>\n        </div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">Last Name</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"last name\" class=\"form-control\" value.bind=\"contact.user_surname\">\n          </div>\n        </div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">Email</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"email\" class=\"form-control\" value.bind=\"contact.user_email\">\n          </div>\n        </div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\">Phone Number</label>\n          <div class=\"col-sm-10\">\n            <input type=\"text\" placeholder=\"phone number\" class=\"form-control\" value.bind=\"contact.phoneNumber\">\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n\n  <div class=\"button-bar\">\n    <button class=\"btn btn-success\" click.delegate=\"save()\" disabled.bind=\"!canSave\">Save</button>\n  </div>\n</template>"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"contact-list\">\n    <ul class=\"list-group\">\n      <li repeat.for=\"contact of contacts\" class=\"list-group-item ${contact.user_ID === $parent.selectedId ? 'active' : ''}\">\n        <a route-href=\"route: contacts; params.bind: {id:contact.user_ID}\" click.delegate=\"$parent.select(contact)\">\n          <h4 class=\"list-group-item-heading\">${contact.user_firstname} ${contact.user_surname}</h4>\n          <p class=\"list-group-item-text\">${contact.user_email}</p>\n        </a>\n      </li>\n    </ul>\n  </div>\n</template>"; });
define('text!no-selection.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"no-selection text-center\">\n    <h2>${message}</h2>\n  </div>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map