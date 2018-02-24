describe('createReservation(passenger, flight)', function(){
    // it()은 개별 단위 테스트를 위한 Jasmine의 함수
    it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다', function(){
        var testPassenger = {
            firstName: '윤지',
            lastName: '김'
        };

        var testFlight = {
            number: '3443',
            carrier: '대한항공',
            destination: '울산'
        };

        var reservation = createReservation(testPassenger, testFlight);
        expect(reservation.passengerInfo).toBe(testPassenger);
    });

    it('주어진 flight를 flightInfo 프로퍼티에 할당한다', function(){
        var testPassenger = {
            firstName: '윤지',
            lastName: '김'
        };

        var testFlight = {
            number: '3443',
            carrier: '대한항공',
            destination: '울산'
        };

        var reservation = createReservation(testPassenger, testFlight);
        expect(reservation.flightInfo).toBe(testFlight);
    });
});

/*
 * createReservation 함수에 대한 단위 테스트가 총 2개 존재
 * 위 두 단위 테스트에 중복된 코드는 DRY 원칙을 위반하고 있다.
 */
