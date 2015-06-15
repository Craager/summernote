(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals: jQuery
    factory(window.jQuery);
  }
}(function ($) {
  // template
  // var tmpl = $.summernote.renderer.getTemplate();
  // var editor = $.summernote.eventHandler.getEditor();

  var colors = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'];

  // capitalize first letter in string
  // usage: 'string'.capitalizeFirstLetter();
  // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
  if (typeof String.prototype.capitalizeFirstLetter === 'undefined') {
    String.prototype.capitalizeFirstLetter = function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    };
  }

  /**
   * @class plugin.mbr_btn 
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'mbrBtn',

    /* Options */
    options: {
      colors: colors
    },

    /** 
     * @property {Object} buttons 
     * @property {Function} buttons.hello   function to make button
     * @property {Function} buttons.helloDropdown   function to make button
     * @property {Function} buttons.helloImage   function to make button
     */
    buttons: { // buttons
      // mbrBtnRemove: function () {
      //   return tmpl.iconButton('fa fa-trash-o', {
      //     event : 'mbrBtnRemove',
      //     title: 'Remove',
      //     hide: true
      //   });
      // },
      // mbrBtnAdd: function () {
      //   return tmpl.iconButton('fa fa-plus', {
      //     event : 'mbrBtnAdd',
      //     title: 'Add',
      //     hide: true
      //   });
      // },
      // mbrBtnColor: function (lang, options) {
      //   var items = options.colors.reduce(function (memo, v) {
      //     return memo + '<li><a data-event="mbrBtnColor" href="javascript:void(0);" data-value="btn-' + v + '">' +
      //                     '<i class="fa fa-check"></i> ' + v.capitalizeFirstLetter() +
      //                   '</a></li>';
      //   }, '');

      //   var label = '<span class="note-current-mbrBtnColor">Primary</span>';
      //   var dropdown = '<ul class="dropdown-menu note-check">' + items + '</ul>';

      //   return tmpl.button(label, {
      //     title: 'Color',
      //     hide: true,
      //     dropdown : dropdown
      //   });
      // }
    },

    /**
     * @property {Object} events 
     * @property {Function} events.hello  run function when button that has a 'hello' event name  fires click
     * @property {Function} events.helloDropdown run function when button that has a 'helloDropdown' event name  fires click
     * @property {Function} events.helloImage run function when button that has a 'helloImage' event name  fires click
     */
    events: { // events
      mbrBtnRemove: function (event, editor, layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();
        // var text = getTextOnRange($editable) || 'Button';

        $editable.destroy().remove();
      },
      mbrBtnAdd: function (event, editor, layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // clone current button
        var $newBtn = $editable.clone();

        // remove all classes and attributes from cloned button
        $newBtn
          .removeClass('summernote-air note-air-editor note-editable')
          .removeAttr('id contenteditable');

        // insert clone after current button
        $editable.after($newBtn);

        // init new button
        $newBtn.summernote({
          airMode: true
        });
      },
      mbrBtnColor: function (event, editor, layoutInfo, value) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        console.log(layoutInfo);

        // remove all color classes
        var removeClasses = '';
        for (var k in colors) {
          removeClasses += ' btn-' + colors[k];
        }

        $editable.removeClass(removeClasses).addClass(value);
        // editor.fontSize(layoutInfo.editable(), value);
      }
    }
  });
}));
