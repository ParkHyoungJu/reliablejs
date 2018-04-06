# 자바스크립트 패턴과 테스트

## 5장 콜백 패턴

### 5.1 단위 테스트 

#### 5.1.1 콜백 함수를 사용한 코드의 작성과 테스팅

- 콜백은 나중에 실행할 부차 함수에 인자로 넣는 함수
- 특정 함수의 동작이 끝나고 다른 여러가지 함수를 호출 해야할때

```javascript
var Conference = Conference || {};
Conference.attendeeCollection = function() {
  var attendees = [];

  return {
    contains: function(attendee) {
      return attendees.indexOf(attendee) > -1;
    },
    add: function(attendee) {
      if (!this.contains(attendee)) {
        attendees.push(attendee);
      }
    },
    remove: function(attendee) {
      var index = attendees.indexOf(attendee);
      if (index > -1) {
        attendees.splice(index, 1);
      }
    },
    getCount: function() {
      return attendees.length;
    },

    iterate: function(callback) {
      // attendees의 각 attendee에 대해 콜백을 실행한다.
    }
  };
};
```

```javascript
describe('Conference.attendeeCollection', function() {
    
  describe('contains(attendee)', function() {
    // contains 테스트
  });
  describe('add(attendee)', function() {
    // add 테스트
  });
  describe('remove(attendee)', function() {
    // remove 테스트
  });

  describe('iterate(callback)', function() {
    var collection, callbackSpy;

    // 도우미 함수
    function addAttendeesToCollection(attendeeArray) {
      attendeeArray.forEach(function(attendee) {
        collection.add(attendee);
      });
    }

    function verifyCallbackWasExecutedForEachAttendee(attendeeArray) {
      // 각 원소마다 한번씩 스파이가 호출되었는지 확인한다
      expect(callbackSpy.calls.count()).toBe(attendeeArray.length);

      // 각 호출마다 spy에 전달한 첫 번째 인자가 해당 attendee인지 확인한다
      var allCalls = callbackSpy.calls.all();
      for (var i = 0; i < allCalls.length; i++) {
        expect(allCalls[i].args[0]).toBe(attendeeArray[i]);
      }
    }

    beforeEach(function() {
      collection = Conference.attendeeCollection();
      callbackSpy = jasmine.createSpy();
    });

    it('빈 콜렉션에서는 콜백을 실행하지 않는다', function() {
      collection.iterate(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    });

    it('원소가 하나뿐인 콜렉션은 콜백을 한번만 실행한다', function() {
      var attendees = [
        Conference.attendee('윤지', '김')
      ];
      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });

    it('콜렉션 원소마다 한번씩 콜백을 실행한다', function() {
      var attendees = [
        Conference.attendee('태희', '김'),
        Conference.attendee('정윤', '최'),
        Conference.attendee('유리', '성')
      ];
      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });
  });
});
```

#### 5.1.2 콜백 함수의 작성과 테스팅

```javascript
var attendees = Conference.attendeeCollection();

attendees.iterate(function(attendee){
    attendee.checkIn();
});
```

- 단위테스트의 어려움
- 디버깅의 어려움

```javascript
attendees.iterate(function doCheckIn(attendee){
    attendee.checkIn();
});
```



### 5.2 문제예방

#### 5.2.1 콜백 화살 눌러 펴기

```javascript
CallbackArrow = CallbackArrow || {};

CallbackArrow.rootFunction = function(){
    CallbackArrow.firstFunction(function(arg){
        // 첫번째 콜백 로직
        CallbackArrow.secondFunction(function(arg){
            // 두번째 콜백 로직
            CallbackArrow.thirdFunction(function(arg){
                // 세번째 콜백 로직
            });
        });
    });
};

CallbackArrow.firstFunction = function(callback1){
    callback1(arg);
};
CallbackArrow.secondFunction = function(callback2){
    callback2(arg);
};
CallbackArrow.thirdFunction = function(callback3){
    callback3(arg);
};
```

- 단위테스트의 어려움
- 가독성 저하
- 수정의 어려움



```javascript
CallbackArrow = CallbackArrow || {};

CallbackArrow.rootFunction = function(){
    CallbackArrow.firstFunction(CallbackArrow.firstCallback);
};
CallbackArrow.firstFunction = function(calback1){
    callback1(arg);
};
CallbackArrow.secondFunction = function(calback2){
    callback2(arg);
};
CallbackArrow.thirdFunction = function(calback3){
    callback3(arg);
};
CallbackArrow.firstCallback = function(){
    CallbackArrow.secondFunction(CallbackArrow.secondCallback);
};
CallbackArrow.secondCallback = function(){
    CallbackArrow.thirdFunction(CallbackArrow.secondCallback);
};
CallbackArrow.thirdCallback = function(){
    // 콜백 로직
};
```



#### 5.2.2 this를 조심하라

```javascript
var Conference = Conference || {};
Conference.checkedInAttendeeCounter = function() {
  var checkedInAttendees = 0;
  return {
    increment: function() {
      checkedInAttendees++;
    },
    getCount: function() {
      return checkedInAttendees;
    },
    countIfCheckedIn: function(attendee) {
      if (attendee.isCheckedIn()) {
        this.increment();
      }
    }
  };
};


var counter = Conference.checkedInAttendeeCounter();
counter.countIfCheckedIn(attendee);
```



```javascript
var Conference = Conference || {};

Conference.checkedInAttendeeCounter = function() {

  var checkedInAttendees = 0,
      self = {
        increment: function() {
          checkedInAttendees++;
        },
        getCount: function() {
          return checkedInAttendees;
        },
        countIfCheckedIn: function(attendee) {
          if (attendee.isCheckedIn()) {
            self.increment();
          }
        }
      };

  return self;
};
```