# 型の判定

## はじめに

JavaScript は弱い型付けの言語であり、型の取り扱いについては注意が必要な部分がある。

::: tip 目次
[[toc]]
:::

## `typeof`演算子

| 型 | 返り値 |
| --- | --- |
| 未定義値 |	"undefined" |
| null |	"object" |
| **真偽値** |	**"boolean"** |
| 数値 |	"number" |
| 文字列 |	"string" |
| **シンボル** |	**"symbol"** |
| ホストオブジェクト<br />(ブラウザ、Node.js) | 実装に依存 |
| **関数オブジェクト** | **"function"** |
| その他のオブジェクト | "object" |

### 判定できるもの

- 真偽値 `"boolean"`
- シンボル `"symbol"`
- 関数オブジェクト `"function"`

### 大体判定できるもの

- 未定義値 `"undefined`
- 数値 `"number"`
- 文字列 `"string"`

未定義値は、値が代入されていない変数も宣言がなされていない変数も`"undefined"`を返す。  
`ReferenceError`を発生させずに未定義か調べたい場合に用いることができる。

```js
console.log(typeof x);  // => "undefined"
let x;
console.log(typeof x);  // => "undefined"
```

数値と文字列については、`new Number()`や`new String()`のように、`new`演算子でコンストラクタを呼び出すと`"object"`と判定されてしまう。  
もっともこれらはリテラルで宣言するのが一般的なのであまり気にしなくてよい気はする。

```js
const str1 = new String();        // String {""}
console.log(typeof str1);         // => "object"

const str2 = new String('hoge');  // String{"hoge"}
console.log(typeof str2);         // => "object"

const str3 = String(123);         // => "123"
console.log(typeof str3);         // "string"
```

```js
const num1 = new Number();     // Number {0}
console.log(typeof num1);      // => "object"

const num2 = new String(123);  // Number {123}
console.log(typeof num2);      // => "object"

const num3 = Number('');       // => 0
console.log(typeof num3);      // "number"
```

### 判定には適さないもの

`null`や配列、その他のオブジェクトはすべて`"object"`と判定される。

