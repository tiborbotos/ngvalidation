'use strict';

/* TODO Should be injectable */
var constraints = {
    'LoginDto': {
        'username': {
            required: true,
            minLength: 3,
            maxLength: 10
        },
        'emailAddress': {
            required: true
        }
    }
};

/**
 * Directive for auto setup angular validations from a predefined JSON of JSR-301 validations.
 *
 * Can be applied to forms only with mandatory bean-id attribute
 */
(function () {
    angular
        .module('tiborbotos.forms.validation', [])
        .directive('jsrValidation', ['$compile', jsrValidationDirective]);

    /** @private */
    var validationMap = {
        required: 'ng-required',
        minLength: 'ng-minlength',
        maxLength: 'ng-maxlength',
        min: 'ng-min',
        max: 'ng-max',
        pattern: 'ng-pattern'
    };

    /** @private */
    function errorMessageTemplate(formName, inputName) {
        var inputPath = formName + '.' + inputName;
        return $('<div class="alert alert-danger" ' +
        'ng-hide="!' + inputPath + '.$touched || (' + inputPath + '.$touched && ' + inputPath  + '.$valid)">{{' + inputPath + '.$error | json}}</div>');
    }

    /** @private */
    function extendFormInputsWithValidationDirectives($element, $templateAttributes) {
        var beanId = $templateAttributes.beanId,
            formElements = $element.find('input[ng-model]'), // TODO extend with select, textarea
            formName = $element.attr('name'),
            validations = constraints[beanId];

        angular.forEach(formElements, function (inp) {
            var inputName = $(inp).attr('name'),
                clone,
                compiledClone;

            if (inputName && validations[inputName]) { // if there is a validation constraint apply to it
                clone = $(inp).clone();
                angular.forEach(validations[inputName], function (validation, name) {
                    clone.attr(validationMap[name], validations[inputName][name]);
                });

                $element.find(inp).replaceWith(clone);

                // append error message template
                if (clone.parent().find('.error-msg-container')) {
                    clone.parent().find('.error-msg-container').append(errorMessageTemplate(formName, inputName));
                } else {
                    clone.parent().append(errorMessageTemplate(formName, inputName));
                }
            }
        });
    }

    function jsrValidationDirective($compile) {
        return {
            restrict: 'A',
            require: ['form'],
            compile: function CompilingFunction($templateElement, $templateAttributes) {
                extendFormInputsWithValidationDirectives($templateElement, $templateAttributes);
                return function LinkingFunction($scope, $element, $attrs) {
                };
            }
        };
    }
})();
