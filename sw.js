self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('v1').then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',  // Add any other resources you want to cache
          '/timer_favicons/android-chrome-192x192.png',
          '/timer_favicons/android-chrome-512x512.png',
          '/key_press_1.mp3',
          '/key_press_2.mp3',
          '/key_press_3.mp3',
          '/key_press_4.mp3',
          '/key_press_5.mp3',
          '/key_press_6.mp3',
          '/key_press_7.mp3',
          '/pouring_water_short.mp3'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });