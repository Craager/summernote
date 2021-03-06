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
  if (typeof $.fn.spectrum === 'undefined') {
    return false;
  }

  // template
  var tmpl = $.summernote.renderer.getTemplate();

  var $changedItem;
  var $editable;
  var changedEditor;
  var $changedToolbar;
  function colorChanged(color) {
    changedEditor.beforeCommand($editable);

    if ($changedItem && $changedItem.css) {
      var prop = 'color';
      if (window.mbrAppCore) {
        window.mbrAppCore.addComponentStyles($changedItem, prop, color);
      } else {
        $changedItem.css(prop, color);
      }

      // restore range (focus summernote block and )
      changedEditor.restoreRange($editable);
    }
    if ($changedToolbar && $changedToolbar.length) {
      $changedToolbar.find('[data-name=mbrColor] .curTextColor').css('background', color);
    }

    changedEditor.afterCommand($editable);
  }

  var $pickerDefault = $('<input type="text" />').css({
    display: 'none'
  }).appendTo('body');

  var spectTimeout;
  $pickerDefault.spectrum({
    showButtons: false,
    preferredFormat: 'hex',
    showInput: true,
    showPaletteOnly: true,
    togglePaletteOnly: true,
    togglePaletteMoreText: 'More >',
    togglePaletteLessText: 'Less <',
    palette: [
      ['#7ac673', '#1ABC9C', '#27aae0', '#2C82C9', '#9365B8', '#4c6972', '#FFFFFF'],
      ['#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#475577', '#EFEFEF'],
      ['#F7DA64', '#faaf40', '#EB6B56', '#E25041', '#A38F84', '#28324E', '#CCCCCC'],
      ['#FAC51C', '#f97352', '#D14841', '#B8312F', '#7C706B', '#000000', '#c1c1c1']
    ],
    move: function (color) {
      (function (color) {
        clearTimeout(spectTimeout);
        spectTimeout = setTimeout(function () {
          colorChanged(color);
        }, 150);
      }(color.toHexString()));
    }
  });

  var $picker = $pickerDefault.next('.sp-replacer');
  $picker.css({
    position: 'absolute',
    visibility: 'hidden',
    opacity: 0,
    width: 0,
    height: 0,
    overflow: 'hidden',
    zIndex: -1000000
  });

  /**
   * @class plugin.mbr_btn 
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'mbrColor',

    /** 
     * @property {Object} buttons 
     * @property {Function} buttons.hello   function to make button
     * @property {Function} buttons.helloDropdown   function to make button
     * @property {Function} buttons.helloImage   function to make button
     */
    buttons: { // buttons
      mbrColor: function () {
        return tmpl.button('<span class="curTextColor"' +
          'style="border-radius: 9px;background: #000;' +
          'width: 18px;height: 18px;float: left;"><span>', {
          event: 'mbrColor',
          name: 'mbrColor',
          title: 'Color',
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
      mbrColor: function (event, editor, layoutInfo) {
        event.stopPropagation();
        event.preventDefault();
        $changedItem = undefined;
        changedEditor = editor;
        $editable = layoutInfo.editable();
        var $target = $(event.target);

        editor.saveRange($editable);

        // Get current item to change color
        var style = editor.currentStyle();

        for (var k in style.ancestors) {
          if (/P|DIV|UL|H1|H2|H3|H4|H5|H6/g.test(style.ancestors[k].tagName)) {
            $changedItem = $(style.ancestors[k]);
            continue;
          }
        }
        if (!$changedItem) {
          for (var n in style.ancestors) {
            if (style.ancestors[n].tagName === 'A') {
              $changedItem = $(style.ancestors[n]);
            }
          }
        }
        // check if menu item
        if (!$changedItem) {
          $changedItem = $(style.ancestors[0]).parent();
        }
        if (!$changedItem) {
          return;
        }
        $changedToolbar = layoutInfo.popover();

        // show Spectrum
        var offsetPicker = $target.offset();
        var heightPicker = $target.outerHeight(true);
        var widthPicker = $target.outerWidth(true);
        $picker.css({
          top: offsetPicker.top,
          left: offsetPicker.left,
          height: heightPicker,
          width: widthPicker
        });

        var $curColor = $changedItem.css('color');

        // change default spectrum color
        $pickerDefault.spectrum('set', $curColor);

        // show spectrum
        $pickerDefault.spectrum('toggle');
      }
    }
  });
}));
