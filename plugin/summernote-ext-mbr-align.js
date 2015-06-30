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

  // return ancestor to accept font styles
  function getAncestor(ancestors) {
    var item;

    // check if some of alloved tags
    for (var k in ancestors) {
      if (/P|DIV|UL|H1|H2|H3|H4|H5|H6/g.test(ancestors[k].tagName)) {
        item = ancestors[k];
        continue;
      }
    }

    // check if button
    if (!item) {
      var $parent = $(ancestors[0]).parent();
      if ($parent.hasClass('btn')) {
        item = $parent[0];
      }
    }

    return item;
  }

  function changeProps(item, prop, value) {
    var result = {};
    result[prop] = value;
    var id = $(item).parents('[data-app-component-id]:eq(0)').attr('data-app-component-id');
    var tag = $(item).hasClass('btn') ? '.btn' : $(item).prop('tagName');
    window.mbrAppCore.addComponentStyles(id, tag, result);
  }

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
        var item = getAncestor(style.ancestors);

        switch (style['text-align']) {
          case 'left':
          case 'start':
            if (typeof window.mbrAppCore === 'object') {
              changeProps(item, 'text-align', 'center');
            } else {
              editor.justifyCenter($editable);
            }
            break;
          case 'right':
            // editor.justifyFull($editable);
            if (typeof window.mbrAppCore === 'object') {
              changeProps(item, 'text-align', 'left');
            } else {
              editor.justifyLeft($editable);
            }
            break;
          case 'center':
            if (typeof window.mbrAppCore === 'object') {
              changeProps(item, 'text-align', 'right');
            } else {
              editor.justifyRight($editable);
            }
            break;
          // case 'justify':
          //   editor.justifyLeft($editable);
          //   break;
        }
      }
    }
  });
}));
