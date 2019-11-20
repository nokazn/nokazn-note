# `undefined`

`undefined`はグローバルに定義されたプリミティブなオブジェクトである。  
ちなみに、ビルトインのグローバルオブジェクトは以下の4つである。

- `Infinity`
- `NaN`
- `null`
- `undefined`

`undefined`は値であるが、`null`はリテラル表現をもつ。

## ECMA-357 Edition 2 以前

`undefined`はグローバル変数で、以下のように書き換えることができてしまっていた。

```js
console.log(undefined);  // => "undefined"
var undefined = "Hello!";
console.log(undefined);  //=> "Hello!"
```

対して、`void`演算子は任意の引数をとって常に`undefined`を返すため、安全性が保たれる。

```js
console.log(void 0);           // => undefined
console.log(void 'hogehoge');  // => undefined
```

## ECMA-262 (ES 5.1) 以降

ES5 以降では`undefined`は書き換え不可となった。

> モダンブラウザ (JavaScript 1.8.5 / Firefox 4 以降) での undefined は、ECMAScript 5 仕様により、設定不可、書込不可のプロパティとなります。そうでない場合でも、上書きは避けてください。

[undefined - JavaScript \| MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/undefined)

直接`undefined`を指定するか、値を代入せず宣言のみにした場合に変数は`undefined`を返す。

```js
const x = undefined;  // undefined
let y;                // undefined
```

## `undefned`の評価

### 等価演算子`===`

変数に値が割り当てられているかを調べる。

```js
let x;
console.log(x === undefined);  // => true
```

変数がまだ宣言されていないときは`ReferenceError`を投げる。

```js
console.log(x === undefined);  // Uncaught ReferenceError: x is not difined
```

### 比較演算子`==`

変数に値が割り当てられていないか、`null`が代入されているかを調べる。

```js
const x = null;
console.log(x == undefined);  // => true
console.log(x == null);       // => true

const y = undefined;
console.log(y == undefined);  // => true
console.log(y == null);       // => true
```

```js
console.log(x == undefined);  // Uncaught ReferenceError: x is not difined
```

`null`チェックのときに使うことがある。というかこの時以外に比較演算子は使わない。

### `typeof`演算子

変数に値が割り当てられていない場合だけでなく、変数が宣言されていない場合も文字列`"undefined"`を返すので値の評価には使用しない。

```js
console.log(typeof x === 'undefined');  // => true
```

```js
let x;
console.log(typeof x === 'undefined');  // => true
```

## 2種類の`undefined`

`undefined`には2つのタイプがある。

- 変数宣言されているが値が代入されていない場合の、値としての`undefined`
- オブジェクトにプロパティが存在しない場合の、不存在の`undefined`

以下は同じ`undefined`を返すが、内部の意味的には異なる。

```js
const obj = {
  hoge: undefined
};
console.log(obj.hoge);  // => undefined
console.log(obj.fuga);  // => undefined
```

これらを区別するには`Object#hasOwnProperty()`メソッド、または`in`演算子を使用する。

```js
const obj = {
  hoge: undefined
};
console.log(obj.hasOwnProperty('hoge'));  // => true
console.log(obj.hasOwnProperty('fuga'));  // => false
console.log('hoge' in obj);               // => true
console.log('fuga' in obj);               // => false
```

### 配列の`empty`

配列をコンストラクタで生成すると要素が`empty`の配列が得られる。

```js
new Array(3);  // [empty × 3]
```

これは値としての`undefined`ではなく、配列オブジェクトでインデックスに対応したプロパティが存在しないことを表している。

その他にも、値を指定せずカンマ`,`を連続で入れたり、`Array#length`以上のインデックスに値を代入したり、要素を削除したりすると`empty`が発生する。

```js
const list = [,, 1, 2, 3];
list[10] = 4;
delete list [3];
console.log(list);  // => [empty × 2, 1, empty, 3, empty × 5, 4]
```

```js
const list = new Array(3);
list[0] = undefined;
console.log(list);     // => [undefined, empty × 2]
console.log(list[0]);  // => undefined
console.log(list[1]);  // => undefined
console.log(list[2]);  // => undefined
```

配列オブジェクトでは`undefined`が代入されている場合とインデックスに対応したプロパティが存在しない場合とを区別している。  
しかし、インデックスからプロパティを呼び出すときはいずれの場合も`undefined`が返される。

`undefined`と`empty`ではコールバック関数を引数にとる配列のメソッドを使用したときの挙動が異なる。

```js
const list = new Array(3);
list[0] = undefined;
list.forEach((ele, index) => {
  console.log({ index, ele });
});
// => {index: 0, ele: undefined}
// index が 1, 2 の場合はスキップされる
```

長さを指定した配列を生成して値を埋めたい場合は`for`で対処するか、`Array#fill()`を使う。

```js
new Array(3).fill(1);  // [1, 1, 1]
```

## 参考

[undefined - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/undefined)  
[空じゃないけど空の配列の話。（配列とかおれおれAdvent Calendar2018 – 22日目）](https://ginpen.com/2018/12/22/empty-slots/)
