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
  var KEY = {
    ENTER: 13
  };

  // return ancestor to accept font styles
  // function getAncestor(ancestors) {
  //   var item;

  //   // check if some of alloved tags
  //   for (var k in ancestors) {
  //     if (/P|DIV|UL|H1|H2|H3|H4|H5|H6/g.test(ancestors[k].tagName)) {
  //       item = ancestors[k];
  //       continue;
  //     }
  //   }

  //   // check if button
  //   if (!item) {
  //     var $parent = $(ancestors[0]).parent();
  //     if ($parent.hasClass('btn')) {
  //       item = $parent[0];
  //     }
  //   }

  //   return item;
  // }

  /**
   * @class plugin.mbr_btn 
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'mbrBr',

    init: function (layoutInfo) {
      var $note = layoutInfo.holder();

      $note.on('summernote.keydown', function (customEvent, nativeEvent) {
        if (nativeEvent.keyCode === KEY.ENTER) {
          nativeEvent.preventDefault();
          nativeEvent.stopPropagation();
          // nativeEvent.preventDefault();
          // self.replace($popover);

          // $popover.hide();
          // $note.summernote('focus');
        }
      });
    }
  });
}));
