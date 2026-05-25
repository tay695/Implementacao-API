import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState('');

  const login = async () => {
    try {
      const resp = await fetch(`${API_URL}/o/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=password&username=${username}&password=${password}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      });
      const data = await resp.json();
      if (data.access_token) {
        setToken(data.access_token);
        setErro('');
        buscarItens(data.access_token);
      } else {
        setErro('Login inválido');
      }
    } catch {
      setErro('Erro ao conectar com a API');
    }
  };

  const buscarItens = async (accessToken) => {
    const resp = await fetch(`${API_URL}/item/`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await resp.json();
    setItens(data.results || data);
  };

  if (!token) {
    return (
      <div className="container mt-5" style={{ maxWidth: 400 }}>
        <h2 className="mb-4">Login</h2>
        {erro && <div className="alert alert-danger">{erro}</div>}
        <input className="form-control mb-2" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="form-control mb-3" placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary w-100" onClick={login}>Entrar</button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Estoque</h1>
      <div className="row">
        {itens.map(item => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{item.nome}</h5>
                <p className="card-text">{item.descricao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;