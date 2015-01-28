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

    function assertNest (type) {
        if (!nest.length || nest[nest.length - 1].type != type) {
            throw Error('parse error: unexpected end' + type);
        }
    }

    function processTag (index, matchLength, command, target) {
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
                flag: !!evl(opts, target),
                scope: source.slice(index + matchLength)
            });
        } else if (command == 'endif') {
            assertNest('if');
            lastNest = nest.pop();

            var scope = lastNest.scope.slice(0, index - source.length);
            var result = lastNest.flag ? easyViewEngine(scope, opts) : '';
            source = [
                source.slice(0, lastNest.index),
                result,
                source.slice(index)
            ].join('');
        }
        if (!raw) {
            value = esc(value);
        }
        source = source.replace(regexp, value);
    }

    var matchData;
    while (source.match(regexp)) {
        matchData = source.match(regexp);
        processTag(matchData.index, matchData[0].length, matchData[1], matchData[2]);
    }

    return source;
};
