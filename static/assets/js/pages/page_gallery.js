$(function() {

    var $grid = $('#galleryGrid');
    $grid.waitForImages(function() {
        console.log('All images have loaded.');
        var grid = UIkit.grid($grid, {
            gutter: 16
        });
    });

    var $customModal = $('#custom-ligthbox');
    if($customModal.length) {
        var lightbox = UIkit.modal('#custom-ligthbox', {
                center: true
            });

        $('.custom-modal-open').on('click', function(e) {
            e.preventDefault();
            $(this).addClass('jQ-lightbox-triggered');

            var imageId = $(this).attr('data-image-id'),
                $invoice_template = $('#lightbox-template-content'),
                template = $invoice_template.html(),
                template_compiled = Handlebars.compile(template),
                context = {
                    'img': lightbox_data[imageId].img,
                    'user_avatar': lightbox_data[imageId].user_avatar,
                    'user_name': lightbox_data[imageId].user_name,
                    'comment': lightbox_data[imageId].comment
                },
                theCompiledHtml = template_compiled(context);

            $('#lightbox-content').html(theCompiledHtml);

            lightbox.show();
        });

        $customModal.on('click','.uk-slidenav-previous',function(e) {
            e.preventDefault();
            var $prev = $grid.find('.jQ-lightbox-triggered').closest('.md-card').parent('div').prev('div').find('.custom-modal-open');
            if($prev.length) {
                lightbox.hide();
                setTimeout(function() {
                    $prev.trigger('click')
                }, 300)
            }
        });
        $customModal.on('click','.uk-slidenav-next',function(e) {
            e.preventDefault();
            var $next = $grid.find('.jQ-lightbox-triggered').closest('.md-card').parent('div').next('div').find('.custom-modal-open');
            if($next.length) {
                lightbox.hide();
                setTimeout(function() {
                    $next.trigger('click')
                }, 300)
            }
        });

        $customModal.on({
            'hide.uk.modal': function(){
                $grid.find('.jQ-lightbox-triggered').removeClass('jQ-lightbox-triggered')
            }
        });

    }

});