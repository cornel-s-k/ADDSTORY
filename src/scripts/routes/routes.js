import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add/add-story-page';
import LoginPage from '../pages/login/login-page';
import NotFoundPage from '../pages/notfound-page.js';  // Import added

const routes = {
  '/': LoginPage,      // Default route is LoginPage
  '/home': HomePage,
  '/about': AboutPage,
  '/add': AddStoryPage,
  '/login': LoginPage,
  '*': NotFoundPage     // Fallback for unknown routes
};

export default routes;

