# easy-view-engine

Simple template engine for web front end.

## install

```
bower install easy-view-engine
```

## demo

http://fnobi.github.io/easy-view-engine/demo/

## usage

```javascript
function generateLink () {
    var opts = {
        url: $('#input-url').val(),
        text: $('#input-text').val()
    };

    var template = $('#template-sample').html();
    var $el = $(easyViewEngine(template, opts));
    $(document.body).append($el);
}

$('#generator').on('submit', function (e) {
    e.preventDefault();
    generateLink();
});

generateLink();

```
