(function(){
  'use strict';
  var app = angular.module('DdsServices', [])
  .factory('DDS', ['$resource', function($resource){
    var normalPrarms = {local:1, mock:1, enforce:1};
    return $resource('http://127.0.0.1:8084/:endpoint/:action', normalPrarms, {
      login:{
        method:'POST',
        params:{endpoint:'user', action:'login'}
      }
    });
  }])
  .factory('Common', ['$window', '$timeout', '$modal', function($window, $timeout, $modal){
    var ua = navigator.userAgent.toLowerCase();
    return {
      runtimeEvn: function(){
        //0开发 1测试 2生产 3其他
        var host = $window.location.host,
            path = $window.location.pathname,
            local= /^(localhost|10\.10|127\.0|192\.168)/i;
        if(window.DEBUG){
          return 0;
        }
        if(local.test(host) && /^\/d.html/.test(path)) {
          return 0;
        }
        else if(local.test(host) && (/^\//.test(path) || /^\/index.html/.test(path))){
          return 1;
        }
        else if(/github.io$/.test(host)){
          return 2;
        }
        else {
          return 3;
        }
      },
      alert: function(scope, opts){
        scope.alerts.push(opts);
        $timeout(function(){ 
          scope.alerts.pop();
        }, 5000);
      },
      validResponse: function(res){
        if (res.header.errorCode=== 0) {
          return res.data;
        }
        else{
          return null;
        }
      },
      openModal: function(opts){
        var options = angular.extend(opts, {
          templateUrl: opts.templateUrl,
          controller: 'ModalController as mc',
          resolve: opts.resolve
        });
        var modalInstance = $modal.open(options);

        modalInstance.result.then(
          function (result) {
            result();
          }, 
          function (reason) {}
        );
        modalInstance.opened.then(
          function(info){}
        );
      }
    };
  }]);
})();