本来プリミティブな値である`null`が`typeof`演算子で`"object"`となるのは仕様上のバグである。  
[The history of “typeof null”](https://2ality.com/2013/10/typeof-null.html)

## `Object.prototype.toString.call()`

`[object [型名]]`という文字列を返す。

JavaScript においてすべての値はオブジェクトであり、`Object`オブジェクトを継承している。  
`Object.prototype`を通して、`Object`オブジェクトが元々もっている`toString()`メソッドを`Function.prototype.call()`で呼び出している。

`Function.prototype.call()`メソッドを用いることで`this`のコンテクストを指定することができる。  
型名を取得したい値を`this`に束縛して、`this`に対して`Object`オブジェクトがもつ`toString()`メソッドを適用させている。  
なお、`Function.prototype.apply()`も第一引数で`this`を束縛できるので同様の結果が得られる。

`{ key: value }`型のオブジェクトは直接`toString()`メソッドを呼ぶと`"[object Object]"`を得ることができる。

```js
const obj = {};
console.log(obj.toString());  // => "[object Object]"
```

対して、配列や Date 型では`Object`オブジェクトの`toString()`メソッドをオーバーライドして、独自の`toString()`メソッドを実装している。

```js
const list = [1, 2, 3];
console.log(list.toString());  // => "1, 2, 3"

const date = new Date();
console.log(date.toString());  // => "Wed Nov 20 2019 16:32:05 GMT+0900 (日本標準時)"
```

これらのオブジェクトにも`Object`オブジェクトの`toString()`メソッドを適用させるために`Object.prototype`を通して`toString()`メソッドを呼び出し、`Function.prototype.call()`で`this`コンテクストを束縛している。

```js
const list = [1, 2, 3];
console.log(Object.prototype.toString.call(list));  // => "[object Array]"

const date = new Date();
console.log(Object.prototype.toString.call(date));  // => "[object Date]"
```

### プリミティブな値の判定

```js
const whatIs = arg => {
  console.log(Object.prototype.toString.call(arg).slice(8, -1));
};

whatIs(undefined);     // => "Undefined"
whatIs(null);          // => "Null"

whatIs(true);          // => "Boolean"
whatIs(false);         // => "Boolean"

whatIs('hoge');        // => "String"
whatIs(new String());  // => "String"

whatIs(123);           // => "Number"
whatIs(new Number());  // => "Number"

whatIs(Symbol());      // => "Symbol"
```

`new String()`や`new Number()`とした場合でも`"String"`や`"Number`を得ることができる。

`undefined`と`null`については ES5.1 以降で`Object.prototype.toString()`を呼び出すとそれぞれ`"[object Undefined]"`と`"[object Null]"`を得ることができるようになった。

配列オブジェクトは`Object`オブジェクトを継承しているので、プロトタイプチェーンを辿っていって`Object`オブジェクトの`toString()`メソッドを呼び出している。

```js
console.log([].__proto__.toString === Object.prototype.toString);  // => false
console.log([].__proto__.__proto__.toString === Object.prototype.toString);  // => true
console.log(Object.prototype.toString.call([]));  // => "[object Array]"
```

対して、`null`と`undefined`は`prototype`プロパティや`__proto__`プロパティを持たず、実際は`Object`プロパティの`prototype`を参照しているわけではない。

互換性を考慮して後から例外的に追加されたものである。

```js
console.log(undeinfed.prototype);  // TypeError: Cannot read property 'prototype' of undefined
console.log(null.__proto__);  // TypeError: Cannot read property '__proto__' of null
```

[ECMAScript Language Specification - ECMA-262 Edition 5.1 | 15.2.4.2](https://www.ecma-international.org/ecma-262/5.1/#sec-15.2.4.2)

### オブジェクトの判定

```js
const whatIs = arg => {
  console.log(Object.prototype.toString.call(arg).slice(8, -1));
};

whatIs([]);                       // => "Array"
whatIs(new Int8Array());          // => "Int8Array"
whatIs(new Uint8Array());         // => "Uint8Array"
whatIs(new Uint8ClampedArray());  // => "Uint8ClampedArray"
whatIs(new Int16Array());         // => "Int16Array"
whatIs(new Uint16Array());        // => "Uint16Array"
whatIs(new Int32Array());         // => "Int32Array"
whatIs(new Uint32Array());        // => "Uint32Array"
whatIs(new Float32Array());       // => "Float32Array"
whatIs(new Float64Array());       // => "Float64Array"

whatIs({ key: 'value' });  // => "Object"

whatIs(function () {});         // => "Function"
whatIs(function* () {});        // => "GeneratorFunction"
whatIs(async function () {});   // => "AsyncFunction"
whatIs(async function* () {});  // => "AsyncGeneratorFunction"
whatIs((function* () {
  yield 1;
})());                        // => "Generator"
whatIs(new Promise(f => f));  // => "Promise"

whatIs(new Map());      // => "Map"
whatIs(new WeakMap());  // => "WeakMap"
whatIs(new Set());      // => "Set"
whatIs(new WeakSet());  // => "WeakSet"

whatIs(new Date());  // => "Date"
whatIs(Math);        // => "Math"
whatIs(/\d{4}/);     // => "RegExp"

whatIs(new Error());  // => "Error"
```

## `null`

`null`は予約語で書き換えできないのでそのまま等価演算子で比較する。

```js
const isNull = arg => arg === null;
console.log(isNull(null));  // => true
```

## `undefined`

グローバルの`undefined`は ES5.1 以降書き換え不可になったが、ローカルスコープ内では値を代入できてしまう。  
そのため、常にグローバル変数`undefined`を返す`void 0`と等価演算子で比較する。

もしくは上述の`typeof`演算子を用いてもよい。

詳細は[undefinedについて](/tips/javascript/undefinedについて)を参照。

## 配列

配列を判定するには ES5.1以降 で提供されている`Array`オブジェクトの静的メソッド`Array.isArray()`を利用する。

```js
Array.isArray([]);           // => true
Array.isArray(new Array());  // => true
Array.isArray({});           // => false
Array.isArray('array');      // => false
```

## NaN

### `isNan()`

グローバルスコープに定義された`isNaN()`は、数値への暗黙的な変換を試みた後に`NaN`かどうか (数値でないか) を判定しており、`isNaN(arg)`と`Number.isNaN(Number(arg))`は同義である。

`NaN`かどうか調べる関数というよりは数値への変換が不可能かを調べる関数であるため、`NaN`の厳密な判定には使用できない。

```js
isNaN(NaN);         // Numer.isNaN(NaN)  => true
isNaN(Number.NaN);  // Numer.isNaN(NaN)  => true
isNaN(0 / 0);       // Numer.isNaN(NaN)  => true

isNaN(123);         // Numer.isNaN(123)  => false
isNaN('123');       // Numer.isNaN(123)  => false
isNaN('');          // Numer.isNaN(0)    => false
isNaN(null);        // Numer.isNaN(0)    => false
isNaN(false);       // Numer.isNaN(0)    => false
isNaN(true);        // Numer.isNaN(1)    => false
isNaN([]);          // Numer.isNaN(0)    => false

isNaN(undefined);   // Number.isNaN(NaN) => true
isNaN({});          // Number.isNaN(NaN) => true
isNaN('hoge');      // Number.isNaN(NaN) => true
```

空文字列`''`、`null`、`false`、`[]`などは`Number()`で変換すると 0 になるが、`undefined`は`NaN`になる。

### `Number.isNaN()`

`NaN`の厳密な判定を行うには、`Number`オブジェクトの静的メソッドとして ES6 以降で提供されている`Number.isNaN()`メソッドを使用する。

**値が`NaN`で、かつ数値型である場合**にのみ`true`を返す。

```js
Number.isNaN(NaN);         // true
Number.isNaN(Number.NaN);  // true
Number.isNaN(0 / 0);       // true

Number.isNaN(undefined);   // false
Number.isNaN({});          // false
Number.isNaN('hoge');      // false
```

ES6+ が動作しないブラウザでは以下のポリフィルを使う。  
`NaN`は唯一自分自身と等しくないという性質を用いている。

```js
Number.isNaN = Number.isNaN || function (arg) {
  return typeof arg === 'number' && arg !== arg;
}
```

## まとめ

- `undefined`
  - 等価演算子`===`で`void 0`と比較
  - `typeof`演算子で`"undefined"`と比較
  - 詳しくは[undefinedについて](/tips/javascript/undefinedについて)を参照
- `null`
  - 等価演算子`===`で`null`と比較
- 配列
  - `Array.isArray()`
- `NaN`
  - `Number.isNaN()`
  - 自分自身と比較
- その他
  - `Object.prototype.toString.call()`
  - `Symbol`, `Boolean`, `Function` - `typeof`演算子

## 参考

[Understanding JavaScript types and reliable type checking | Ultimate Courses™](https://ultimatecourses.com/blog/understanding-javascript-types-and-reliable-type-checking)  
[Number.isNaN() - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)
