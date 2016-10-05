"use strict";

var app = angular.module('emailsApp', ['emailsEditor']);

app.controller('mailsCtrl', ['$scope', function($scope) {
    $scope.mails = ['sidorov@mail.ru'];
    $scope.delimiters = [',', '\n'];
    
    function generateRandomString() {
        var lengthPrefix = Math.floor(Math.random() * 5 + 2);
        var lengthPostfix = Math.floor(Math.random() * 5 + 2);
        return Math.random().toString(36).substring(2, lengthPrefix) + '@' + Math.random().toString(36).substring(2, lengthPostfix) + '.ru';
    }
    
    $scope.addEmails = function() {
        $scope.mails.push(generateRandomString());   
    };
    
    $scope.getEmailsCount = function() {
        alert($scope.mails.length + ' mails');
    };
}]);
