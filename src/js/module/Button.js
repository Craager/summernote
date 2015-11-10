define([
  'summernote/core/list',
  'summernote/core/agent'
], function (list, agent) {
  /**
   * @class module.Button
   *
   * Button
   */
  var Button = function () {
    /**
     * update button status
     *
     * @param {jQuery} $container
     * @param {Object} styleInfo
     */
    this.update = function ($container, styleInfo) {
      /**
       * handle dropdown's check mark (for fontname, fontsize, lineHeight).
       * @param {jQuery} $btn
       * @param {Number} value
       */
      var checkDropdownMenu = function ($btn, value) {
        $btn.find('.dropdown-menu li a').each(function () {
          var isChecked;
          if (typeof value === 'function') {
            isChecked = value($(this));
          } else {
            // always compare string to avoid creating another func.
            isChecked = ($(this).data('value') + '') === (value + '');
          }
          
          this.className = isChecked ? 'checked' : '';
        });
      };

      /**
       * update button state(active or not).
       *
       * @private
       * @param {String} selector
       * @param {Function} pred
       */
      var btnState = function (selector, pred) {
        var $btn = $container.find(selector);
        $btn.toggleClass('active', pred());
      };

      if (styleInfo.image) {
        var $img = $(styleInfo.image);

        btnState('button[data-event="imageShape"][data-value="img-rounded"]', function () {
          return $img.hasClass('img-rounded');
        });
        btnState('button[data-event="imageShape"][data-value="img-circle"]', function () {
          return $img.hasClass('img-circle');
        });
        btnState('button[data-event="imageShape"][data-value="img-thumbnail"]', function () {
          return $img.hasClass('img-thumbnail');
        });
        btnState('button[data-event="imageShape"]:not([data-value])', function () {
          return !$img.is('.img-rounded, .img-circle, .img-thumbnail');
        });

        var imgFloat = $img.css('float');
        btnState('button[data-event="floatMe"][data-value="left"]', function () {
          return imgFloat === 'left';
        });
        btnState('button[data-event="floatMe"][data-value="right"]', function () {
          return imgFloat === 'right';
        });
        btnState('button[data-event="floatMe"][data-value="none"]', function () {
          return imgFloat !== 'left' && imgFloat !== 'right';
        });

        var style = $img.attr('style');
        btnState('button[data-event="resize"][data-value="1"]', function () {
          return !!/(^|\s)(max-)?width\s*:\s*100%/.test(style);
        });
        btnState('button[data-event="resize"][data-value="0.5"]', function () {
          return !!/(^|\s)(max-)?width\s*:\s*50%/.test(style);
        });
        btnState('button[data-event="resize"][data-value="0.25"]', function () {
          return !!/(^|\s)(max-)?width\s*:\s*25%/.test(style);
        });
        return;
      }

      // fontname
      var $fontname = $container.find('.note-fontname');
      if ($fontname.length) {
        var selectedFont = styleInfo['font-family'];
        if (!!selectedFont) {

          var list = selectedFont.split(',');
          for (var i = 0, len = list.length; i < len; i++) {
            selectedFont = list[i].replace(/[\'\"]/g, '').replace(/\s+$/, '').replace(/^\s+/, '');
            if (agent.isFontInstalled(selectedFont)) {
              break;
            }
          }
          
          $fontname.find('.note-current-fontname').text(selectedFont);
          checkDropdownMenu($fontname, selectedFont);

        }
      }

      // fontsize
      var $fontsize = $container.find('.note-fontsize');
      $fontsize.find('.note-current-fontsize').text(styleInfo['font-size']);
      checkDropdownMenu($fontsize, parseFloat(styleInfo['font-size']));

      // lineheight
      var $lineHeight = $container.find('.note-height');
      checkDropdownMenu($lineHeight, parseFloat(styleInfo['line-height']));

      btnState('button[data-event="bold"]', function () {
        return styleInfo['font-bold'] === 'bold';
      });
      btnState('button[data-event="italic"]', function () {
        return styleInfo['font-italic'] === 'italic';
      });
      btnState('button[data-event="underline"]', function () {
        return styleInfo['font-underline'] === 'underline';
      });
      btnState('button[data-event="strikethrough"]', function () {
        return styleInfo['font-strikethrough'] === 'strikethrough';
      });
      btnState('button[data-event="superscript"]', function () {
        return styleInfo['font-superscript'] === 'superscript';
      });
      btnState('button[data-event="subscript"]', function () {
        return styleInfo['font-subscript'] === 'subscript';
      });
      btnState('button[data-event="justifyLeft"]', function () {
        return styleInfo['text-align'] === 'left' || styleInfo['text-align'] === 'start';
      });
      btnState('button[data-event="justifyCenter"]', function () {
        return styleInfo['text-align'] === 'center';
      });
      btnState('button[data-event="justifyRight"]', function () {
        return styleInfo['text-align'] === 'right';
      });
      btnState('button[data-event="justifyFull"]', function () {
        return styleInfo['text-align'] === 'justify';
      });
      btnState('button[data-event="insertUnorderedList"]', function () {
        return styleInfo['list-style'] === 'unordered';
      });
      btnState('button[data-event="insertOrderedList"]', function () {
        return styleInfo['list-style'] === 'ordered';
      });


      // mbrBtnColor
      var $mbrBtnColor = $container.find('.note-mbrBtnColor');
      var $mbrLinkColor = $container.find('.note-mbrLinkColor');
      if ($(styleInfo.anchor).is('.btn:not(.mbr-menu-item)')) {
        $mbrLinkColor.hide();
        $mbrBtnColor.parent().show();
        checkDropdownMenu($mbrBtnColor, function ($item) {
          var checked = $(styleInfo.anchor).hasClass($item.data('value'));

          // if checked - change label on button
          if (checked) {
            var label = $item.find('> span').clone().css('margin-left', 0);
            $mbrBtnColor.find('button > .note-current-mbrBtnColor').html(label);
          }

          return checked;
        });
      } else {
        $mbrBtnColor.parent().hide();
        $mbrLinkColor.show();

        // links
        if ($(styleInfo.anchor).is('a')) {
          checkDropdownMenu($mbrLinkColor, function ($item) {
            var checked = $(styleInfo.anchor).hasClass($item.data('value'));

            // if no specific link classes - add 'text-link' classname styles
            if ($item.data('value') === 'text-primary' && !$(styleInfo.anchor).is('.text-primary,' +
              '.text-success,' +
              '.text-info,' +
              '.text-warning,' +
              '.text-danger,' +
              '.text-white,' +
              '.text-black,' +
              '.text-gray')) {
              checked = true;
            }

            // if checked - change label on button
            if (checked) {
              var label = $item.find('> span').clone().css('margin-left', 0);
              $mbrLinkColor.find('button > .note-current-mbrLinkColor').html(label);
            }

            return checked;
          });
        }
      }


      // mbrBtnRemove
      var $mbrBtnRemove = $container.find('.btn[data-name="mbrBtnRemove"]');
      if ($mbrBtnRemove.length) {
        var mbrBtnRemoveSiblings = $(styleInfo.anchor).parents('[data-app-edit]:eq(0)').find('.btn, [data-app-btn]').length;
        if (mbrBtnRemoveSiblings <= 1) {
          $mbrBtnRemove.attr('disabled', 'disabled');
        } else {
          $mbrBtnRemove.removeAttr('disabled');
        }
      }

      // mbrFontSize
      var $mbrFontsize = $container.find('.note-mbrFonts > [data-name=mbrFontSize]');
      $mbrFontsize.find('.note-current-mbrFontSize').text(styleInfo['font-size']);
      checkDropdownMenu($mbrFontsize, parseFloat(styleInfo['font-size']));

      // mbrFontName
      var $mbrFontname = $container.find('.note-mbrFonts > [data-name=mbrFonts]');
      if ($mbrFontname.length) {
        var selectedMbrFont = styleInfo['font-family'];
        if (!!selectedMbrFont) {

          var mbrFontsList = selectedMbrFont.split(',');
          for (var k = 0, klen = mbrFontsList.length; k < klen; k++) {
            selectedMbrFont = mbrFontsList[k].replace(/[\'\"]/g, '').replace(/\s+$/, '').replace(/^\s+/, '');
            if (agent.isFontInstalled(selectedMbrFont)) {
              break;
            }
          }
          
          $mbrFontname.find('.note-current-mbrFonts')
            .css('font-family', '\'' + selectedMbrFont + '\'')
            .text(selectedMbrFont);
          checkDropdownMenu($mbrFontname, selectedMbrFont);

        }
      }

      // mbrColor
      var $mbrColorBtn = $container.find('[data-name=mbrColor] .curTextColor');

      if (styleInfo.ancestors) {
        var $editable = $(styleInfo.ancestors[0]).parent();
        var options = $editable.data('options');
        
        var removeMbrColorBtn = $(styleInfo.anchor).hasClass('btn') || $(styleInfo.anchor).is('[data-app-btn]:not(.mbr-menu-item)');
        if (options && options.customToolbar && options.customToolbar.mbrColor === 'on') {
          removeMbrColorBtn = false;
        }

        if (removeMbrColorBtn) {
          $mbrColorBtn.parent().remove();
        } else {
          var $currentColor;
          for (var n in styleInfo.ancestors) {
            if (/P|DIV|UL|H1|H2|H3|H4|H5|H6/g.test(styleInfo.ancestors[n].tagName)) {
              $currentColor = $(styleInfo.ancestors[n]).css('color');
              continue;
            }
          }
          if (!$currentColor) {
            var $parent = $(styleInfo.ancestors[0]).parent();
            $currentColor = $parent.css('color');
          }
          $mbrColorBtn.css({
            background: $currentColor || '#000'
          });
        }
      }


      // mbrAlign
      var $mbrAlignBtn = $container.find('[data-name=mbrAlign]');
      var $mbrAlignBtnIcon = $mbrAlignBtn.find('> i');
      switch (styleInfo['text-align']) {
        case 'left':
        case 'start':
          $mbrAlignBtnIcon.attr('class', 'fa fa-align-left');
          // $mbrAlignBtn.attr('data-event', 'justifyCenter');
          break;
        case 'right':
          $mbrAlignBtnIcon.attr('class', 'fa fa-align-right');
          // $mbrAlignBtn.attr('data-event', 'justifyFull');
          break;
        case 'center':
          $mbrAlignBtnIcon.attr('class', 'fa fa-align-center');
          // $mbrAlignBtn.attr('data-event', 'justifyRight');
          break;
        case 'justify':
          $mbrAlignBtnIcon.attr('class', 'fa fa-align-justify');
          // $mbrAlignBtn.attr('data-event', 'justifyLeft');
          break;
      }
    };

    /**
     * update recent color
     *
     * @param {Node} button
     * @param {String} eventName
     * @param {Mixed} value
     */
    this.updateRecentColor = function (button, eventName, value) {
      var $color = $(button).closest('.note-color');
      var $recentColor = $color.find('.note-recent-color');
      var colorInfo = JSON.parse($recentColor.attr('data-value'));
      colorInfo[eventName] = value;
      $recentColor.attr('data-value', JSON.stringify(colorInfo));
      var sKey = eventName === 'backColor' ? 'background-color' : 'color';
      $recentColor.find('i').css(sKey, value);
    };
  };

  return Button;
});
