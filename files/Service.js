// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('Service.js', { scope: '/' })
//         .then(function (reg) {
//             // registration worked
//             console.log('Registration succeeded. Scope is ' + reg.scope);
//         }).catch(function (error) {
//             // registration failed
//             console.log('Registration failed with ' + error);
//         });
// }

// self.addEventListener('install', function (event) {
//     event.waitUntil(
//         caches.open('v1').then(function (cache) {
//             return cache.addAll([
//                 "Game.js",
//                 "View.js",
//                 "minesweeper.css",
//                 "http://martinvavro.com/minesweeper.html"
//             ]);
//         })
//     );
// });
