define(function(require) {
    var base64 = require('xAPI/base64');

    describe('[base64]', function() {
        var decodeString, encodeString;
        it('should be defined', function() {
            expect(base64).toBeDefined();
        });

        beforeEach(function () {
            decodeString = 'some string@';
            encodeString = 'c29tZSBzdHJpbmdA';
        });

        describe('encode:', function () {

            it('should be defined', function() {
                expect(base64.encode).toBeDefined();
            });

            it('should return encode string', function () {
                var result = base64.encode(decodeString);
                expect(result).toBe(encodeString);
            });

        });

        describe('decode:', function() {
            it('should be defined', function () {
                expect(base64.decode).toBeDefined();
            });

            it('should return encode string', function () {
                var result = base64.decode(encodeString);
                expect(result).toBe(decodeString);
            });
        });
        
    });
})