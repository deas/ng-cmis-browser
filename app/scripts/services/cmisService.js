'use strict';

angular.module('documentBrowserApp').factory('cmisService', function ($http) {
    this.baseUrl = null;
    this.alf_ticket = null;
    return {

        getChildren: function (path) {
            var u = this.baseUrl + 'root/' + path + '?cmisselector=children&succinct=true&callback=JSON_CALLBACK' + (this.alf_ticket ? ("&alf_ticket=" + this.alf_ticket) : "");
            console.log(u);
            return $http.jsonp(u);
        },

        getBaseUrl : function(){
            return this.baseUrl;
        },
        getAlfTicket : function(){
            return this.alf_ticket;
        }

    };
});
