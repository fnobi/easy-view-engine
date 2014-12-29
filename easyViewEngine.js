var easyViewEngine = function (source, opts) {
    source = source || '';
    opts = opts || {};

    var regexp = /\{\{(=|if|endif):?([a-z_]*)\}\}/;
    var mark = -1;

    function esc (str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function processTag (index, command, target) {
        var value = '';
        if (command == '=') {
            value = opts[target] || '';
        } else if (command == 'if') {
            if (!opts[target]) {
                mark = index;
            }
        } else if (command == 'endif') {
            if (mark >= 0) {
                source = source.slice(0, mark) + source.slice(index);
                mark = -1;
            }
        }
        value = esc(value);
        source = source.replace(regexp, value);
    }

    var matchData;
    while (source.match(regexp)) {
        matchData = source.match(regexp);
        processTag(matchData.index, matchData[1], matchData[2]);
    }

    return source;
};

