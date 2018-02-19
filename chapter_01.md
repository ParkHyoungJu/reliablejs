# 자바스크립트 패턴과 테스트

## 1장 좋은 소프트웨어 만들기

### 1.1 바르게 시작하는 코드 작성하기

#### 1.1.1 자바스크립트 특성을 완벽히 섭렵하라

+ 테니스와 스쿼시의 차이점
+ 테니스를 하듯 공을 치면 **절대로** 스쿼시를 잘 할 수 없다.
+ 자바스크립트와 다른 프로그래밍 언어의 **차이점을 스스로 익혀야 한다.**

#### 1.1.2 대규모 시스템에서 자바스크립트 함정을 피하라

+ 스크립트는 모듈이 아니다.
+ 스코프는 중첩 함수로 다스린다.
+ 규약을 지켜 코딩한다.

#### 1.1.3 소프트웨어 공학 원칙을 적용하라

+ **SOLID** 원칙
  + 단일 책임 원칙(Single Responsibility Principle)
    + 모든 클래스(함수)는 반드시 한 가지 변경 사유가 있어야 한다.
    + **클래스는 하나의 기능만 가지며, 해당 클래스가 제공하는 모든 서비스는 하나의 책임을 수행하는데 집중되어야 한다.**
  + 개방/폐쇄 원칙(Open/Closed Principle)
    + **모든 소프트웨어 개체는 확장 가능성은 열어 두되, 수정 가능성은 닫아야 한다.**
  + 리스코프 치환 원칙(Liskov Substitution Principle)
    + **한 객체를 다른 객체에서 파생하더라도 그 기본 로직이 변경되어서는 안 된다.**
    + ref. Duck Typing
  + 인터페이스 분리 원칙(Interface Segregation Principle)
    + 인터페이스는 기능을 구현하지 않고 **서술**만 한 코드 조각
    + **기능이 많은 인터페이스는 더 작게 응축시킨 조각으로 나누어야 한다.**
  + 의존성 역전 원칙(Dependency Inversion Principle)
    + 인터페이스와 관련
    + **상위 수준 모듈은 하위 수준 모듈에 의존해서는 안 되며, 이 둘은 추상화에 의존해야 한다.**
+ **DRY** 원칙
  + **Don't Repeat Yourself**
  + 코드의 재사용성을 고려

### 1.2 바르게 유지되는 코드 작성하기

#### 1.2.1 단위 테스트는 미래에 대비한 투자다

#### 1.2.2 테스트 주도 개발을 실천하라

#### 1.2.3 테스트하기 쉬운 코드로 다듬어라

##### 관심사의 분리 (단일 책임 원칙): validateAndRegisterUser

```javascript
var Users = Users || {};
Users.registration = function() {
    return {
        validateAndRegisterUser: function validateAndDisplayUser(user) {
            // 1. user 객체가 올바르게 채워졌는지 검증: 사용자 검증
            if (!user || user.name === "" || user.password === "" || user.password.length < 6) {
                throw new Error("사용자 인증이 실패했습니다.");
            }

            // 2. 검증을 마치 user 객체를 서버에 전송: 서버와 통신
            $.post("http://yourapplication.com/user", user);

            // 3. UI에 메시지 표시: UI 직접 다루기
            $("#user-message").text("가입해주셔서 감사합니다." + user.name + "님");
        }
    };
};
```

##### TODO ![example html](https://github.com/eddie-yim/reliablejs/blob/master/sources/chapter_01/user_registration.html)

```javascript
var Users = Users || {};
Users.registration = function(userValidator, userRegister, userDisplay) {
    return {
        validateAndRegister: function validateAndDisplayUser(user) {
            if (!userValidator.userIsValid(user)) {
                throw new Error("사용자 인증이 실패했습니다.");
            }

            userRegister.registerUser(user);

            userDisplay.showRegistrationThankYou(user);
        }
    };
};
```
