import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

let currentPage = null;
let lastRoute = null;

class App {
  #content;
  #drawerButton;
  #navigationDrawer;

  constructor({ content, drawerButton, navigationDrawer }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (e) => {
      if (
        !this.#navigationDrawer.contains(e.target) &&
        !this.#drawerButton.contains(e.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }
    });

    this.#navigationDrawer.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href === location.hash) {
          e.preventDefault();
          this.#navigationDrawer.classList.remove('open');
          return;
        }
        this.#navigationDrawer.classList.remove('open');
      }
    });
  }

  async renderPage() {
    const route = getActiveRoute();

    if (route === lastRoute) {
      console.log('[renderPage] Route sama, skip render:', route);
      return;
    }

    lastRoute = route;
    const PageComponent = routes[route] || routes['*'];

    if (currentPage?.destroy) currentPage.destroy();
    currentPage = new PageComponent();

    console.log('[renderPage] Rendering page for route:', route);

    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await currentPage.render();
        await currentPage.afterRender?.();
      });
    } else {
      this.#content.innerHTML = await currentPage.render();
      await currentPage.afterRender?.();
    }
  }
}

export default App;
