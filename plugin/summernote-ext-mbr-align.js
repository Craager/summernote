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

  /**
   * @class plugin.mbr_btn 
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'mbrAlign',

    /** 
     * @property {Object} buttons 
     * @property {Function} buttons.hello   function to make button
     * @property {Function} buttons.helloDropdown   function to make button
     * @property {Function} buttons.helloImage   function to make button
     */
    buttons: { // buttons
      mbrAlign: function () {
        return tmpl.iconButton('fa fa-align-left', {
          event : 'mbrAlign',
          title: 'Align',
          className: 'mbrAlign',
          hide: false
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
      mbrAlign: function (event, editor, layoutInfo) {
        event.stopPropagation();
        var $editable = layoutInfo.editable();
        var style = editor.currentStyle();

        switch (style['text-align']) {
          case 'left':
          case 'start':
            editor.justifyCenter($editable);
            break;
          case 'right':
            // editor.justifyFull($editable);
            editor.justifyLeft($editable);
            break;
          case 'center':
            editor.justifyRight($editable);
            break;
          // case 'justify':
          //   editor.justifyLeft($editable);
          //   break;
        }
      }
    }
  });
}));
