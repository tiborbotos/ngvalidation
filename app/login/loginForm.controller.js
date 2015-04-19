'use strict';

angular
    .module('myApp')
    .controller('LoginController', [function () {
        this.data = {
            username: ''
        };

        this.onLogin = function () {
            console.log('OnLogin!', this.data);
        }
    }]);
