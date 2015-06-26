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
  var $changedToolbar;
  function colorChanged(color) {
    if ($changedItem && $changedItem.css) {
      if (typeof window.mbrAppCore === 'object') {
        var id = $changedItem.parents('[data-app-component-id]:eq(0)').attr('data-app-component-id');
        window.mbrAppCore.addComponentStyles(id, $changedItem.prop('tagName'), {
          color: color
        });
      } else {
        $changedItem.css('color', color);
      }
    }
    if ($changedToolbar && $changedToolbar.length) {
      $changedToolbar.find('[data-name=mbrColor] .curTextColor').css('background', color);
    }
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
      ['#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC'],
      ['#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000'],
      ['#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF'],
      ['#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', '#FFFFFF']
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
          'style="border-radius: 10px;background: #000;' +
          'width: 18px;height: 18px;float: left;"><span>', {
          event : 'mbrColor',
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
        var $target = $(event.target);

        // Get current item to change color
        var style = editor.currentStyle();

        for (var k in style.ancestors) {
          if (/P|DIV|UL|H1|H2|H3|H4|H5|H6/g.test(style.ancestors[k].tagName)) {
            $changedItem = $(style.ancestors[k]);
            continue;
          }
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
