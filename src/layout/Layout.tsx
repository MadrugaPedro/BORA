import { Outlet } from 'react-router-dom';
import './layout.css';
import { Menu } from './Menu';
import { Topo } from './Topo';

export function Layout() {
  return (
    <div className="app">
      <Menu />
      <div className="app__coluna">
        <Topo />
        <main className="app__conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
