function createReservation(passenger, flight, saver) {
  var reservation = {
  	passengerInfomation: passenger,
    flightInfomation: flight
  };
  if (saver) {
    saver.saveReservation(reservation);
  }

  return reservation;
}

function ReservationSaver() {
  this.saveReservation = function(reservation) {
    //TODO 웹서비스와 연동한 예약정보 저장
    console.log('예약 정보 저장 프로세스');
  }
}
