$(function() {
    // filemanager
    $('#fileManager').elfinder({
        uiOptions : {
            // toolbar configuration
            toolbar : [
                ['home', 'back', 'forward', 'up', 'reload'],
                // ['netmount'],
                // ['mkdir', 'mkfile', 'upload'],
                ['open', 'download', 'getfile'],
                ['undo', 'redo'],
                // ['copy', 'cut', 'paste', 'rm', 'empty', 'hide'],
                // ['duplicate', 'rename', 'edit', 'resize', 'chmod'],
                ['selectall', 'selectnone', 'selectinvert'],
                ['quicklook', 'info'],
                // ['extract', 'archive'],
                ['search'],
                ['view', 'sort'],
                [/*'preference',*/'help'],
                ['fullscreen']
            ]
        },
        ui: ['toolbar', 'tree', 'path', 'stat'],
        contextmenu : {
            files  : [
                'getfile', '|','open', 'quicklook', '|', 'download', '|', 'copy', 'cut', 'duplicate','|', 'info'
            ]
        },
        lang : 'en',
        height: $('body').height() - 140,
        url : 'file_manager/php/connector.minimal.php'  // connector URL (REQUIRED)
    });
});