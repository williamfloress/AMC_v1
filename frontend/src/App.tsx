import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './pages/Inicio';
import Propiedades from './pages/Propiedades';
import Sectores from './pages/Sectores';
import InmuebleEnEstudio from './pages/InmuebleEnEstudio';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/sectores" element={<Sectores />} />
          <Route path="/inmueble-en-estudio" element={<InmuebleEnEstudio />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
