define([
  'summernote/core/func',
  'summernote/core/list',
  'summernote/module/Button'
], function (func, list, Button) {
  /**
   * @class module.Popover
   *
   * Popover (http://getbootstrap.com/javascript/#popovers)
   *
   */
  var Popover = function () {
    var button = new Button();

    var PX_POPOVER_ARROW_OFFSET_X = -11;
    var POPOVER_MAX_L_OFFSET = 5;
    var POPOVER_MAX_R_OFFSET = 5;
    var POPOVER_MAX_T_OFFSET = 20;
    // when popover top offset < MAX_TOP_OFFSET - show dropdown, else - dropup
    var DROPDOWN_MAX_TOP_OFFSET = 200;

    /**
     * returns position from placeholder
     *
     * @private
     * @param {Node} placeholder
     * @param {Boolean} isAirMode
     * @return {Object}
     * @return {Number} return.left
     * @return {Number} return.top
     */
    var posFromPlaceholder = function (placeholder, isAirMode) {
      var $placeholder = $(placeholder);
      var pos = isAirMode ? $placeholder.offset() : $placeholder.position();
      var width = $placeholder.outerWidth(true); // include margin
      
      // popover below placeholder.
      return {
        left: pos.left + width / 2,
        top: pos.top
      };
    };

    /**
     * Regenerate Position of Popover
     *
     * @private
     * @param {jQuery} popover
     * @param {Position} pos
     */
    var regeneratePosition = function ($popover, pos) {
      var wndWidth = $(window).width();

      // get popover sizes
      $popover.css({
        display: 'block',
        left: POPOVER_MAX_L_OFFSET,
        top: POPOVER_MAX_T_OFFSET
      });
      var popoverWidth = $popover.outerWidth();
      var popoverHeight = $popover.outerHeight();
      $popover.css('display', 'none');

      // set new position
      pos.left = pos.left - popoverWidth / 2;

      // when popover top < POPOVER_MAX_T_OFFSET - regenerate position
      if (pos.top - popoverHeight < POPOVER_MAX_T_OFFSET) {
        $popover.removeClass('top').addClass('bottom');
        pos.top = pos.top + 13;
      } else {
        $popover.removeClass('bottom').addClass('top');
        pos.top = pos.top - popoverHeight;
      }

      // when popover left < 0 and right > window width - regenerate position
      var oldLeft = pos.left;
      if (pos.left < POPOVER_MAX_L_OFFSET) {
        pos.left = POPOVER_MAX_L_OFFSET;
      } else if (pos.left + popoverWidth > (wndWidth - POPOVER_MAX_R_OFFSET * 2)) {
        pos.left = (wndWidth - POPOVER_MAX_R_OFFSET * 2) - popoverWidth;
      }

      // fix dropdowns
      var $dropdowns = $popover.find('.dropdown-menu').parent('.btn-group');
      if (pos.top < DROPDOWN_MAX_TOP_OFFSET) {
        $dropdowns.removeClass('dropup');
      } else {
        $dropdowns.addClass('dropup');
      }

      // fix arrow position
      var arrowMarginLeft = PX_POPOVER_ARROW_OFFSET_X + oldLeft - pos.left;
      $popover.find('> .arrow').css('margin-left', arrowMarginLeft);
      return pos;
    };

    /**
     * show popover
     *
     * @private
     * @param {jQuery} popover
     * @param {Position} pos
     */
    var showPopover = function ($popover, pos) {
      pos = regeneratePosition($popover, pos);

      $popover.css({
        display: 'block',
        left: pos.left,
        top: pos.top
      });
    };

    /**
     * update current state
     * @param {jQuery} $popover - popover container
     * @param {Object} styleInfo - style object
     * @param {Boolean} isAirMode
     */
    this.update = function ($popover, styleInfo, isAirMode) {
      button.update($popover, styleInfo);
      var isBtnPopover = styleInfo.anchor && /btn/g.test(styleInfo.anchor.className);
      var isCollapsed = styleInfo.range.isCollapsed();
      var isLink = isCollapsed && styleInfo.anchor && !isBtnPopover;

      var $linkPopover = $popover.find('.note-link-popover');
      if (isLink) {
        var $anchor = $linkPopover.find('a');
        var href = $(styleInfo.anchor).attr('href');
        var target = $(styleInfo.anchor).attr('target');
        $anchor.attr('href', href).html(href);
        if (!target) {
          $anchor.removeAttr('target');
        } else {
          $anchor.attr('target', '_blank');
        }
        showPopover($linkPopover, posFromPlaceholder(styleInfo.anchor, isAirMode, styleInfo));
      } else {
        $linkPopover.hide();
      }

      var $buttonPopover = $popover.find('.note-button-popover');
      if (isBtnPopover) {
        var btnPos = posFromPlaceholder(styleInfo.anchor, isAirMode, styleInfo);
        showPopover($buttonPopover, btnPos);
      } else {
        $buttonPopover.hide();
      }

      var $imagePopover = $popover.find('.note-image-popover');
      if (styleInfo.image) {
        showPopover($imagePopover, posFromPlaceholder(styleInfo.image, isAirMode, styleInfo));
      } else {
        $imagePopover.hide();
      }

      var $airPopover = $popover.find('.note-air-popover');
      if (isAirMode && !isBtnPopover && !isLink) {
        var rect = styleInfo.range.getClientRects();

        if (rect[0]) {
          // fix rect result
          var fixedWidthResult = 0;
          var fixedRightResult = 0;
          for (var k in rect) {
            if (typeof rect[k] === 'object') {
              if (rect[k].top === rect[0].top) {
                fixedWidthResult += rect[k].width;
                fixedRightResult = rect[k].right;
              } else {
                continue;
              }
            }
          }
          rect = {
            bottom: rect[0].bottom,
            height: rect[0].height,
            left: rect[0].left,
            top: rect[0].top,
            right: fixedRightResult,
            width: fixedWidthResult
          };

          var $b = $airPopover.find('button[data-name=bold]');
          var $i = $airPopover.find('button[data-name=italic]');
          var $mbrFonts = $airPopover.find('div[data-name=mbrFonts]');
          var $mbrFontSize = $airPopover.find('div[data-name=mbrFontSize]');
          var $mbrColor = $airPopover.find('button[data-name=mbrColor]');
          var $mbrAlign = $airPopover.find('button[data-name=mbrAlign]');
          // when selected text
          if (isCollapsed) {
            // hide B and I buttons
            $b.hide();
            $i.hide();
            // show fonts, colors and align buttons
            $mbrFonts.show();
            $mbrFontSize.show();
            $mbrColor.show();
            $mbrAlign.show();
          }
          // wneh none selection
          else {
            // show B and I buttons
            $b.show();
            $i.show();
            // hide fonts, colors and align buttons
            $mbrFonts.hide();
            $mbrFontSize.hide();
            $mbrColor.hide();
            $mbrAlign.hide();
          }

          var bnd = func.rect2bnd(rect);
          showPopover($airPopover, {
            left: Math.max(bnd.left + bnd.width / 2, 0),
            top: bnd.top
          });
        }
      } else {
        $airPopover.hide();
      }
    };

    /**
     * @param {Node} button
     * @param {String} eventName
     * @param {String} value
     */
    this.updateRecentColor = function (button, eventName, value) {
      button.updateRecentColor(button, eventName, value);
    };

    /**
     * hide all popovers
     * @param {jQuery} $popover - popover container
     */
    this.hide = function ($popover) {
      $popover.children().hide();
    };
  };

  return Popover;
});
