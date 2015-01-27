var easyViewEngine = function (source, opts) {
    source = source || '';
    opts = opts || {};

    var regexp = /\{\{(-|=|if|endif):?([a-zA-Z\._]*)\}\}/;
    var mark = -1;

    function esc (str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function evl (ctx, key) {
        var undef;
        if (key.indexOf('.') >= 0) {
            var parts = key.split('.');
            return evl(ctx[parts[0]], parts[1]);
        }
        if (!ctx || ctx[key] === undef) {
            return '';
        }
        return ctx[key];
    }

    function processTag (index, command, target) {
        var value = '';
        var raw = false;
        var undef;
        if (command == '=') {
            value = evl(opts, target);
        } else if (command == '-') {
            value = evl(opts, target);
            raw = true;
        } else if (command == 'if') {
            if (!evl(opts, target)) {
                mark = index;
            }
        } else if (command == 'endif') {
            if (mark >= 0) {
                source = source.slice(0, mark) + source.slice(index);
                mark = -1;
            }
        }
        if (!raw) {
            value = esc(value);
        }
        source = source.replace(regexp, value);
    }

    var matchData;
    while (source.match(regexp)) {
        matchData = source.match(regexp);
        processTag(matchData.index, matchData[1], matchData[2]);
    }

    return source;
};
