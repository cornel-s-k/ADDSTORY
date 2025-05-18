import App from './pages/app';
import { getActiveRoute } from './routes/url-parser';

let lastRoute = null;

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // ✅ Intercept skip link so it doesn't trigger router
  document.querySelector('.skip-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
  });

  // ✅ Initial render
  lastRoute = getActiveRoute();
  console.log('App initialized');
  await app.renderPage();

  // ✅ Handle hash changes
  window.addEventListener('hashchange', async () => {
    const newRoute = getActiveRoute();

    // ✅ Ignore non-routing hashes like #main-content
    if (!location.hash.startsWith('#/')) {
      console.log('Ignoring non-route hash:', location.hash);
      return;
    }

    if (newRoute !== lastRoute) {
      console.log('Hash changed, re-rendering page...');
      lastRoute = newRoute;
      await app.renderPage();
    } else {
      console.log('Hash unchanged (same route), skipping render.');
    }
  });
});
