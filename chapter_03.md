# 자바스크립트 패턴과 테스트

## 3장 객체를 바르게 만들기

### 3.1 원시형

자바스크립트의 원시형은 `문자열(String)`, `숫자(Number)`, `불(Boolean)`, `null`, `undefined` 5가지로 구성, ECMA6부터 `Symbol`이 추가 됨

#### 3.1.1 객체 래퍼

`문자열(String)`, `숫자(Number)`, `불(Boolean)`은 모두 그들만의 래퍼(wrapper) 객체를 지님

- 래퍼 객체는 원시형의 값을 감싸는 형태의 객체
- "test" 같은 문자열 원시형의 경우 String 객체로 래핑되어 String 객체의 프로퍼티인 `length` 필드나 `substring` 함수를 사용할 수 있음

```javascript
var str = 'test';
console.log(str.length);
console.log(str.substring(1, 2));
```

#### 3.1.2 상수 (ES2015)

원시형을 반복하여 사용하게 될 경우는 상수를 사용하는것이 코드를 DRY하게 유지

```javascript
const EXCHANGE_RATE = 1020;
var fare = 50 * EXCHANGE_RATE;
var tax = 10 * EXCHANGE_RATE;
```

### 3.2 객체 리터럴

객체 리터럴은 `{ ... }` 안에 콜론 구분자를 통해 멤버와 값의 지정하여 객체를 생성 함

- 구조의 정의와 생성이 하나로 합쳐짐
- 코드가 간결해지며 가독성이 높아짐
- 객체 리터럴은 데이터 뭉치를 옮길 때 사용하기 편함
- 단순 객체 리터럴은 구조의 정의 외에 생성이 같이 이루어 지기 때문에 DI, AOP, TDD와는 어울리지 않음

단순 객체 리터럴

```javascript
{
  name: '서동구',
  age: 38
}
```

함수의 반환값인 객체 리터럴

```javascript
var member = function() {
  return {
    name: '서동구',
    age: 38
  }
}
```

### 3.3 모듈 패턴

자바스크립트(ES6이전) 객체 사용에 `private` 과 `public` 으로 나뉜 캡슐화를 제공하는 방법. 이 패턴을 사용함으로 글로벌 스코프로 인한 충돌을 예방할 수 있다.

- 함수의 스코프 개념을 이용하여 `캡슐화를 흉내`내는 것
- `클로저`를 사용해서 상태와 구조를 캡슐화
- 외부에 공개할 `API를 반환`하도록 설계
- ES6부터 private, public과 같은 접근 제한자를 사용할 수 있음

#### 3.3.1 임의 모듈 생성

원하는 시점에 언제든 생성할 수 있는 모듈

- 의존성 주입 가능

```javascript
var FltGraphApp = FltGraphApp || {};

FltGraphApp.reservationService = function(gds) {
  var passenger;
  var flight;
  return {
    setReservationInfo: function(passenger, flight) {
      this.passenger = passenger;
      this.flight = flight;
    },
    createReservation: function() {
      var result = gds.createPnr(passenger, flight);
      return {
        pnrNo: result.pnr,
        passenger: this.passenger,
        flight: this.flight
      }
    }
  }
}

var amadeusService = FltGraphApp.reservationService(amadeusGds);
amadeusService.setReservationInfo(passenger, flight);
console.log(amadeusService.createReservation());

var sabreService = FltGraphApp.reservationService(sabreGds);
sabreService.setReservationInfo(passenger, flight);
console.log(sabreService.createReservation());
```

#### 3.3.2 즉시 실행 모듈 생성

외부 함수를 선언하지마자 실행하는 모듈

- 의존성 주입 불가능
- 즉시 실행 모듈은 싱글톤 인스턴스가 됨

```javascript
var FltGraphApp = FltGraphApp || {};

FltGraphApp.reservationService = (function(gds) {
  var passenger;
  var flight;
  return {
    setReservationInfo: function(passenger, flight) {
      this.passenger = passenger;
      this.flight = flight;
    },
    createReservation: function () {
      var result = gds.createPnr(passenger, flight);
      return {
        pnrNo: result.pnr,
        passenger: this.passenger,
        flight: this.flight
      }
    }
  }
}(sabreGds));

var sabreService = FltGraphApp.reservationService;

sabreService.setReservationInfo(passenger, flight);
console.log(sabreService.createReservation());
```

### 3.3.3 모듈 생성의 원칙

- 한 모듈에 한 가지 일만 시키도록 작성 (`단일 책임 원칙`)
- 모듈 자신이 쓸 객체가 필요하다면 `의존성 주입` 형태로 객체를 제공
- 다른 객체 로직을 확장하는 모듈은 해당 로직의 의도가 바뀌지 않도록 주의 (`리스코프 치환 원칙`)

