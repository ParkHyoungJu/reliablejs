# 자바스크립트 패턴과 테스트

## 2장 도구 다루기

### 2.1 테스팅 프레임워크

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
