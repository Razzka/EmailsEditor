angular.module('emailsEditor', [])
    .controller('tokenCtrl', ['$scope', function($scope) {
        $scope.validEmail = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        };
    }])
    .controller('emailsEditorCtrl', ['$scope', '$element', '$timeout', function($scope, $element, $timeout) {
        $scope.deleteMail = function(index) {
            $scope.mails.splice(index, 1);
            $timeout(checkAreaWidth, 50);
        };
        
        $scope.parseMails = function(text) {
            if (!text) {
                return;
            }
            
            var newTokens = text.trim();
            
            var regexp = new RegExp($scope.delimiters.join('|'));
            var tokens = newTokens.split(regexp);
            
            angular.forEach(tokens, function(token) {
                if (!!token) {
                    $scope.mails.push(token);
                }
            });
            
            $scope.mailsInput = '';
        };
        
        function checkAreaWidth() {
            var $area = angular.element($element[0].getElementsByClassName("token-input-area"));
            
            var emailsEditorTagsWidth = $element[0].getElementsByClassName("emails-editor-tags")[0].offsetWidth;
            var tokenWrapperWidth = $element[0].getElementsByClassName("token-wrapper")[0].offsetWidth;
            var spanWidth = $element[0].getElementsByClassName("hidden-span")[0].offsetWidth;
            
            if (spanWidth > emailsEditorTagsWidth - tokenWrapperWidth - 25) {
                $area.addClass('width-100');
            } else {
                $area.removeClass('width-100');
            }
        }
        
        $scope.$watch('mailsInput', function(newValue) {
            if (!newValue) {
                return;
            }
            
            checkAreaWidth();
            
            var contains = false;
            angular.forEach($scope.delimiters, function(delimiter) {
                contains = contains || newValue.indexOf(delimiter) !== -1;
            });
            
            if (contains) {
                $scope.parseMails(newValue);
            }
        });
        
        $scope.focusArea = function() {
            $scope.focusInput = true;
        };
        
        $scope.areaBlured = function() {
            $scope.parseMails($scope.mailsInput); 
        };
        
        $scope.pasteMails = function() {
            $timeout(function() {
                $scope.parseMails($scope.mailsInput);
            }, 50);
        }
    }])
    .directive('token', function() {
        return {
            controller: 'tokenCtrl',
            scope: {
              mail: '=',
              'delete': '&'
            },
            restrict: 'E',
            replace: true,
            template: "<div class='token' ng-click=\"$event.stopPropagation();\" ng-class=\"{ 'token-valid': validEmail(mail) }\">" + 
                          "<div class='token-mail-text tk-myriad-pro' tooltip='{{mail}}'>{{mail}}</div>" + 
                          "<div class='token-cross' ng-click='delete()'>×</div>" + 
                      "</div>"
        };
    }).directive('emailsEditor', function() {
        return {
            controller: 'emailsEditorCtrl',
            scope: {
                mails: '=',
                delimiters: '='
            },
            restrict: 'E',
            replace: true,
            template: 
                '<div class="emails-editor">' +
                    '<div class="emails-editor-tags" ng-click="focusArea()">' +
                        '<div class="token-wrapper"><token ng-repeat="mail in mails track by $index" mail="mail" delete="deleteMail($index)"></token></div>' +
                        '<textarea class="token-input-area token-input-area-font tk-myriad-pro" ng-model="mailsInput" rows="2" ng-trim="false" placeholder="add more people..." ' + 
                            'focus-me="focusInput" ng-paste="pasteMails()" ng-blur="areaBlured()"></textarea>' +
                        '<span class="hidden-span token-input-area-font tk-myriad-pro">{{mailsInput}}</span>' +
                    '</div>' +
                '</div>'
        };
    }).directive('focusMe', function() {
        return {
            scope: { trigger: '=focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === true) { 
                        element[0].focus();
                        scope.trigger = false;
                    }
                });
            }
        };
    });
