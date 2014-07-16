define(['models/answer'], function (AnswerModel) {

    describe('model [answer]', function () {

        it('should be defined', function () {
            expect(AnswerModel).toBeDefined();
        });

        var answer;
        var spec = {
            id: 'id',
            text: 'title',
            isCorrect: false
        };

        beforeEach(function () {
            answer = new AnswerModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(answer.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(answer.id).toBe(spec.id);
            });
        });

        describe('text:', function () {
            it('should be defined', function () {
                expect(answer.text).toBeDefined();
            });

            it('should be equal to spec text', function () {
                expect(answer.text).toBe(spec.text);
            });
        });

        describe('isCorrect:', function () {
            it('should be defined', function () {
                expect(answer.isCorrect).toBeDefined();
            });

            it('should be equal to spec isCorrect', function () {
                expect(answer.isCorrect).toBe(spec.isCorrect);
            });
        });
        
        describe('isChecked:', function () {
            it('should be defined', function () {
                expect(answer.isChecked).toBeDefined();
            });

            it('should be false', function () {
                expect(answer.isChecked).toBeFalsy();
            });
        });

    });
});