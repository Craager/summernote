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
  
  // core functions: range, dom
  var range = $.summernote.core.range;
  var dom = $.summernote.core.dom;

  /**
   * @class plugin.multiline
   * 
   * Multiline Plugin.
   * Disables the addition of new paragraphs if "data-multiline" attribute for node editor is not set.
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'mbrMultiline',
    events: {
      
      ENTER: function (e, editor, layoutInfo) {

        var $editor = layoutInfo.editor();
        var isMultilineContent = $editor.data('multiline') || '' === $editor.data('multiline');
        
        if (isMultilineContent) {
          // apply default enter key
          layoutInfo.holder().summernote('insertParagraph');
        } else {

          var $editable = layoutInfo.editable();
          editor.beforeCommand($editable);

          var rng = range.create().deleteContents();
          var info = dom.splitPoint(rng.getStartPoint(), false);
          var node = dom.create('br');

          if (info.rightNode) {
            info.rightNode.parentNode.insertBefore(node, info.rightNode);
          } else {
            info.container.appendChild(node);
            // bug fix: sometimes insertion is not working when cursor located at the end point of editor
            if ($editor[0] === info.container) {
              info.container.appendChild(dom.create('br'));
            }
          }

          rng.normalize();

          (function (node) {
          
            var ec = node;
            var eo = dom.nodeLength(ec);

            if (dom.isVoid(ec)) {
              eo = dom.listPrev(ec).length;
              ec = ec.parentNode;
            }

            return range.create(ec, eo, ec, eo);

          })(node).select();

          editor.afterCommand($editable);

        }

        // prevent ENTER key
        return true;

      }
    
    },

    // HACK FOR OLD CORE!!!
    // TODO: remove it after core updated to qwebengine
    init: function (layoutInfo) {
      var $note = layoutInfo.holder();

      function removeBR(e) {
        var deleteKey = e.keyCode === 8 || e.keyCode === 46;
        if (deleteKey && $note.text().length === 0) {
          var br = $note.find('br');
          if (br.length === 1) {
            br.remove();
          }
        }
      }

      $note.on('keyup.summernote', removeBR);
      removeBR({
        keyCode: 8
      });
    }

  });

}));
