import { Link, Route, Routes } from 'react-router-dom';

function Tela({ titulo }: { titulo: string }) {
  return <h1>{titulo}</h1>;
}

export function App() {
  return (
    <>
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
