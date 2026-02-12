import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Propiedades from './pages/Propiedades';
import InmuebleEnEstudio from './pages/InmuebleEnEstudio';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Propiedades />} />
          <Route path="/propiedades" element={<Propiedades />} />
          <Route path="/inmueble-en-estudio" element={<InmuebleEnEstudio />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
