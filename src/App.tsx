import { useEffect, useRef } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { lerUltimaTela, salvarUltimaTela } from './ultimaTela';

function Tela({ titulo }: { titulo: string }) {
  return <h1>{titulo}</h1>;
}

// O app instalado sempre abre em "/". Na primeira carga, volta para a última tela vista e, depois, vai guardando a tela atual.
function LembrarUltimaTela() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const primeiraCarga = useRef(true);

  useEffect(() => {
    if (primeiraCarga.current) {
      primeiraCarga.current = false;
      const ultima = lerUltimaTela();
      if (pathname === '/' && ultima && ultima !== '/') {
        navigate(ultima, { replace: true });
        return;
      }
    }
    salvarUltimaTela(pathname + search);
  }, [pathname, search, navigate]);

  return null;
}

export function App() {
  return (
    <>
      <LembrarUltimaTela />
      <nav>
        <Link to="/">Início</Link> <Link to="/colmeias">Colmeias</Link> <Link to="/alertas">Alertas</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Tela titulo="Início" />} />
          <Route path="/colmeias" element={<Tela titulo="Colmeias" />} />
          <Route path="/alertas" element={<Tela titulo="Alertas" />} />
        </Routes>
      </main>
    </>
  );
}
