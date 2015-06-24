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
  var tmpl = $.summernote.renderer.getTemplate();
  // var editor = $.summernote.eventHandler.getEditor();

  var colors = {
    'default': '#DDD',
    'primary': '#4c6972',
    'success': '#7ac673',
    'info'   : '#27aae0',
    'warning': '#faaf40',
    'danger' : '#f97352',
    'link'   : '#000'
  };

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
      mbrBtnRemove: function () {
        return tmpl.iconButton('fa fa-trash-o', {
          event : 'mbrBtnRemove',
          title: 'Remove',
          hide: true
        });
      },
      mbrBtnAdd: function () {
        return tmpl.iconButton('fa fa-plus', {
          event : 'mbrBtnAdd',
          title: 'Add',
          hide: false
        });
      },
      mbrBtnColor: function (lang, options) {
        var items = '';
        for (var k in options.colors) {
          items += '<li><a data-event="mbrBtnColor" href="javascript:void(0);" data-value="btn-' + k + '">' +
                    '<i class="fa fa-check"></i>' +
                    '<span style="width:18px;height:18px;border-radius:10px;' +
                      'vertical-align: bottom;margin-left: 5px;' +
                      'display: inline-block;background:' + options.colors[k] + ';">' +
                    '</span>' +
                  '</a></li>';
        }

        var label = '<span class="note-current-mbrBtnColor"></span>';
        var dropdown = '<ul class="dropdown-menu note-check">' + items + '</ul>';

        return tmpl.button(label, {
          title: 'Color',
          hide: false,
          className: 'note-mbrBtnColor',
          dropdown : dropdown,
          nocaret: true
        });
      }
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

        var sibling = $editable.siblings('.btn:eq(0)');
        var parent = $editable.parent();

        $editable.destroy().remove();

        if (sibling.length) {
          editor.afterCommand(sibling);
        } else {
          if (parent.is('[data-app-edit]')) {
            // remove from mobirise core
            if (typeof window.mbrAppCore !== 'undefined') {
              window.mbrAppCore.changeCKE(parent);
            }
            parent.remove();
          }
        }
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
        $editable.after(' '); // space between buttons

        // init new button
        var options = $editable.data('options') || {};
        $newBtn.summernote(options);

        editor.afterCommand($editable);
      },
      mbrBtnColor: function (event, editor, layoutInfo, value) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // remove all color classes
        var removeClasses = '';
        for (var k in colors) {
          removeClasses += ' btn-' + k;
        }

        $editable.removeClass(removeClasses).addClass(value);
        // editor.fontSize(layoutInfo.editable(), value);

        editor.afterCommand($editable);
      }
    }
  });
}));
