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

  var buttonColors = {
    'default': '#DDD',
    'primary': '#4c6972',
    'success': '#7ac673',
    'info'   : '#27aae0',
    'warning': '#faaf40',
    'danger' : '#f97352',
    'link'   : '#000'
  };
  var linkColors = {
    'primary': '#4c6972',
    'success': '#7ac673',
    'info'   : '#27aae0',
    'warning': '#faaf40',
    'danger' : '#f97352',
    'black'  : '#000',
    'white'  : '#fff',
    'gray'   : '#9c9c9c'
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
      buttonColors: buttonColors,
      linkColors: linkColors
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
          event: 'mbrBtnRemove',
          name: 'mbrBtnRemove',
          title: 'Remove',
          hide: true
        });
      },
      mbrBtnAdd: function () {
        return tmpl.iconButton('fa fa-plus', {
          event: 'mbrBtnAdd',
          name: 'mbrBtnAdd',
          title: 'Add',
          hide: false
        });
      },
      mbrBtnMove: function () {
        return tmpl.iconButton('fa fa-arrow-left', {
          event: 'mbrBtnMove',
          name: 'mbrBtnMove',
          title: 'Move Left',
          hide: false
        });
      },
      mbrBtnColor: function (lang, options) {
        var items = '';
        for (var k in options.buttonColors) {
          items += '<li><a data-event="mbrBtnColor" href="javascript:void(0);" data-value="btn-' + k + '">' +
                    '<i class="fa fa-check"></i>' +
                    '<span style="width:18px;height:18px;border-radius:9px;' +
                      'vertical-align: bottom;margin-left: 5px;' +
                      'display: inline-block;background:' + options.buttonColors[k] + ';">' +
                    '</span>' +
                  '</a></li>';
        }

        var label = '<span class="note-current-mbrBtnColor"></span>';
        var dropdown = '<ul class="dropdown-menu note-check">' + items + '</ul>';

        return tmpl.button(label, {
          title: 'Color',
          name: 'mbrBtnColor',
          event: 'mbrBtnColorPrevent',
          hide: true,
          className: 'note-mbrBtnColor',
          dropdown : dropdown,
          nocaret: true
        });
      },
      mbrLinkColor: function (lang, options) {
        var items = '';
        for (var k in options.linkColors) {
          items += '<li><a data-event="mbrLinkColor" href="javascript:void(0);" data-value="text-' + k + '">' +
                    '<i class="fa fa-check"></i>' +
                    '<span style="width:18px;height:18px;border-radius:9px;' +
                      'vertical-align: bottom;margin-left: 5px;' +
                      'display: inline-block;background:' + options.linkColors[k] + ';">' +
                    '</span>' +
                  '</a></li>';
        }

        var label = '<span class="note-current-mbrLinkColor"></span>';
        var dropdown = '<ul class="dropdown-menu note-check">' + items + '</ul>';

        return tmpl.button(label, {
          title: 'Color',
          name: 'mbrLinkColor',
          event: 'mbrBtnColorPrevent',
          hide: true,
          className: 'note-mbrLinkColor',
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
        var useParent = $editable.hasClass('mbr-menu-item') ||
                $editable.hasClass('mbr-editable-menu-item') ||
                $editable.attr('data-app-btn') === 'parent';
        var $sibling = useParent ?
                $editable.parent().siblings('li:eq(0)').find('> a')
                : $editable.siblings('[data-app-btn]:eq(0)');
        var $parent = useParent ?
                $editable.parents('[data-app-edit]:eq(0)')
                : $editable.parent();

        if (useParent) {
          $editable.destroy().parent().remove();
        } else {
          $editable.destroy().remove();
        }

        if ($parent.is('[data-app-edit]')) {
          // remove from mobirise core
          $parent.trigger('delete.rivets');
        }

        if ($sibling.length) {
          editor.afterCommand($sibling);
        }
      },
      mbrBtnAdd: function (event, editor, layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();
        var options = $editable.data('options') || {};
        var $oldBtn = $editable;
        var useParent = $editable.hasClass('mbr-menu-item') ||
                $editable.hasClass('mbr-editable-menu-item') ||
                $editable.attr('data-app-btn') === 'parent';

        if (useParent) {
          $oldBtn = $editable.parent();
        }

        // clone current button
        var $newBtn = $oldBtn.clone();

        // insert clone after current button
        $oldBtn.after($newBtn);
        $oldBtn.after(' '); // space between buttons

        if (useParent) {
          $newBtn = $newBtn.find('> a');
          $oldBtn = $oldBtn.find('> a');
        }

        // remove all classes and attributes from cloned button
        $newBtn
          .removeClass('summernote-air note-air-editor note-editable')
          .removeAttr('id contenteditable');

        // init new button
        $newBtn.summernote(options);

        editor.afterCommand($newBtn);
        $newBtn.focus();
      },
      mbrBtnMove: function (event, editor, layoutInfo) {
        // Get current editable node
        var $editable = layoutInfo.editable();
        var $curBtn = $editable;

        var useParent = $editable.hasClass('mbr-menu-item') ||
                $editable.hasClass('mbr-editable-menu-item') ||
                $editable.attr('data-app-btn') === 'parent';

        if (useParent) {
          $curBtn = $editable.parent();
        }

        // get previous button
        var $prevBtn = $curBtn.prev(useParent ? undefined : '.btn');
        if (!$prevBtn[0]) {
          $prevBtn = $curBtn.prev('[data-app-btn]');
        }
        if (!$prevBtn[0]) {
          return;
        }

        // move current button before prevous
        $prevBtn.before($curBtn);
        $prevBtn.before(' '); // space between buttons

        editor.afterCommand($editable);
        $editable.focus();
      },
      mbrBtnColor: function (event, editor, layoutInfo, value) {
        // Get current editable node
        var $editable = layoutInfo.editable();

        // remove all color classes
        var removeClasses = '';
        for (var k in buttonColors) {
          removeClasses += ' btn-' + k;
        }

        $editable.removeClass(removeClasses).addClass(value);
        // editor.fontSize(layoutInfo.editable(), value);

        editor.afterCommand($editable);
      },
      mbrLinkColor: function (event, editor, layoutInfo, value) {
        var $editable = layoutInfo.editable();
        var link = editor.createRange($editable).commonAncestor().parentNode;

        if ($(link).is('a')) {
          // remove all color classes
          var removeClasses = '';
          for (var k in linkColors) {
            removeClasses += ' text-' + k;
          }

          $(link).removeClass(removeClasses).addClass(value);
          // editor.fontSize(layoutInfo.editable(), value);

          editor.afterCommand($editable);
        }
      },
      mbrBtnColorPrevent: function (event) {
        event.preventDefault();
      }
    }
  });
}));
