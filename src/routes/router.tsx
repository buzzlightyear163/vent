import { createBrowserRouter } from 'react-router-dom';
import { SiteLayout } from '../layouts/SiteLayout';
import Home from '../pages/Home';
import Demo from '../pages/Demo';
import Teams from '../pages/Teams';
import Coins from '../pages/Coins';
import CoinDetail from '../pages/CoinDetail';
import Leaderboard from '../pages/Leaderboard';
import Milestones from '../pages/Milestones';
import Protocol from '../pages/Protocol';
import Docs from '../pages/Docs';
import Studio from '../pages/Studio';
import Launch from '../pages/Launch';
import { Terms, Privacy } from '../pages/Legal';
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/demo', element: <Demo /> },
      { path: '/teams', element: <Teams /> },
      { path: '/coins', element: <Coins /> },
      { path: '/coins/:id', element: <CoinDetail /> },
      { path: '/leaderboard', element: <Leaderboard /> },
      { path: '/milestones', element: <Milestones /> },
      { path: '/protocol', element: <Protocol /> },
      { path: '/docs', element: <Docs /> },
      { path: '/studio', element: <Studio /> },
      { path: '/launch', element: <Launch /> },
      { path: '/terms', element: <Terms /> },
      { path: '/privacy', element: <Privacy /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