## 3.4 객체 프로토타입과 프로토타입 상속

Object.prototype 속성(property)은 Object 프로토타입(원형) 객체를 나타낸다 

### 3.4.1 기본 객체 프로토타입

자바스크립트 객체는 프로토타입 객체로 연결되어 프로퍼티를 상속

- person 객체에 toString 함수가 없으면, person 프로토타입인 Object.prototype을 찾아보고 여기에 정의된 toString 함수를 사용

  ```javascript
  var person = {
    name: '홍길동',
    age: '38',
    gender: 'M'
  };

  console.log(person.toString());
  ```

- person 객체에 toString 함수가 있으면 person 객체의 toString 함수 사용

  ```javascript
  var person = {
    name: '홍길동',
    age: '38',
    gender: 'M',
    toString: function() {
      return "name: " + this.name + 
        ", age: " + this.age + 
        ", gender: " + gender;
    }
  };

  console.log(person.toString());
  ```

### 3.4.2 프로토타입 상속

ES5부터 등장한 Object.create 메서드를 사용하면 기존 객체와 프로토타칩이 연결된 새로운 개체를 만들수 있다

```javascript
var reservationInfo = Object.create(person);
reservationInfo.email = 'honggildong@fltgraph.com';
reservationInfo.phoneNo = '01011112222';
console.log(reservationInfo.name);
console.log(reservationInfo.email);

var passengerInfo = Object.create(person);
passengerInfo.passportNo = 'M1111111';
passengerInfo.dateOfbirth = '19901010';
console.log(passengerInfo.name);
console.log(passengerInfo.passportNo);
```

### 3.4.3 프로토타입 체인

다층 프로토타입을 이용하여 여러 계층의 상속 구현 가능. 너무 깊숙한 프로토타입 체인 사용시 성능 하락이 있음

```javascript
var person = {
  name: '홍길동',
  age: '38',
  gender: 'M'
};

var paxInfo = Object.create(person);
paxInfo.passportNo = 'M1111111';
paxInfo.dateOfbirth = '19901010';

var paxFareInfo = Object.create(paxInfo);
paxFareInfo.fare = '550000';
paxFareInfo.tax = '100000';

console.log(paxFareInfo.name);
console.log(paxFareInfo.passportNo);
console.log(paxFareInfo.fare);
```

## 3.5 new 객체 생성

new 키워드를 사용한 객체의 인스턴스 생성 과정

- 빈 객체가 생성된다
- 이 객체는 this라는 변수로 참조할 수 있고, 해당 함수의 프로토타입을 상속 받는다
- this로 참조되는 객체에 프로퍼티와 메소드가 추가 된다
- 마지막에 다른 객체가 명시적으로 반환되지 않을 경우, this로 참조된 이 객체가 반환된다

### 3.5.1 new 객체 생성 패턴

```javascript
function Passenger(name, gender) {
  this.name = name;
  this.gender = gender;
}

var thor = new Passenger('thor', 'M');
var hulk = new Passenger('hulk', 'M');

console.log(thor.name);
console.log(hulk.name);
```

#### new를 사용하도록 강제

자바스크립트는 언어만으로 반드시 new를 써서 생성자 함수를 호출하도록 강제할 수 없어 아래와 같은 방식으로 new의 사용을 강제할 수 있다

- instanceof 연산자로 new 사용을 강제

  ```javascript
  function Passenger(name, gender) {
    if (!(this instanceof Passenger)) {
      throw new Error("new를 사용하여 생성해야 합니다");
    }
    this.name = name;
    this.gender = gender;
  }
  ```

- new를 자동 삽입하여 인스턴스 생성

  ```javascript
  function Passenger(name, gender) {
    if (!(this instanceof Passenger)) {
      throw new Passenger(name, gender);
    }
    this.name = name;
    this.gender = gender;
  }
  ```

코드베이스의 일관성을 위해 `instanceof 연산자로 new 사용을 강제`하는 방식을 추천

#### 함수의 추가

- new 객체에 함수를 직접 추가

  ```javascript
  function PaxFareInfo(type, fare, tax) {
    if (!(this instanceof PaxFareInfo)) {
      throw new Error("new를 사용하여 생성해야 합니다");
    }

    this.type = type;
    this.fare = fare;
    this.tax = tax;

    this.getTotalPrice = function() {
      return fare + tax;
    }
  }

  var adtFare = new PaxFareInfo('ADT', 500000, 100000);
  var chdFare = new PaxFareInfo('CHD', 100000, 50000);
  
  console.log(adtFare.getTotalPrice === chdFare.getTotalPrice);
  ```

