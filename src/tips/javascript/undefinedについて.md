# `undefinedについて`

## はじめに

`undefined`はグローバルに定義されたプリミティブなオブジェクトである。  
ちなみに、ビルトインのグローバルオブジェクトは以下の4つである。

- `Infinity`
- `NaN`
- `null`
- `undefined`

`undefined`は値であるが、`null`はリテラル表現をもつ。`undefined`の挙動について以下簡単にまとめる。

::: tip 目次
[[toc]]
:::

## ECMAScript 5 以前

`undefined`はグローバル変数で、以下のように書き換えることができてしまっていた。

```js
console.log(undefined);  // => undefined
var undefined = "hoge";
console.log(undefined);  //=> "hoge"
```

## ECMAScript 5.1 以降

ES5.1 以降ではグローバルな`undefined`は書き換え不可となった。変数ではなくグローバルな値として扱うことができる。

```js
console.log(undefined);  // => undefined
var undefined = "hoge";
console.log(undefined);  //=> undefined
```

> モダンブラウザ (JavaScript 1.8.5 / Firefox 4 以降) での undefined は、ECMAScript 5 仕様により、設定不可、書込不可のプロパティとなります。そうでない場合でも、上書きは避けてください。

[undefined - JavaScript \| MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/undefined)
[Annotated ES5 | 15.1.1.3 undefined](http://es5.github.io/#x15.1.1.3)

直接`undefined`を代入するか、値を代入せず宣言のみにした場合に変数は`undefined`を返す。

```js
const x = undefined;  // undefined
let y;                // undefined
```

ただし、ローカルスコープ内では依然として`undefined`には値を代入できる。

```js
const isUndefined = arg => {
  const undefined = 'hoge';
  return arg === undefined;
};
console.log(isUndefined(undefined));  // => false
console.log(isUndefined('hoge'));     // => true
```

`undefined`は予約語でなはいため、ローカル変数として`undefined`を定義できてしまう。  
変数を参照する際はローカルスコープから辿っていくため、任意の値を代入したローカル変数`undefined`を採用してしまう。

対して、`void`演算子は任意の引数をとって常にグローバルの`undefined`を返すため、安全性が保たれる。

```js
console.log(void 'hogehoge');  // => undefined

const isUndefined = arg => {
  const undefined = 'hoge';
  return arg === void 0;
};
console.log(isUndefined(undefined));  // => true
```

もしくは、ローカルスコープ内でも先頭で`const undefined = undefined`と宣言しておけばスコープ内で`undefined`の書き換えを防ぐことができるが、全スコープないでこれを行うのは現実的ではない。

もっとも、ローカルスコープ内で`undefined`に値を代入するなんてことは避けるべきである。

## `undefned`の評価

### 等価演算子`===`

変数に値が割り当てられているかを調べる。

```js
let x;
console.log(x === undefined);  // => true
console.log(x === void 0);  // => true
```

変数がまだ宣言されていないときは`ReferenceError`を投げる。

```js
console.log(x === undefined);  // Uncaught ReferenceError: x is not difined
```

`ReferenceError`を発生させたくない場合には使用できない。引数の確認などでは有効。

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
console.log(x == undefined);  // ReferenceError: x is not difined
console.log(x == null);       // ReferenceError: x is not difined
```

`[変数] == null`としておけば、ローカルスコープ内で`undefined`に値が代入されようとも常にグローバルの`undefined`を参照するため、`null`か`undefined`を検出する際は有効である。

`null`チェック以外の場合では比較演算子は使わない。

### `typeof`演算子

変数に値が割り当てられていない場合だけでなく、変数が宣言されていない場合も文字列`"undefined"`を返す。

```js
console.log(typeof x === 'undefined');  // => true
let x;
console.log(typeof x === 'undefined');  // => true
```

変数が宣言されていな場合でも`ReferenceError`を投げずに変数が未定義かチェックすることができ、文脈に依存せず使用できる。

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

その他にも、以下のような場合に`empty`が発生する

- 値を指定せずカンマ`,`を連続で入れる
- `Array#length`以上のインデックスに値を代入する
- `delete`演算子で要素を削除する

```js
const list = [,, 1, 2, 3];
list[10] = 4;
delete list [3];
console.log(list);  // => [empty × 2, 1, empty, 3, empty × 5, 4]
```

配列オブジェクトでは`undefined`が代入されている場合とインデックスに対応したプロパティが存在しない場合とを区別している。  
しかし、インデックスからプロパティを呼び出すときはいずれの場合も`undefined`が返される。

```js
const list = new Array(3);
list[0] = undefined;
console.log(list);     // => [undefined, empty × 2]
console.log(list[0]);  // => undefined
console.log(list[1]);  // => undefined
console.log(list[2]);  // => undefined
```

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

配列の要素が空かどうかは、オブジェクトにプロパティが存在しない場合と同じように、インデックスをキーとするプロパティが存在するかを調べればよい。

```js
const list = [,];
console.log(list.hasOwnProperty(1));  // => false
list[1] = 'hoge';
console.log(list.hasOwnProperty(1));  // => true
```

長さを指定した配列を生成して値を埋めたい場合は`for`で対処するか、`Array#fill()`を使う。

```js
new Array(3).fill(1);  // [1, 1, 1]
```

## まとめ

評価は以下のように行うと確実である。

- `undefined`であるかを評価
  - 変数が確実に宣言されている (引数など) - `[変数] === void 0`
  - 変数が宣言さているか不確定 - `typeof [変数] === 'undefined'`
- `undefined`または`null`であるかを評価 - `[変数] == null`
- オブジェクトがプロパティを持つかどうかを評価 - `Object#hasOwnProperty([変数])`


細かい仕様については歴史的な経緯もあったりしてややこしい部分があるので注意しないといけない。

## 参考

[undefined - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/undefined)  
[空じゃないけど空の配列の話。（配列とかおれおれAdvent Calendar2018 – 22日目）](https://ginpen.com/2018/12/22/empty-slots/)
