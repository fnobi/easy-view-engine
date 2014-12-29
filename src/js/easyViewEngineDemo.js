var opts = {
    hoge: 1,
    moge: 'hello.'
};

var template = $('#template-sample').html();
var $el = $(easyViewEngine(template, opts));
$(document.body).append($el);
