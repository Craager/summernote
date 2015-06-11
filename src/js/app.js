require.config({
  baseUrl: 'src/js',
  paths: {
    jquery: '//code.jquery.com/jquery-1.11.3',
    bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min',
    summernotevideo: '/../../plugin/summernote-ext-video',
    mbrBtn: '/../../plugin/summernote-ext-mbr-button',
    CodeMirror: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror',
    CodeMirrorXml: '//cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.min',
    CodeMirrorFormatting: '//cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.min'
  },
  shim: {
    bootstrap: ['jquery'],
    CodeMirror: { exports: 'CodeMirror' },
    CodeMirrorXml: ['CodeMirror'],
    CodeMirrorFormatting: ['CodeMirror', 'CodeMirrorXml'],
    summernotevideo: ['summernote'],
    mbrBtn: ['summernote']
  },
  packages: [{
    name: 'summernote',
    location: './',
    main: 'summernote'
  }]
});

require([
  'jquery', 'bootstrap', 'CodeMirrorFormatting',
  'summernote', 'summernotevideo', 'mbrBtn'
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
  $('.summernote-air:not(.btn)').summernote({
    airMode: true,
    airPopover: [
      ['color', ['color']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']]
    ]
  });
  $('.summernote-air.btn').summernote({
    airMode: true,
    airPopover: [
      ['insert', ['link', 'mbrBtnAdd'], ['mbrBtnRemove'], ['mbrBtnColor']],
      ['mbrBtnColor', ['mbrBtnColor']],
      ['mbrBtnRemove', ['mbrBtnRemove']]
    ]
  });
});