- 생성자 함수 프로토타입에 함수를 추가

  ```javascript
  function PaxFareInfo(type, fare, tax) {
    if (!(this instanceof PaxFareInfo)) {
      throw new Error("new를 사용하여 생성해야 합니다");
    }

    this.type = type;
    this.fare = fare;
    this.tax = tax;
  }

  PaxFareInfo.prototype.getTotalPrice = function() {
    return fare + tax;
  }

  var adtFare = new PaxFareInfo('ADT', 500000, 100000);
  var chdFare = new PaxFareInfo('CHD', 100000, 50000);
  
  console.log(adtFare.getTotalPrice === chdFare.getTotalPrice);
  ```

`생성자 함수 프로토타입에 함수를 추가` 방식으로 함수를 정의하면 객체 인스턴스가 대량으로 생성되어도 참조하는 함수의 사본은 한 개로 제한되기 때문에 메모리 점유률이 낮아지고 성능까지 높아지는 이점이 있다.

## 3.6 클래스 상속

자바스크립트는 프로토타입 상속을 통해 `고전적 상속 흉내 내기`가 가능하다

### 3.6.1 고전적 상속 흉내 내기

```javascript
function Passenger(name, gender) {
  if (!(this instanceof Passenger)) {
    throw new Error("new를 사용하여 생성해야 합니다");
  }

  this.name = name;
  this.gender = gender;
}

Passenger.prototype.getPaxInfoDesc = function() {
  return "탑승객 이름: " + this.name +
    ", 탑승객 성별: " + this.gender;
}

function PaxFareInfo(name, gender, fare, tax) {
  if (!(this instanceof PaxFareInfo)) {
    throw new Error("new를 사용하여 생성해야 합니다");
  }

  this.name = name;
  this.gender = gender;
  this.fare = fare;
  this.tax = tax;
}

PaxFareInfo.prototype = new Passenger();
PaxFareInfo.prototype.getTotalPrice = function() {
  return this.fare + this.tax;
}

var tony = new PaxFareInfo('tony', 'M', 500000, 100000);
console.log(tony.getPaxInfoDesc());
console.log(tony.getTotalPrice());
```

클래스 상속 방식의 단점은 부모 프로토타입 지정시 인자를 알 수 없으므로, 자식 객체에서도 부모 객체의 프로퍼티 할당 작업이 되풀이되므로 DRY원칙에 위반된다

## 3.7 함수형 상속

모듈 패턴을 이용하여 함수형 상속이 가능하다

```javascript
var PaxApp = PaxApp || {};

PaxApp.passenger = function(name, gender) {
  return {
    getPaxInfoDesc: function() {
      return "탑승객 이름: " + name +
        ", 탑승객 성별: " + gender;
    }
  }
};

PaxApp.paxFareInfo = function(name, gender, fare, tax) {
  var passenger = PaxApp.passenger(name, gender);

  passenger.getTotalPrice = function() {
    return fare + tax;
  }

  return passenger;
};

var tony = new PaxApp.paxFareInfo('tony', 'M', 500000, 100000);
console.log(tony.getPaxInfoDesc());
console.log(tony.getTotalPrice());
```

## 3.8 멍키 패칭

멍키 패치를 이용하면 한 객체의 기능을 다른 객체로 기증할 수 있다. 패치를 관장하는 객체에서 빌리는 객체가 요건을 충족하는지 일아보게 하는것이 좋은 멍키 패칭 방법이다.

```javascript
var FltGraphApp = FltGraphApp || {};

FltGraphApp.FareInfo = function(fare, tax) {
  if (!(this instanceof FltGraphApp.FareInfo)) {
    throw new Error("new를 사용하여 생성해야 합니다");
  }

  this.fare = fare;
  this.tax = tax;
};

FltGraphApp.FareInfo.prototype.getTotalPrice = function() {
  return this.fare + this.tax;
};

var fareInfo = new FltGraphApp.FareInfo(500000, 100000);
console.log(fareInfo.getTotalPrice());

FltGraphApp.PaxFareInfo = function(name, gender, fare, tax) {
  if (!(this instanceof FltGraphApp.PaxFareInfo)) {
    throw new Error("new를 사용하여 생성해야 합니다");
  }

  this.name = name;
  this.gender = gender;
  this.fare = fare;
  this.tax = tax;
};

FltGraphApp.FareInfo.prototype.patchTotalFare = function(receivingObj) {
  if(typeof receivingObj.fare === 'number' && typeof receivingObj.tax === 'number') {
    receivingObj.getTotalPrice = fareInfo.getTotalPrice;
  } else {
    throw new Error("fare, tax 타입이 숫자로 넘어와야 합니다");
  }
}

var paxFareInfo = new FltGraphApp.PaxFareInfo('tony', 'M', 100000, 50000);

fareInfo.patchTotalFare(paxFareInfo);

console.log(paxFareInfo.getTotalPrice());
```