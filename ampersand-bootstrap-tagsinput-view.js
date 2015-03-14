/*global window, document*/
var State      = require('ampersand-state');
var SelectView = require('ampersand-select-view');
var matches    = require('matches-selector');
var $          = window.$ || require('jquery'); //use $ if exists, else load dep.
var TagsInput  = require('./node_modules/bootstrap-tagsinput/dist/bootstrap-tagsinput');
TagsInput = TagsInput; //ignore JSHint defined/!used

// Private Helpers:
function newArray() { return []; }
function newObject() { return {}; }
function newFunction() { return function () {}; }
function createOption (value, text) {
  var option = document.createElement('option');

  if (text === null && text === undefined) {
    return;
  }
  if (text === null || text === undefined) {
    text = value;
  }

  option.value = value;
  option.textContent = text;

  return option;
}

////////////////////////////////////////////////////////////////////////////////

module.exports = State.extend(SelectView, {
  props: {
    name:                 [ 'string', true, 'tags'          ],
    label:                [ 'string', true, 'Tags'          ],
    message:              [ 'string', true, ''              ],
    placeholder:          [ 'string', true, 'tags'          ],
    validClass:           [ 'string', true, 'input-valid'   ],
    invalidClass:         [ 'string', true, 'input-invalid' ],
    tests:                [ 'array',  true, newArray        ],
    options:              [ 'array',  true, newArray        ],
    type:                 [ 'string', true, 'file'          ],
    preRenderTagsinputCb: [ 'any',    true, newFunction     ],
    tagsinputOptions:     [ 'object', true, newObject       ],
    template:             'string',
    requiredMessage:      'any', //
    unselectedText:       'any', // these are any so a function returning a string can be passed
    value:                'any'  //
  },
  // events:  {},
  initialize: function (spec) {
    $.extend(this, spec);

    if (typeof spec.template === 'undefined') {
      this.template = '<label class="select">'+
                        '<span data-hook="label"></span>'+
                        '<select multiple name="' + this.name + '" placeholder="' + this.placeholder + '"></select>'+
                        '<span data-hook="message-container" class="message message-below message-error">'+
                          '<p data-hook="message-text"></p>'+
                        '</span>'+
                      '</label>';
    }

    //
    this.valid = true;
  },
  render: function () {
    var label;

    if (this.rendered) {
      return;
    }

    if (!this.el) {
      this.el = $(this.template)[0];
    }

    label = this.el.querySelector('[data-hook~=label]');
    if (label) {
      label.textContent = this.label;
    }

    this.formField = this.template.indexOf('select') > -1 ? this.el.querySelector('select') : this.el.querySelector('input');
    if (matches(this.el, 'select') || matches(this.el, 'input')) {
      this.formField = this.el;
    }

    this.bindDOMEvents();
    this.renderOptions();
    this.updateSelectedOption();

    if (this.options.isCollection) {
      this.options.on('add', function () {
        this.renderOptions();
        this.updateSelectedOption();
      }.bind(this));
    }

    this.rendered = true;

    //run [tagsinput initialization] prerequisites
    this.preRenderTagsinputCb();
    //setup tagsinput
    $(this.formField).tagsinput(this.tagsinputOptions);

    $(this.formField)
      .on('focus.tagsinput', this.handleFocusElm)
      .on('blur.tagsinput', this.handleBlurElm);
  },
  beforeSubmit: function () {
    this.shouldValidate = true;
    if (!this.valid) { // && !this.requiredMet) {
      this.message = this.requiredMessage || this.getRequiredMessage();
    }
  },

  // Helper Methods:

  bindDOMEvents: function () {
    var events, eventNameIndex, eventName, selector;

    if (typeof this.events !== 'undefined') {
      events = Object.keys(this.events);
      for (var i = 0; i < events.length; i++) {
        eventNameIndex = events[i].indexOf(' ');
        eventName = events[i].substr(0, eventNameIndex); //get chars up to first space
        selector = events[i].substr(eventNameIndex + 1); //get chars after first space
        this.el.querySelector(selector).addEventListener(
          eventName,
          this[this.events[events[i]]],
          false
        );
      }
    }
  },
  renderOptions: function () {
    if (!this.formField) {
      return;
    }
    this.formField.innerHTML = '';

    // Add <option>(s):
    //unselectedText
    if (this.unselectedText !== null && this.unselectedText !== undefined) {
      this.formField.appendChild(
        createOption(
          this.unselectedText
        )
      );
    }
    //value
    if (this.value !== null && this.value !== undefined) {
      this.formField.appendChild(
        createOption(
          this.value
        )
      );
    }
    //options
    this.options.forEach(function (option) {
      this.formField.appendChild(createOption(
        this.getOptionValue(option),
        this.getOptionText(option)
      ));
    }.bind(this));
  },
  getOptionValue: function (option) {
    if (Array.isArray(option)) {
      return option[0];
    }
    if (this.options.isCollection) {
      if (this.idAttribute && option[this.idAttribute]) {
        return option[this.idAttribute];
      }
    }

    return option;
  },
  getOptionText: function (option) {
    if (Array.isArray(option)) {
      return option[1];
    }
    if (this.options.isCollection) {
      if (this.textAttribute && option[this.textAttribute]) {
        return option[this.textAttribute];
      }
    }

    return option;
  },
  updateSelectedOption: function () {
    var lookupValue = this.value;

    if (!this.formField) {
      return;
    }

    if (!lookupValue) {
      this.formField.selectedIndex = 0;
      return;
    }

    //Pull out the id if it's a model
    if (this.options.isCollection && this.yieldModel) {
      lookupValue = lookupValue && lookupValue[this.idAttribute];
    }

    if (lookupValue) {
      for (var i = this.formField.options.length; i--; i) {
        if (this.formField.options[i].value === lookupValue.toString()) {
          this.formField.selectedIndex = i;
          return;
        }
      }
    }

    //If failed to match any
    this.formField.selectedIndex = 0;
  },
  handleFocusElm: function () {
    $('.bootstrap-tagsinput').addClass('focused');
  },
  handleBlurElm: function () {
    $('.bootstrap-tagsinput').removeClass('focused');
  },
  remove: function() {
    SelectView.prototype.remove.apply(this, arguments);
  }
});
