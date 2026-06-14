// ======== ДЕМОНСТРАЦИЯ АСИНХРОННОСТИ ========
console.log('1. Синхронный старт');

// ---- Макрозадача: setTimeout ----
setTimeout(() => {
  console.log('2. Макрозадача setTimeout(0)');
}, 0);

// ---- Микрозадача: Promise.then ----
Promise.resolve()
  .then(() => {
    console.log('3. Микрозадача Promise.then #1');
  });

// ---- Микрозадача: вложенные микрозадачи (Promise внутри .then) ----
Promise.resolve()
  .then(() => {
    console.log('4. Микрозадача #2 (внешняя)');
    // Внутри микрозадачи создаём ещё одну микрозадачу
    Promise.resolve().then(() => {
      console.log('5. Вложенная микрозадача внутри #2');
    });
  });

// ---- Асинхронная функция с await ----
async function demoAsync() {
  console.log('6. Начало async-функции (синхронная часть)');

  // await превращает всё последующее в микрозадачу, аналогичную .then
  await Promise.resolve('значение');

  console.log('7. После await (микрозадача)');
}
demoAsync();

// ---- Макрозадача: setImmediate (только в Node.js) ----
// В браузере можно заменить на setTimeout, но для наглядности оставлю:
if (typeof setImmediate === 'function') {
  setImmediate(() => {
    console.log('8. Макрозадача setImmediate (перед следующим setTimeout)');
  });
} else {
  setTimeout(() => {
    console.log('8. Макрозадача setTimeout(0) вместо setImmediate');
  }, 0);
}

// ---- Ещё одна синхронная строка ----
console.log('9. Синхронный финиш до обработки очередей');

// ---- Создание цепочки из нескольких микрозадач ----
Promise.resolve()
  .then(() => {
    console.log('10. Микрозадача #3');
    return 'значение';
  })
  .then((val) => {
    console.log('11. Микрозадача #4, получено:', val);
  });

// ---- Дополнительная макрозадача с нулевой задержкой ----
setTimeout(() => {
  console.log('12. Вторая макрозадача setTimeout(0)');
}, 0);

// ---- Явная микрозадача через queueMicrotask ----
queueMicrotask(() => {
  console.log('13. Явная микрозадача (queueMicrotask)');
});

// ---- Глубокая вложенность микрозадач ----
Promise.resolve()
  .then(() => {
    console.log('14. Микрозадача #5');
    queueMicrotask(() => {
      console.log('15. Микрозадача внутри queueMicrotask из #5');
    });
  });

console.log('16. Синхронный конец скрипта');
