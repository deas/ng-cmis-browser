'use strict';

angular.module('documentBrowserApp')
    .controller('MainCtrl', function ($scope, $log, $http, $location, cmisService) {
        // http://127.0.0.1:9000/#/?baseUrl=http:%2F%2Flocalhost:8080%2Falfresco&alf_ticket=TICKET_8740e22092597de1e337d8190c128b6c47721d87
        // http://127.0.0.1:9000/#/?baseUrl=http://localhost:8080/alfresco?alf_ticket=lskdfj
        // https://docs.angularjs.org/guide/$location
        // var baseUrl = 'http://share.nbs.de:8080/alfresco';
        // var baseUrl = 'http://localhost:8080/alfresco';
        // var baseUrl = 'http://cmis.alfresco.com/cmisbrowser/bb212ecb-122d-47ea-b5c1-128affb9cd8f/',

        $scope.parents = [];

        $scope.breadcrumb = function (index) {
            var selected = $scope.parents[index];
            $scope.parents = $scope.parents.slice(0, index);
            $scope.openFolder(selected.path, selected.name);
        };

        $scope.openFolder = function (path, name) {
            cmisService.getChildren(path).then(function (response) {
                // $scope.nodes = response.data.objects;
                $scope.nodes = response.data.objects.sort(function(a, b) {
                    return a.object.succinctProperties['cmis:name'].localeCompare(b.object.succinctProperties['cmis:name']);
                });
                $log.log($scope.nodes);
                $scope.parents.push({
                    path: path,
                    name: name
                });
            });
        };


        var alf_ticket = $location.search().alf_ticket;
        var baseUrl = $location.search().baseUrl ? $location.search().baseUrl : 'http://127.0.0.1:8080/alfresco';
        /*
        $http.jsonp(baseUrl + '/service/xyz/startpath?callback=JSON_CALLBACK' + (alf_ticket ? ("&alf_ticket=" + alf_ticket) : "")).success(function(data){
            var name = data.startpath.split("/").pop();
            */
            cmisService.baseUrl = baseUrl + '/api/-default-/public/cmis/versions/1.1/browser/';
            cmisService.alf_ticket = alf_ticket;
        /*
            $scope.nodes = $scope.openFolder(data.startpath, name);
        });
        */
      $scope.nodes = $scope.openFolder('Sites', 'Sites');


    }).directive('cmisObject', function () {
        return {
            restrict: 'EA',
            scope: {
                properties: '=',
                clickHandler: '&clickHandler'
            },
            link: function (scope, element, attrs) {
                scope.click = function () {
                    scope.clickHandler({
                        path: scope.properties['cmis:path'],
                        name: scope.properties['cmis:name']
                    });
                };
            },
            templateUrl: 'partials/cmisObject.html'
        };
    }).filter('downloadUrl', function (cmisService) {
        return function(objectId, asAttachment) {
            var baseUrl = cmisService.getBaseUrl();
            var alf_ticket = cmisService.getAlfTicket();
            var downloadUrl = baseUrl + 'root?objectId='+ objectId +'&cmisselector=content' + (alf_ticket ? ("&alf_ticket=" + alf_ticket) : "");
            if (asAttachment){
                downloadUrl += '&download=attachment';
            }
            return downloadUrl;
        }
    });
