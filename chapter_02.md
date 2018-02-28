# 자바스크립트 패턴과 테스트

## 2장 도구 다루기

### 2.1 테스팅 프레임워크

#### 여행사의 예약 시스템 중 예약 생성 모듈

TDD 없이 작성한 createReservation 모듈

```javascript
function createReservation(passenger, flight) {
    return {
        passengerInfo: passenger,
        flightInfo: flight
    };
}
```

[Jasmine](https://jasmine.github.io/)을 통한 테스트 대상을 완성한 다음 작성한 createReservation 테스트 코드

```javascript
describe('createReservation(passenger, flight)', function(){
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
```

[example](https://github.com/eddie-yim/reliablejs/blob/master/sources/chapter_01/example_jasmine.html)

#### 2.1.1 잘못된 코드 발견하기

- TDD는 코드 결함을 최대한 빨리, 코드 생성 직후 감지
- 작은 기능 하나라도 **테스트를 먼저 작성**
- 최소한의 코드만으로 기능을 구현
- 리팩토링으로 중복 제거

**함수마다 일일이 테스트를 만들어 기능을 붙이는 것이 절대 시간 낭비가 아니다. 이를 통해 디버깅 시간을 단축한 사례가 많다.**

#### 2.1.2  테스트성을 감안하여 설계하기

+ 코드의 테스트성(testability)를 주요 관심사로 생각하라!
+ 코드의 테스트 용이성과 테스트 진행 정도는 직접적인 상관관계가 있다.
+ 테스트성을 목표로 하면 **SOLID**한 코드를 작성하게 된다.

createReservation 에 웹 서비스 연동 기능이 추가된다고 한다면
```javascript
describe('createReservation(passenger, flight)', function(){
    // Existing test
    it('예약 정보를 웹 서비스 종단점으로 전송한다', function(){
    	// createReservation이 웹 서비스 통신까지 맡아야 하나? 
    });
});
```

서비스 통신 전담 객체가 만들어 테스트 하는 편이 바람직하다.

코드 테스트성을 극대화하면 SOLID 원칙을 어긴 코드를 쉽게 솎아낼 수 있다.

#### 2.1.3 꼭 필요한 코드만 작성하기

**리팩토링을 통한 중복제거로 꼭 필요한 코드만 남긴다**

#### 2.1.4 안전한 유지 보수와 리팩토링

+ TDD 실천으로 확실한 단위 테스트 꾸러미 구축(Unit Test Suite)
+ 이는 회귀 결함(Registration Defect)에 대한 재발 비용(Recurring Cost)를 줄이는 보험
+ 종합적 단위 테스트 꾸러미가 마련되면 확장/보수에 안정적일 수 있다.

#### 2.1.5 실행 가능한 명세

+ TDD를 바탕으로한 단위 테스트 꾸러미는 테스트 대상 코드의 **실행 가능한 명세(Runnable Specification)** 역할을 한다.
+ 코드 분석 없이 테스트 메시지로 함수의 기능 파악이 가능해진다.

#### 2.1.6 최신 오픈 소스 및 상요 프레임워크

+ [QUnit](https://qunitjs.com/): jQuery의 [John Resig](https://en.wikipedia.org/wiki/John_Resig)이 개발
+ [D.O.H](https://dojotoolkit.org).: Alex Russel이 주도하는 Dojo Toolkit Community에서 개발

#### 2.1.7  Jasmine 들어가기

**TODO**

### 2.2 의존성 주입 프레임워크

#### 2.2.1 의존성 주입이란?

```javascript
Attendee = function(attendeeId) {// TODO Linting
    
    // 'new'로 생성하도록 강제한다.
    if (!(this instanceof Attendee)) {
        return new Attendee(attendeeId);
    }
    
    this.attendeeId = attendeeId;
    
    this.service = new ConferenceWebSvc();
    this.messenger = new Messenger();
};

// 주어진 세션에 좌석 예약을 시도한다.
// 성공/실패 여부를 메시지로 알려준다.
Attendee.prototype.reserve = function(sessionId) {
    if (this.service.reserve(this.attendeeId, sessionId)) {
        this.messenger.success(
            '좌석 예약이 완료되었습니다!'
            + ' 고객님은 ' + this.service.getRemainingReservation()
            + ' 좌석을 추가 예약하실 수 있습니다.');
    } else {
        this.messenger.failure('죄송합니다. 해당 죄석은 예약하실 수 없습니다.');
    }
}
```

**코드의 문제점과 해결**

Attendee의 함수 클래스 안에 함수 클래스 ConferenceWebSvc와 함수 클래스 Messenger를 인스턴스화(instantiate)하는 코드가 존재한다. 이로 인해 Attendee 함수 클래스는 ConferenceWebSvc 함수 클래스와  Messenger 함수 클래스의 변경에 대해 상당히 영향을 강하게 받게 된다. 즉, Attendee 함수 클래스가 ConferenceWebSvc, Messenger 함수 클래스의 강한 의존성, 강한 결합을 이루게 된다. 이는 개별 함수 클래스의 독립적 기능을 방해하는 요인이 된다.

이에 대해 인스턴스화 코드를 제거하고, 실행 시점에 Attendee 함수 클래스 바깥 쪽에서 ConferenceWebSvc와 Messenger 함수 클래스의 인스턴스를 생성하여 파라미터로 넘겨 받아 참조하는 방식을 취하여 의존성을 낮춘다.

또한 이로 인해 service, messenger의 역할은 주입 상위 주체인 Attendee가 아니라 Attendee 함수 클래스에 각각 주입된 ConferenceWebSvc와 Messenger에게 온전히 넘어간다. 이를 제어의 역전(Inversion of Control)이라고 한다.

```javascript
// 빈자의 의존성 주입(poor man's dependency injection)
Attendee = function(service, messenger, attendeeId) {
    if (!(this instanceof Attendee)) {
        return new Attendee(attendeeId);
    }
    
    this.attendeeId = attendeeId;
    
    this.service = service;
    this.messenger = messenger;
}

// 운영 환경:
var attendee = new Attendee(new ConferenceWebSvc(), new Messenger(), id);

// 개발(테스트) 환경:
var attendee = new Attendee(fakeService, fareMessenger, id);
```

#### 2.2.2 의존성을 주입하여 믿음직한 코드 만들기(장점)

+ DI는 실제 객체보다 주입한 스파이나 모의 객체에 더 많은 제어권을 안겨준다.
+ 이로 인해 다양한 에러 조건과 기이한 상황을 만들어내기 쉬어 진다.
+ DI를 통해 코드의 재사용성을 높인다.

#### 2.2.3 의존성 주입의 모든 것

**다음 조건에 부합한다면, DI를 생각해볼 것**

+ 객체 또는 의존성 중 어느 하나라도 DB, 설정 파일, HTTP, 기타 인프라 등의 외부 자원에 의존하는가?
+ 객체 내부에서 발생할지 모를 에러를 테스트에서 고려해야 하나?
+ 특정한 방향으로 객체를 작동시켜야 할 테스트가 있는가?
+ 이 서드파티(third-party) 제공 객체가 아니라 온전히 내가 소유한 객체인가?

![DI Container](http://cfile23.uf.tistory.com/image/99B4C4345A956FFC35F1C2)

#### 2.2.4 사례연구: 경량급 의존성 프레임워크 개발(SKIP)

#### 2.2.5 의존성 주입 프레임워크 활용(SKIP)

#### 2.2.6 최신 의존성 주입 프레임워크

[RequireJS](http://requirejs.org/)

[AngularJS](https://angularjs.org/)

[Angular2+](https://angular.io/)

### 2.3 애스팩트 툴킷

컴퓨팅에서 관점 지향 프로그래밍(aspect-oriented programming, AOP)은 횡단 관심사(cross-cutting concern)의 분리를 허용함으로써 모듈성을 증가시키는 것이 목적인 프로그래밍 패러다임이다. 코드 그 자체를 수정하지 않는 대신 기존의 코드에 추가 동작(어드바이스)을 추가함으로써 수행하며, "함수의 이름이 'set'으로 시작하면 모든 함수 호출을 기록한다"와 같이 어느 코드가 포인트컷(pointcut) 사양을 통해 수정되는지를 따로 지정한다. 이를 통해 기능의 코드 핵심부를 어수선하게 채우지 않고도 비즈니스 로직에 핵심적이지 않은 동작들을 프로그램에 추가할 수 있게 한다. 관점 지향 프로그래밍은 관점 지향 소프트웨어 개발의 토대를 형성한다. [참조](https://ko.wikipedia.org/wiki/%EA%B4%80%EC%A0%90_%EC%A7%80%ED%96%A5_%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D)

![AOP](http://cfile4.uf.tistory.com/image/99A33D475A9660D20D3C5B)

![JOINTPOINT](http://cfile21.uf.tistory.com/image/991B4D495A9660D2167C95)

### 2.4 코드 검사 도구

#### 2.4.1 린팅 도구로 믿음직한 코드 만들기

#### 2.4.2 [JSHint](http://jshint.com/) 들어가기

오픈 소스 정적 분석 도구

##### JSHint 사용법

```javascript
// 다음의 코드를 JSHint에서 검사해보자
function calculateUpgradeMileages(tripMileages, memberMultiplier) {
    var upgradeMileage = [],
        i = 0;
    for (i = 0; i < tripMileages.length; i++) {
        var calcRewardsMiles = function(mileage) {
            return mileage * memberMultiplier;
        };
        upgradeMileage[i] = calcRewardsMiles(tripMileages[i]);
    }
    return upgradeMileage;
}
```

```javascript
// 특별한 이유로 loop 안에 함수가 있어야 한다면, jshint 주석을 활용해 검사에서 제외
function calculateUpgradeMileages(tripMileages, memberMultiplier) {
    var upgradeMileage = [],
        i = 0;
    for (i = 0; i < tripMileages.length; i++) {
        /*jshint loopfunc: true */
        var calcRewardsMiles = function(mileage) {
            return mileage * memberMultiplier;
        };
        /*jshint loopfunc: false */
        upgradeMileage[i] = calcRewardsMiles(tripMileages[i]);
    }
    return upgradeMileage;
}
```



##### 실행하지 않으면 버그가 찾아올지어다

#####  테스트도 코드다

애플리케이션 코드뿐만 아니라 단위 테스트 코드 역시 실행하여 검사하라.

#### 2.4.3 JSHint 대체 도구

##### [JSLint](http://www.jslint.com/)

Douglas Crockford 가 개발

##### [ESLint](https://eslint.org/)

Nicholas Zakas가 개발

#### 2.4.4 엄격 모드

- ECMAScript 5 명세에 처음 도입
- **'use strict';**
