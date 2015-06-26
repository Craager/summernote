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
  // var range = $.summernote.core.range;
  // var editor = $.summernote.eventHandler.getEditor();

  var fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 30, 32, 36, 46, 48, 60, 72, 80, 84, 100];

  var googleFonts = {
    'open_sans': {
      name: 'Open Sans',
      url : 'https://fonts.googleapis.com/css?family=Open+Sans:400,300,700',
      css : '\'Open Sans\', sans-serif'
    },
    'roboto': {
      name: 'Roboto',
      url : 'https://fonts.googleapis.com/css?family=Roboto:400,300,700',
      css : '\'Roboto\', sans-serif'
    },
    'lato': {
      name: 'Lato',
      url : 'https://fonts.googleapis.com/css?family=Lato:400,300,700',
      css : '\'Lato\', sans-serif'
    },
    'oswald': {
      name: 'Oswald',
      url : 'https://fonts.googleapis.com/css?family=Oswald:400,300,700',
      css : '\'Oswald\', sans-serif'
    },
    'roboto_condensed': {
      name: 'Roboto Condensed',
      url : 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,300,700',
      css : '\'Roboto Condensed\', sans-serif'
    },
    'slabo_px': {
      name: 'Slabo 27px',
      url : 'https://fonts.googleapis.com/css?family=Slabo+27px',
      css : '\'Slabo 27px\', serif'
    },
    'lora': {
      name: 'Lora',
      url : 'https://fonts.googleapis.com/css?family=Lora:400,700',
      css : '\'Lora\', serif'
    },
    'source_sans_pro': {
      name: 'Source Sans Pro',
      url : 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700',
      css : '\'Source Sans Pro\', sans-serif'
    },
    'pt_sans': {
      name: 'PT Sans',
      url : 'https://fonts.googleapis.com/css?family=PT+Sans:400,700',
      css : '\'PT Sans\', sans-serif'
    },
    'open_sans_condensed': {
      name: 'Open Sans Condensed',
      url : 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700',
      css : '\'Open Sans Condensed\', sans-serif'
    },
    'raleway': {
      name: 'Raleway',
      url : 'https://fonts.googleapis.com/css?family=Raleway:400,300,700',
      css : '\'Raleway\', sans-serif'
    },
    'droid_sans': {
      name: 'Droid Sans',
      url : 'https://fonts.googleapis.com/css?family=Droid+Sans:400,700',
      css : '\'Droid Sans\', sans-serif'
    },
    'montserrat': {
      name: 'Montserrat',
      url : 'https://fonts.googleapis.com/css?family=Montserrat:400,700',
      css : '\'Montserrat\', sans-serif'
    },
    'ubuntu': {
      name: 'Ubuntu',
      url : 'https://fonts.googleapis.com/css?family=Ubuntu:400,300,700',
      css : '\'Ubuntu\', sans-serif'
    },
    'droid_serif': {
      name: 'Droid Serif',
      url : 'https://fonts.googleapis.com/css?family=Droid+Serif:400,700',
      css : '\'Droid Serif\', serif'
    },
    'roboto_slab': {
      name: 'Roboto Slab',
      url : 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,300,700',
      css : '\'Roboto Slab\', serif'
    },
    'merriweather': {
      name: 'Merriweather',
      url : 'https://fonts.googleapis.com/css?family=Merriweather:400,300,700',
      css : '\'Merriweather\', serif'
    },
    'pt_sans_narrow': {
      name: 'PT Sans Narrow',
      url : 'https://fonts.googleapis.com/css?family=PT+Sans+Narrow:400,700',
      css : '\'PT Sans Narrow\', sans-serif'
    },
    'arimo': {
      name: 'Arimo',
      url : 'https://fonts.googleapis.com/css?family=Arimo:400,700',
      css : '\'Arimo\', sans-serif'
    },
    'noto_sans': {
      name: 'Noto Sans',
      url : 'https://fonts.googleapis.com/css?family=Noto+Sans:400,700',
      css : '\'Noto Sans\', sans-serif'
    },
    'bitter': {
      name: 'Bitter',
      url : 'https://fonts.googleapis.com/css?family=Bitter:400,700',
      css : '\'Bitter\', serif'
    },
    'titillium_web': {
      name: 'Titillium Web',
      url : 'https://fonts.googleapis.com/css?family=Titillium+Web:400,300,700',
      css : '\'Titillium Web\', sans-serif'
    },
    'indie_flower': {
      name: 'Indie Flower',
      url : 'https://fonts.googleapis.com/css?family=Indie+Flower',
      css : '\'Indie Flower\', cursive'
    },
    'pt_serif': {
      name: 'PT Serif',
      url : 'https://fonts.googleapis.com/css?family=PT+Serif:400,700',
      css : '\'PT Serif\', serif'
    },
    'yanone_kaffeesatz': {
      name: 'Yanone Kaffeesatz',
      url : 'https://fonts.googleapis.com/css?family=Yanone+Kaffeesatz:400,300,700',
      css : '\'Yanone Kaffeesatz\', sans-serif'
    },
    'oxygen': {
      name: 'Oxygen',
      url : 'https://fonts.googleapis.com/css?family=Oxygen:400,300,700',
      css : '\'Oxygen\', sans-serif'
    }
  };


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


  function changeProps(item, prop, value, googleLink) {
    if (typeof window.mbrAppCore === 'object') {
      var result = {};
      result[prop] = value;
      var id = $(item).parents('[data-app-component-id]:eq(0)').attr('data-app-component-id');
      var tag = $(item).hasClass('btn') ? '.btn' : $(item).prop('tagName');
      window.mbrAppCore.addComponentStyles(id, tag, result, googleLink);
    } else {
      $(item).css(prop, value);
    }
  }

  /**
   * @class plugin.mbr_btn 
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'mbrFonts',

    /** 
     * @property {Object} buttons 
     * @property {Function} buttons.hello   function to make button
     * @property {Function} buttons.helloDropdown   function to make button
     * @property {Function} buttons.helloImage   function to make button
     */
    buttons: {
      mbrFonts: function () {
        // Google Fonts
        var items = '';
        for (var k in googleFonts) {
          items += '<li><a data-event="mbrFonts" href="javascript:void(0);"' +
                      'data-value="' + googleFonts[k].name + '" ' +
                      'data-css="' + googleFonts[k].css + '" ' +
                      'data-url="' + googleFonts[k].url + '" ' +
                      'data-slug="' + k + '" ' +
                      'style="font-family: ' + googleFonts[k].css + ';">' +
                      '<i class="fa fa-check"></i> ' + googleFonts[k].name +
                    '</a></li>';
        }

        var label = '<span class="note-current-mbrFonts">Roboto</span>';
        var dropdown = '<ul class="dropdown-menu note-check">' + items + '</ul>';

        return tmpl.button(label, {
          title: 'Fonts',
          hide: true,
          dropdown : dropdown,
          event: 'mbrFontsPrevent'
        });
      },
      mbrFontSize: function () {
        var items = '';
        for (var k in fontSizes) {
          items += '<li><a data-event="mbrFontSize" href="javascript:void(0);"' +
                      'data-value="' + fontSizes[k] + '">' +
                      '<i class="fa fa-check"></i> ' + fontSizes[k] +
                    '</a></li>';
        }

        var label = '<span class="note-current-mbrFontSize">11</span>';
        var dropdown = '<ul class="dropdown-menu note-check" style="min-width: 105px;"> ' + items + ' </ul>';

        return tmpl.button(label, {
          title: 'Font Size',
          hide: true,
          dropdown : dropdown,
          event: 'mbrFontsPrevent'
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
      mbrFonts: function (event, editor) {
        var style = editor.currentStyle();
        var newFont = $(event.target).attr('data-css');
        var googleLink = $(event.target).attr('data-url');
        
        var item = getAncestor(style.ancestors);
        console.log(event);

        if (item) {
          changeProps(item, 'font-family', newFont, googleLink);
        }
      },
      mbrFontSize: function (event, editor) {
        var style = editor.currentStyle();
        var newFontSize = $(event.target).attr('data-value');

        var item = getAncestor(style.ancestors);

        if (item) {
          if (item) {
            changeProps(item, 'font-size', newFontSize + 'px');
          }
        }
      },
      mbrFontsPrevent: function (event) {
        event.preventDefault();
      }
    }
  });
}));
