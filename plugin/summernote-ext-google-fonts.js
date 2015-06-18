(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else {
		factory(window.jQuery);
	}
}(function ($) {
	// YOU NEED TO GET API KEY FROM console.developers.google.com'
	var apiKey = 'AIzaSyAXfLH-0yfKbOtO96GQELAjQOw71cWjJgo';

	var tmpl    = $.summernote.renderer.getTemplate();
	// var editor  = $.summernote.eventHandler.getEditor();
	
	var $select = false;
	var gFonts  = [];
	
	var checkGoogleFont = function (value) {
		if ($.inArray(value, gFonts) === -1) {
			gFonts.push(value);
			$('#summernoteGoogleFonts').attr('href', 'http://fonts.googleapis.com/css?family=' + gFonts.join('|'));
		}
	};

	// add plugin
	$.summernote.addPlugin({
		name: 'googleFonts',
		buttons: {
			googleFonts: function () {
				$.getJSON('https://www.googleapis.com/webfonts/v1/webfonts?key=' + apiKey, function (fonts) {
					var fontObj = [];
					$select = $('<select class="gFontSelect"></select>');
					$.each(fonts.items, function (index, font) {
						var fontCategory = font.category.toUpperCase();
						if (fontCategory in fontObj) {
							fontObj[fontCategory].push(font.family);
							var val = 'value="' + font.family + '"';
							var dataVal = 'data-value="' + font.family + '"';
							var dataVars = 'data-variants="' + font.variants.join(',') + '"';
							var curItem = '<option  data-event="selectFont" ' + val + ' ' + dataVal + ' ' + dataVars + '>' + font.family + '</option>';

							$select.find('optgroup[label="' + fontCategory + ' (Google Font)"]')
								.append(curItem);
						} else {
							fontObj[fontCategory] = [];
							$select.append('<optgroup label="' + fontCategory + ' (Google Font)"></optgroup>');
						}
					});
				});
				return tmpl.iconButton('fa fa-google', {
					title: 'Google Fonts',
					dropdown: '<ul id="googleFontsDropdown" class="dropdown-menu"></ul>',
					event: 'googleFonts',
					hide: true
				});
			}
		},
		events: {
			googleFonts: function (event) {
				var $dropdown = $(event.target).parent().find('.dropdown-menu');
				
				if ($('#summernoteGoogleFonts').length === 0) {
					$('head').append('<link rel="stylesheet" type="text/css" id="summernoteGoogleFonts" />');
				}
				
				$dropdown.html($select[0].outerHTML);
				
				$dropdown.find('.gFontSelect').select2({width: 200}).on('change', function (e) {
					$(e.added.element).trigger('click');
				});
			},
			selectFont: function (event, editor, layoutInfo, value) {
				console.info(value);
				
				checkGoogleFont(value);
				var $editable = layoutInfo.editable();
				
				editor.beforeCommand($editable);
				document.execCommand('fontName', false, value);
				
				$editable.css('font-family', value);
				editor.afterCommand($editable);
			}
		}
	});
}));