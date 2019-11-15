$(function() {
    // ckeditor
    altair_wysiwyg._ckeditor();
    // ckeditor inline
    altair_wysiwyg._ckeditor_inline();
    // tinymce
    altair_wysiwyg._tinymce();
});

// wysiwyg editors
altair_wysiwyg = {
    _ckeditor: function() {
        var $ckEditor = $('#wysiwyg_ckeditor');
        if($ckEditor.length) {
            $ckEditor
                .ckeditor(function() {
                    /* Callback function code. */
                }, {
                    customConfig: '../../assets/js/custom/ckeditor_config.js'
                });
        }
    },
    _ckeditor_inline: function() {
        var $ckEditor_inline = $('#wysiwyg_ckeditor_inline');
        if($ckEditor_inline.length) {
            console.log($ckEditor_inline);
            $ckEditor_inline
                .ckeditor(function() {
                    /* Callback function code. */
                }, {
                    customConfig: '../../assets/js/custom/ckeditor_config.js',
                    allowedContent: true
                });
        }
    },
    _tinymce: function() {
        var $tinymce = '#wysiwyg_tinymce';
        if($($tinymce).length) {

            var mceElf = new tinymceElfinder({
                url: 'file_manager/php/connector.minimal.gallery.php',
                uiOptions : {
                    // toolbar configuration
                    toolbar : [
                        ['selectall', 'selectnone', 'selectinvert'],
                        ['quicklook', 'info'],
                        ['view', 'sort']
                    ]
                },
                ui: ['toolbar', 'tree', 'path', 'stat'],
                contextmenu : {
                    files  : [
                        'getfile', 'info'
                    ]
                },
                lang : 'en',
                uploadTargetHash: 'l1_Lw',
                nodeId: 'elfinder'
            });

            tinymce.init({
                // skin_url: 'assets/skins/tinymce/material_design',
                selector: "#wysiwyg_tinymce",
                height: 480,
                plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste"
                ],
                toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
                relative_urls: false,
                remove_script_host: false,
                file_picker_callback : mceElf.browser,
                images_upload_handler: mceElf.uploadHandler
            });

        }
    }
};