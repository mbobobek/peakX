import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routes } from './routes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
