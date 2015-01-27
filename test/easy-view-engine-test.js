var expect = chai.expect;

describe('easy-view-engine', function () {
    it('extend variable', function () {
        var src = '{{=:hoge}}{{=:moge}}';
        var param = {
            hoge: 1,
            moge: 2
        };
        var result = easyViewEngine(src, param);
        expect(result).to.equal('12');
    });
    it('handle if statement', function () {
        var src = '{{if:hoge}}hoge{{endif:hoge}}{{if:moge}}moge{{endif:moge}}';
        var param = {
            hoge: true
        };
        var result = easyViewEngine(src, param);
        expect(result).to.equal('hoge');
    });
    it('use escape variable and raw variable', function () {
        var src = '{{=:html}}{{-:html}}';
        var param = {
            html: '<a href="http://fnobi.com/">fnobi.com</a>'
        };
        var result = easyViewEngine(src, param);
        expect(result).to.equal('&lt;a href=&quot;http://fnobi.com/&quot;&gt;fnobi.com&lt;/a&gt;<a href="http://fnobi.com/">fnobi.com</a>');
    });
    it('extend sub object', function () {
        var src = '{{=:hoge.moge}}';
        var param = {
            hoge: {
                moge: 1
            }
        };
        var result = easyViewEngine(src, param);
        expect(result).to.equal('1');
    });
});
