# 자바스크립트 패턴과 테스트

## 2장 도구 다루기

### 2.1 테스팅 프레임워크

#### 여행사의 예약 시스템 중 예약 생성 모듈

> TDD 없이 작성한 createReservation 모듈
>
> ```javascript
> function createReservation(passenger, flight) {
>     return {
>       	passengerInfo: passenger,
>         flightInfo: flight
>     };
> }
> ```
>
> [Jasmine](https://jasmine.github.io/)을 통한 테스트 대상을 완성한 다음 작성한 createReservation 테스트 코드
>
> ```javascript
> describe('createReservation(passenger, flight)', function(){
>     it('주어진 passenger를 passengerInfo 프로퍼티에 할당한다', function(){
>         var testPassenger = {
>             firstName: '윤지',
>             lastName: '김'
>         };
>         
>         var testFlight = {
>             number: '3443',
>             carrier: '대한항공',
>             destination: '울산'
>         };
>         
>         var reservation = createReservation(testPassenger, testFlight);
>         expect(reservation.passengerInfo).toBe(testPassenger);
>     });
>     
>     it('주어진 flight를 flightInfo 프로퍼티에 할당한다', function(){
>         var testPassenger = {
>             firstName: '윤지',
>             lastName: '김'
>         };
>         
>         var testFlight = {
>             number: '3443',
>             carrier: '대한항공',
>             destination: '울산'
>         };
>         
>         var reservation = createReservation(testPassenger, testFlight);
>         expect(reservation.flightInfo).toBe(testFlight);
>     });
> });
> ```
>
> [example](https://github.com/eddie-yim/reliablejs/blob/master/sources/chapter_01/example_jasmine.html)

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

> createReservation 에 웹 서비스 연동 기능이 추가된다고 한다면
>
> ```javascript
> describe('createReservation(passenger, flight)', function(){
>     // Existing test
>     it('예약 정보를 웹 서비스 종단점으로 전송한다', function(){
>     	// createReservation이 웹 서비스 통신까지 맡아야 하나? 
>     });
> });
> ```
>
> 웹 서비스 통신 전담 객체가 만들어 테스트 하는 편이 바람직하다.
>
> 코드 테스트성을 극대화하면 SOLID 원칙을 어긴 코드를 쉽게 솎아낼 수 있다.

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

테스트 꾸러미와 스펙

스파이





****



### 2.2 의존성 주입 프레임워크

### 2.3 애스팩트 툴킷

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
