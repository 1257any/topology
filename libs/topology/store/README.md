# Data

全局存储数据对象

# Store

全局数据存储管理

- set(key, value): void  
  设置 key=value。支持 a.b.c 等子属性方式，如果父对象不存在，自动创建空对象。

- get(key): value  
  获取当前 key 对应的 value 值。

- subscribe(key, fn): Observer  
  订阅 key 的值，当 key 对应的 value 发生变化时，调用 fn(value)回调函数。  
  返回值 Observer：可观察者对象。

# Observer

观察者

- unsubcribe(key): void  
  取消订阅。
