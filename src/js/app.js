require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: '//code.jquery.com/jquery-1.11.3',
    bootstrap: '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.4/js/bootstrap.min',
    spectrum: '//cdnjs.cloudflare.com/ajax/libs/spectrum/1.7.0/spectrum',
    summernotevideo: '/../../plugin/summernote-ext-video',
    mbrBtn: '/../../plugin/summernote-ext-mbr-button',
    mbrFonts: '/../../plugin/summernote-ext-mbr-fonts',
    mbrColor: '/../../plugin/summernote-ext-mbr-color',
    mbrLink: '/../../plugin/summernote-ext-mbr-link',
    mbrAlign: '/../../plugin/summernote-ext-mbr-align',
    mbrMultiline: '/../../plugin/summernote-ext-mbr-multiline',
    CodeMirror: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror',
    CodeMirrorXml: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.min',
    CodeMirrorFormatting: '//cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.min'
  },
  shim: {
    bootstrap: ['jquery'],
    spectrum: ['jquery'],
    CodeMirror: { exports: 'CodeMirror' },
    CodeMirrorXml: ['CodeMirror'],
    CodeMirrorFormatting: ['CodeMirror', 'CodeMirrorXml'],
    summernotevideo: ['summernote'],
    mbrBtn: ['summernote'],
    mbrFonts: ['summernote'],
    mbrColor: ['summernote', 'spectrum'],
    mbrLink: ['summernote'],
    mbrAlign: ['summernote'],
    mbrMultiline: ['summernote']
  },
  packages: [{
    name: 'summernote',
    location: './',
    main: 'summernote'
  }]
});

require([
  'jquery', 'bootstrap', 'spectrum', 'CodeMirrorFormatting',
  'summernote', 'summernotevideo',
  'mbrBtn', 'mbrFonts', 'mbrColor', 'mbrLink', 'mbrAlign', 'mbrMultiline'
], function ($) {
  // summernote
  $('.summernote').summernote({
    height: 300,                  // set editable area's height
    focus: true,                  // set focus editable area after summernote loaded
    tabsize: 2,                   // size of tab
    placeholder: 'Type your message here...', // set editable area's placeholder text
    codemirror: {                 // code mirror options
      mode: 'text/html',
      htmlMode: true,
      lineNumbers: true,
      theme: 'monokai'
    }
  });

  // air mode
  $('.summernote-air').summernote({
    airMode: true,
    airPopover: [
      ['font', ['bold', 'italic']],
      // ['link', ['link']],
      ['mbrLink', ['mbrLink']],
      ['mbrAlign', ['mbrAlign']],
      // ['color', ['color']],
      ['mbrFonts', ['mbrFonts', 'mbrFontSize', 'mbrColor']]
    ]
  });
});