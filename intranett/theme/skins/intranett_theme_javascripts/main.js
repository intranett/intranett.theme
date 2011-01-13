/* The following line defines gliobal variables defined elsewhere. */
/*global jQuery:false, document: false, window: false*/

(function ($) {
    $(function () {
        jQuery.fn.jBreadCrumb.defaults.endElementsToLeaveOpen = 2;
        jQuery.fn.jBreadCrumb.defaults.beginingElementsToLeaveOpen = 2;
        jQuery.fn.jBreadCrumb.defaults.maxFinalElementLength = 300;
        jQuery.fn.jBreadCrumb.defaults.previewWidth = 15;
        $('#portal-breadcrumbs').jBreadCrumb();

        // Equal height for frontpage promo blocks
        var heightEqualizer = function (elems, base_height) {
            if (elems.eq(0).hasClass('equalized')) {
                return false;
            }
            if (base_height === 0) {
                base_height = Math.max.apply(null, elems.map(function () {
                    return $(this).height();
                }).get());
                elems.height(base_height);
                elems.each(function () {
                    if ($(this).find('img').length === 0) {
                        $(this).addClass('equalized');
                    }
                });
            }
            else {
                // if we pass base_height we make inner elements fill the
                // whole height
                $(elems).each(function () {
                    var outerStuff, elemHeight;
                    outerStuff = $(this).outerHeight(true) - $(this).height();
                    elemHeight = base_height - outerStuff;
                    $(this).height(elemHeight);
                });
            }
            return base_height;
        };

        $('.photoAlbumEntryRow').each(function () {
            heightEqualizer($(this).find('.photoAlbumEntry'), 0);
        });

        heightEqualizer($('dl.portalMessage dt, dl.portalMessage dd'), 0);

        $('#settings-toggle a').click(function (event) {
            event.stopPropagation();
            $('#contentviews-wrapper, #contentviews-wrapper + .contentActions').animate({
                height: ['toggle', 'swing'],
                opacity: 'toggle'
            }, 200, 'linear', function () {
                var isHidden = $('#open-edit-bar').is(':hidden');
                if (isHidden) {
                    $('#open-edit-bar').delay(0).fadeIn(200);
                    document.cookie = 'editbar_opened=0; expires=Fri, 27 Jul 2001 02:47:11 UTC; path=/';
                } else {
                    $('#open-edit-bar').delay(0).fadeOut(200); // delay in order to have both elements animated (contentMenus & contentActions) before we transform the button
                    document.cookie = 'editbar_opened=1; expires=0; path=/';
                }
            });
            return false;
        });
        // $("table.listing tr").hover(
        //     function () {
        //         $(this).addClass("visualHighlight");
        //     },
        //     function () {
        //         $(this).removeClass("visualHighlight");
        //     }
        // );
        $('#form-buttons-comment').addClass('allowMultiSubmit');
        $("a[class='form.button.DeleteComment']").live('click', function () {
            var trigger, form, data, form_url;
            trigger = this;
            form = $(this).parents('form');
            data = $(form).serialize();
            form_url = $(form).attr('action');
            $.ajax({
                type: 'POST',
                url: form_url,
                context: $(trigger).parents('.comment'),
                success: function (data) {
                    if ($('.discussion .comment').length === 1) {
                        $('.discussion').fadeOut('fast', function () {
                            $('.discussion').remove();
                        });
                    }
                    else {
                        $(this).fadeOut('fast', function () {
                            $(this).remove();
                        });
                    }
                },
                error: function (req, error) {
                    return true;
                }
            });
            return false;
        });
        $("a[class='form.button.PublishComment']").live('click', function () {
            var trigger, form, data, form_url;
            trigger = this;
            form = $(this).parents('form');
            data = $(form).serialize();
            form_url = $(form).attr('action');
            $.ajax({
                type: 'GET',
                url: form_url,
                data: 'workflow_action=publish',
                context: trigger,
                success: function (msg) {
                    // fade out row
                    $(this).parents('li').fadeOut('normal', function () {
                        $(this).parents('li').remove();
                    });
                },
                error: function (msg) {
                    return true;
                }
            });
            return false;
        });
        $('#commenting form#form').submit(function () {
            var button, data, form_url;
            button = $('#commenting form#form .formControls input.submitting');
            $(button).attr('disabled', 'disabled');

            data = $('#commenting form#form').serialize() + '&' + $(button).attr('name') + '=' + $(button).attr('value');
            form_url = $(this).attr('action');
            $(this).get(0).reset();
            $.ajax({
                type: 'POST',
                url: form_url,
                data: data,
                success: function (data) {
                    var new_comment, jqobj;
                    jqobj = $(data);
                    if ($('.discussion').length > 0) {
                        new_comment = $(jqobj).find('.discussion .comment:last-child');
                        $(new_comment).hide();
                        $('.discussion').append(new_comment);
                    } else {
                        new_comment = $(jqobj).find('.discussion');
                        $(new_comment).hide();
                        $(new_comment).insertBefore('#commenting');
                    }
                    $(new_comment).fadeIn('slow');
                    $(button).removeAttr('disabled');
                },
                error: function (req, error) {
                    return true;
                }
            });
            return false;
        });
    });
}(jQuery));
