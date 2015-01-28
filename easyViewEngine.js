var easyViewEngine = function (source, opts) {
    source = source || '';
    opts = opts || {};

    var regexp = /\{\{(-|=|if|endif|each|endeach):?([a-zA-Z\._]*)(:[a-zA-Z_]+)?\}\}/;
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

    function processTag (index, matchLength, command, target, holder) {
        var value = '';
        var raw = false;
        var lastNest = null;
        var scope, result;
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

            scope = lastNest.scope.slice(0, index - source.length);
            result = lastNest.flag ? easyViewEngine(scope, opts) : '';
            source = [
                source.slice(0, lastNest.index),
                result,
                source.slice(index)
            ].join('');
        } else if (command == 'each') {
            nest.push({
                index: index,
                type: 'each',
                scope: source.slice(index + matchLength),
                ctx: evl(opts, target),
                holder: holder.slice(1)
            });
        } else if (command == 'endeach') {
            assertNest('each');
            lastNest = nest.pop();

            scope = lastNest.scope.slice(0, index - source.length);
            result = '';
            for (var i = 0; i < lastNest.ctx.length; i++) {
                (function () {
                    var ctx = opts;
                    ctx[lastNest.holder] = lastNest.ctx[i];
                    result += easyViewEngine(scope, ctx);
                })();
            }
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
        processTag(
            matchData.index,
            matchData[0].length,
            matchData[1],
            matchData[2],
            matchData[3]
        );
    }

    return source;
};
