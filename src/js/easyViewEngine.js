var easyViewEngine = function (source, opts) {
    source = source || '';
    opts = opts || {};

    var regexp = /\{\{(-|=|if|endif):?([a-zA-Z\._]*)\}\}/;
    var nest = [];

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
        var lastNest = null;
        var undef;
        if (command == '=') {
            value = evl(opts, target);
        } else if (command == '-') {
            value = evl(opts, target);
            raw = true;
        } else if (command == 'if') {
            nest.push({
                index: index,
                type: 'if',
                flag: !!evl(opts, target)
            });
        } else if (command == 'endif') {
            if (!nest.length || nest[nest.length - 1].type != 'if') {
                throw Error('parse error: unexpected endif');
            }
            lastNest = nest.pop();
            if (!lastNest.flag) {
                source = source.slice(0, lastNest.index) + source.slice(index);
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
