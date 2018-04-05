# 자바스크립트 패턴과 테스트

## 6장 프라미스 패턴

### 6.1 단위 테스트

#### 6.1.1 프라미스 사용법

- 프라미스는 비동기 처리시 사용되는 객체
- 성공 콜백과 실패 콜백

```javascript
var Conference = Conference || {};

Conference.checkInService = function(checkInRecorder) {
    
  // 주입한 checkInRecorder의 참조값을 보관한다
  var recorder = checkInRecorder;

  return {
    checkIn: function(attendee) {
      attendee.checkIn();
      recorder.recordCheckIn(attendee).then(
        // 성공
        attendee.setCheckInNumber,
        // 실패
        attendee.undoCheckIn);
    }
  };
};

```

```javascript
describe('Conference.checkInService', function() {
  'use strict';

  var checkInService,
      checkInRecorder,
      attendee;

  beforeEach(function() {
    checkInRecorder = Conference.checkInRecorder();
    checkInService = Conference.checkInService(checkInRecorder);
    attendee = Conference.attendee('형철', '서');
  });

  describe('checkInService.checkIn(attendee)', function() {

    describe('checkInRecorder 성공 시', function() {
      var checkInNumber = 1234;
      beforeEach(function() {
        spyOn(checkInRecorder,'recordCheckIn').and.callFake(function() {
          return Promise.resolve(checkInNumber);
        });
      });

      // 5장과 동일한 테스트
      it('참가자를 체크한 것으로 표시한다', function() {
        checkInService.checkIn(attendee);
        expect(attendee.isCheckedIn()).toBe(true);
      });
      it('체크인을 등록한다', function() {
        checkInService.checkIn(attendee);
        expect(checkInRecorder.recordCheckIn).toHaveBeenCalledWith(attendee);
      });

      // 6장에서 추가된 테스트
      it("참가자의 checkInNumber를 지정한다", function(done) {
        checkInService.checkIn(attendee);
        expect(attendee.getCheckInNumber()).toBe(checkInNumber);
      });
    });
  });
});
```

- setCheckInNumber의 늦은 호출



```javascript
it("참가자의 체크인 번호를 세팅한다.", function(done) {
    checkInService.checkIn(attendee).then(
        function promiseResolved() {
            expect(attendee.getCheckInNumber()).toBe(checkInNumber);
            done();
        },
        function promiseRejected() {
            expect('이 실패 분기 코드가 실행됐다').toBe(false);
            done();
        });
});
```



#### 6.1.2 프라미스 생성과 반환

```javascript
var Conference = Conference || {};

Conference.checkInRecorder = function() {
    
  var messages = {
    mustBeCheckedIn: '참가자는 체크인된 것으로 표시되어야 한다.',
  };

  return {
    getMessages: function() {
      return messages;
    },

    recordCheckIn: function(attendee) {
      return new Promise( function(resolve, reject) {
        if (attendee.isCheckedIn()) {
          resolve(4444); // 일단, 아무 숫자나 넣는다.
        } else {
          reject(new Error(messages.mustBeCheckedIn));
        }
      });
    }
  };
};

```



#### 6.1.3 XMLHttpRequest 테스팅



```javascript
 describe('Conference.checkInRecorder', function() {
  'use strict';

  var attendee, checkInRecorder;
  beforeEach(function() {
    attendee = Conference.attendee('일웅','이');
    attendee.setId(777);
    checkInRecorder = Conference.checkInRecorder();

    // 재스민의 모의 XMLHttpRequest 라이브러리를 설치한다.
    jasmine.Ajax.install();
  });

  afterEach(function() {
    // 다 끝난 후에는 원래 XMLHttpRequests로 돌려놓는다.
    jasmine.Ajax.uninstall();
  });

  describe('recordCheckIn(attendee)', function() {

    it('HTTP 요청이 성공하여 참가자가 체크인되면 체크인 번호로 이루어진 프라미스를 반환한다', function() {
      var expectedCheckInNumber = 1234,
          request;
      attendee.checkIn();
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          expect(actualCheckInNumber).toBe(expectedCheckInNumber);
          done();        },
        function promiseRejected() {
          expect('프라미스는 버려졌다').toBe(false);
        });
       request = jasmine.Ajax.requests.mostRecent();
       expect(request.url).toBe('/checkin/' + attendee.getId());
       request.response({
         "status": 200,
         "contentType": "text/plain",
         "responseText": expectedCheckInNumber
       });
    });

    it('HTTP 요청이 실패하여 참가자가 체크인되지 않으면 정확한 메시지와 함께 버림 프라미스를 반환한다', function() {
      var request;
      attendee.checkIn();
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved(actualCheckInNumber) {
          expect('프라미스는 귀결됐다').toBe(false);
        },
        function promiseRejected(reason) {
          expect(reason instanceof Error).toBe(true);
          expect(reason.message)
            .toBe(checkInRecorder.getMessages().httpFailure);
        });
       request = jasmine.Ajax.requests.mostRecent();
       expect(request.url).toBe('/checkin/' + attendee.getId());
       request.response({
         "status": 404,
         "contentType": "text/plain",
         "responseText": "이래서 에러가 났습니다."
       });
    });

    it('참가자가 체크인되지 않으면 에러와 버림 프라미스를 반환한다', function(done) {
      checkInRecorder.recordCheckIn(attendee).then(
        function promiseResolved() {
          expect('프라미스는 귀결됐다').toBe(false);
          done();
        },
        function promiseRejected(reason) {
          expect(reason instanceof Error).toBe(true);
          expect(reason.message)
            .toBe(checkInRecorder.getMessages().mustBeCheckedIn);
          done();
        });
    });
  });
});
```



### 6.2 프라미스 체이닝

```javascript
checkInService.checkIn(attendee)
  .then(
    function onCheckInResolved(checkInNUmber){
        return badgePrintingService.print(checkInNumber);
    })
  .then(
    function onBadgePrintResolved(badgeNumber){
        return doorPrizeEnteringService.enter(attendee, badgeNumber);
    });
```



### 6.3 프라미스 래퍼

- 앵귤러JS의 $q나 크리스 코왈의 Q 같은 프라미스 래퍼를 이용하면 단위테스트에서 귀결/버림을 더 효과적으로 다룰 수 있다.

### 6.4 상태와 숙명

##### 상태

- Pending(대기) : 비동기 처리 로직이 아직 완료되지 않은 상태

  ```javascript
  new Promise();

  new Promise(function (resolve, reject) {
    // ...
  });
  ```

- Fulfilled(이행) : 비동기 처리가 완료되어 프로미스가 결과 값을 반환해준 상태

  ```javascript
  new Promise(function (resolve, reject) {
    resolve();
  });
  ```

- Rejected(실패) : 비동기 처리가 실패하거나 오류가 발생한 상태

  ```javascript
  new Promise(function (resolve, reject) {
    reject();
  });
  ```

  ​

##### 숙명

- resolved(귀결)
- unresolved(미결)



