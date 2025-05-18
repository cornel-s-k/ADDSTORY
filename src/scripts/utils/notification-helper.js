// src/scripts/utils/notification-helper.js

const PUBLIC_VAPID_KEY = '<PASTE_PUBLIC_VAPID_KEY>';

export async function registerAndSubscribe() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription()
    || await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
    });

  // kirim detail sub ke backend
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sub),
  });
}

function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const raw    = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const output = new Uint8Array(atob(raw).split('').map(c => c.charCodeAt(0)));
  return output;
}

// otomatis request permission dan subscribe saat load
export function requestPermissionAndSubscribe() {
  if (!('Notification' in window)) return;
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      registerAndSubscribe();
    }
  });
}
