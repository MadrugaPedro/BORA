import { NavLink } from 'react-router-dom';
import { IconeAlertas, IconeColmeias, IconeInicio, IconeOffline } from './icones';

const itens = [
  { para: '/', rotulo: 'Início', icone: <IconeInicio /> },
  { para: '/colmeias', rotulo: 'Colmeias', icone: <IconeColmeias /> },
  { para: '/alertas', rotulo: 'Alertas', icone: <IconeAlertas /> },
  { para: '/offline', rotulo: 'Offline', icone: <IconeOffline /> },
];

// Uma só <nav>: o CSS a coloca como barra lateral no desktop e como barra inferior no celular.
export function Menu() {
  return (
    <nav className="menu" aria-label="Principal">
      <span className="menu__marca">Borá</span>
      <ul className="menu__lista">
        {itens.map((item) => (
          <li key={item.para} className="menu__item">
            <NavLink to={item.para} end={item.para === '/'} className="menu__link">
              {item.icone}
              <span>{item.rotulo}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
