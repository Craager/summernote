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
  var range = $.summernote.core.range;
  var list = $.summernote.core.list;
  var dom = $.summernote.core.dom;

  var KEY = {
    ENTER: 13
  };

  /**
   * toggle button status
   *  
   * @member plugin.video
   * @private
   * @param {jQuery} $btn
   * @param {Boolean} isEnable
   */
  var toggleBtn = function ($btn, isEnable) {
    $btn.toggleClass('disabled', !isEnable);
    $btn.attr('disabled', !isEnable);
  };

  /**
   * bind enter key
   *
   * @private
   * @param {jQuery} $input
   * @param {jQuery} $btn
   */
  var bindEnterKey = function ($input, $btn) {
    $input.on('keypress', function (event) {
      if (event.keyCode === KEY.ENTER) {
        $btn.trigger('click');
      }
    });
  };

  /**
   * update anchors
   * @param {jQuery} $selector
   */
  var updateAnchors = function ($selector) {
    var result = '';
    
    // mobirise core method support
    if (window.mbrAppCore) {
      result = window.mbrAppCore.getComponentsAnchorList();
    }

    // if no mobirise
    else {
      result = '<option value="" disabled="disabled" selected="selected">Anchors</option>';
      $('[id]:not(.note-air-layout, .note-editable, .tooltip, style)').each(function () {
        var val = $(this).attr('id');
        result += '<option value="#' + val + '">#' + val + '</option>';
      });
    }

    $selector.html(result);
  };

  /**
   * update pages (works only with mobirise core)
   * @param {jQuery} $selector
   */
  var updatePages = function ($selector) {
    // mobirise core method support
    if (window.mbrAppCore) {
      var result = window.mbrAppCore.getPagesList();
      $selector.html(result);
    }
  };

  /**
   * Show video dialog and set event handlers on dialog controls.
   *
   * @member plugin.video
   * @private
   * @param {jQuery} $editable
   * @param {jQuery} $dialog
   * @param {Object} linkInfo
   * @return {Promise}
   */
  var showMbrLinkDialog = function ($editable, $dialog, linkInfo) {
    return $.Deferred(function (deferred) {
      var $mbrLinkDialog = $dialog.find('.note-mbr-link-dialog');

      var $mbrText = $mbrLinkDialog.find('.note-mbr-text'),
          $mbrLink = $mbrLinkDialog.find('.note-mbr-link'),
          $mbrAnchors = $mbrLinkDialog.find('.note-mbr-anchors'),
          $mbrPages = $mbrLinkDialog.find('.note-mbr-pages'),
          $mbrBtn = $mbrLinkDialog.find('.note-mbr-link-btn'),
          $openInNewWindow = $mbrLinkDialog.find('input[type=checkbox]');

      toggleBtn($mbrBtn, false);

      function updatedSelectors(val) {
        var pageExists = $mbrPages.find('option[value="' + val + '"]').length !== 0 ? val : '';
        var anchorExists = $mbrAnchors.find('option[value="' + val + '"]').length !== 0 ? val : '';
        $mbrPages.val(pageExists);
        $mbrAnchors.val(anchorExists);
      }

      $mbrLinkDialog.one('shown.bs.modal', function () {
        $mbrLinkDialog.css('-webkit-transform', 'translate3d(0,0,0)');

        $mbrText.val(linkInfo.text).on('input', function () {
          toggleBtn($mbrBtn, $mbrText.val() && $mbrLink.val());
        });

        $mbrLink.on('input', function () {
          var val = $mbrLink.val();
          toggleBtn($mbrBtn, $mbrText.val() && val);
          updatedSelectors(val);
        }).trigger('focus');

        // if no url was given, copy text to url
        if (!linkInfo.url) {
          linkInfo.url = 'http://';
        }

        $mbrLink.val(linkInfo.url);

        // unpdate list with anchors
        updateAnchors($mbrAnchors);
        $mbrAnchors.on('change', function () {
          $mbrLink.val($(this).val()).trigger('input');
          $mbrPages.val('');
        });

        // unpdate list with pages
        updatePages($mbrPages);
        $mbrPages.on('change', function () {
          $mbrLink.val($(this).val()).trigger('input');
          $mbrAnchors.val('');
        });

        $openInNewWindow.on('change', function () {
          $mbrLink.trigger('input');
        });
        $openInNewWindow.prop('checked', linkInfo.newWindow);

        updatedSelectors(linkInfo.url);

        bindEnterKey($mbrLink, $mbrBtn);
        bindEnterKey($mbrText, $mbrBtn);

        $mbrBtn.click(function (event) {
          event.preventDefault();

          deferred.resolve({
            range: linkInfo.range,
            url: $mbrLink.val(),
            text: $mbrText.val(),
            newWindow: $openInNewWindow.is(':checked')
          });
          $mbrLinkDialog.modal('hide');
        });
      }).one('hidden.bs.modal', function () {
        // detach events
        $mbrText.off('input keypress');
        $mbrLink.off('input keypress');
        $mbrAnchors.off('change');
        $mbrPages.off('change');
        $openInNewWindow.off('change');
        $mbrBtn.off('click');

        if (deferred.state() === 'pending') {
          deferred.reject();
        }
      }).modal('show');
    });
  };
  var and = function (fA, fB) {
    return function (item) {
      return fA(item) && fB(item);
    };
  };

  /**
   * insert and returns styleNodes on range.
   *
   * @param {WrappedRange} rng
   * @param {Object} [options] - options for styleNodes
   * @param {String} [options.nodeName] - default: `SPAN`
   * @param {Boolean} [options.expandClosestSibling] - default: `false`
   * @param {Boolean} [options.onlyPartialContains] - default: `false`
   * @return {Node[]}
   */
  var styleNodes = function (rng, options) {
    rng = rng.splitText();

    var nodeName = options && options.nodeName || 'SPAN';
    var expandClosestSibling = !!(options && options.expandClosestSibling);
    var onlyPartialContains = !!(options && options.onlyPartialContains);

    if (rng.isCollapsed()) {
      return [rng.insertNode(dom.create(nodeName))];
    }

    var pred = dom.makePredByNodeName(nodeName);
    var nodes = $.map(rng.nodes(dom.isText, {
      fullyContains: true
    }), function (text) {
      return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
    });

    if (expandClosestSibling) {
      if (onlyPartialContains) {
        var nodesInRange = rng.nodes();
        // compose with partial contains predication
        pred = and(pred, function (node) {
          return list.contains(nodesInRange, node);
        });
      }

      return $.map(nodes, function (node) {
        var siblings = dom.withClosestSiblings(node, pred);
        var head = list.head(siblings);
        var tails = list.tail(siblings);
        $.each(tails, function (idx, elem) {
          dom.appendChildNodes(head, elem.childNodes);
          dom.remove(elem);
        });
        return list.head(siblings);
      });
    } else {
      return nodes;
    }
  };



  /**
   * Create link
   *
   * @private
   * @param {jQuery} $editable
   * @param {Object} linkInfo
   * @param {Object} options
   */
  var createLink = function ($editable, linkInfo, options) {
    var linkUrl = linkInfo.url;
    var linkText = linkInfo.text;
    var isNewWindow = linkInfo.newWindow;
    var rng = linkInfo.range;
    var isTextChanged = rng.toString() !== linkText;

    options = options || dom.makeLayoutInfo($editable).editor().data('options');
    
    if (options.onCreateLink) {
      linkUrl = options.onCreateLink(linkUrl);
    }

    var anchors = [];
    if ($editable.hasClass('btn') || $editable.is('[data-app-btn]')) {
      $editable.html(linkText);
      anchors.push($editable[0]);
    } else if (isTextChanged) {
      // Create a new link when text changed.
      var anchor = rng.insertNode($('<A>' + linkText + '</A>')[0]);
      anchors.push(anchor);
    } else {
      anchors = styleNodes(rng, {
        nodeName: 'A',
        expandClosestSibling: true,
        onlyPartialContains: true
      });
    }

    $.each(anchors, function (idx, anchor) {
      $(anchor).attr('href', linkUrl);
      if (isNewWindow) {
        $(anchor).attr('target', '_blank');
      } else {
        $(anchor).removeAttr('target');
      }
    });

    var startRange = range.createFromNodeBefore(list.head(anchors));
    var startPoint = startRange.getStartPoint();
    var endRange = range.createFromNodeAfter(list.last(anchors));
    var endPoint = endRange.getEndPoint();

    range.create(
      startPoint.node,
      startPoint.offset,
      endPoint.node,
      endPoint.offset
    ).select();
  };

  /**
   * @class plugin.hello 
   * 
   * Hello Plugin  
   */
  $.summernote.addPlugin({
    /** @property {String} name name of plugin */
    name: 'mbrLink',
    /** 
     * @property {Object} buttons 
     * @property {Function} buttons.hello   function to make button
     * @property {Function} buttons.helloDropdown   function to make button
     * @property {Function} buttons.helloImage   function to make button
     */
    buttons: { // buttons
      mbrLink: function () {
        return tmpl.iconButton('fa fa-link', {
          event: 'showMbrLinkDialog',
          name: 'mbrLink',
          title: 'Link',
          hide: true
        });
      }
    },

    /**
     * @property {Object} dialogs
     * @property {function(object, object): string} dialogs.video
    */
    dialogs: {
      mbrLink: function () {
        var body =  '<div class="form-group row-fluid">' +
                      '<label>Text to display</label>' +
                      '<input class="note-mbr-text form-control span12" type="text">' +
                    '</div>' +
                    '<div class="row">' +
                      '<div class="col-sm-6">' +
                        '<label>URL</label>' +
                        '<input class="note-mbr-link form-control" type="text" />' +
                      '</div>' +
                      '<div class="col-sm-3">' +
                        '<label>Pages</label>' +
                        '<select class="note-mbr-pages form-control"><option disabled="disabled">Nothing Selected</option></select>' +
                      '</div>' +
                      '<div class="col-sm-3">' +
                        '<label>Page Anchors</label>' +
                        '<select class="note-mbr-anchors form-control"><option disabled="disabled">Nothing Selected</option></select>' +
                      '</div>' +
                    '</div>' +
                    '<div class="checkbox" style="padding-left: 0;"><label>' +
                      '<input type="checkbox"> Open in new window' +
                    '</label></div>';

        var footer = '<button href="#" class="btn btn-primary note-mbr-link-btn disabled" disabled>Insert Link</button>';
        return tmpl.dialog('note-mbr-link-dialog', 'Link', body, footer);
      }
    },

    /**
     * @property {Object} events 
     * @property {Function} events.hello  run function when button that has a 'hello' event name  fires click
     * @property {Function} events.helloDropdown run function when button that has a 'helloDropdown' event name  fires click
     * @property {Function} events.helloImage run function when button that has a 'helloImage' event name  fires click
     */
    events: {
      showMbrLinkDialog: function (event, editor, layoutInfo) {
        var $editor = layoutInfo.editor(),
            $dialog = layoutInfo.dialog(),
            $editable = layoutInfo.editable(),
            linkInfo = editor.getLinkInfo($editable),
            options = $editor.data('options');

        if ($editor.is('[href]')) {
          linkInfo.url = $editor.attr('href');
        }

        // save current range
        editor.saveRange($editable);

        showMbrLinkDialog($editable, $dialog, linkInfo).then(function (linkInfo) {
          // restore range
          editor.restoreRange($editable);

          editor.beforeCommand($editable);

          createLink($editable, linkInfo, options);

          editor.afterCommand($editable);
          
          // build node
          // var $node = createLinkNode(url);
          
          // if ($node) {
          //   // insert video node
          //   editor.insertNode($editable, $node);
          // }
        }).fail(function () {
          // when cancel button clicked
          editor.restoreRange($editable);
        });
      }
    }
  });
}));
