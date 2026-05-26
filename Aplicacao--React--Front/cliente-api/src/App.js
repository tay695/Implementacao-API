import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const API_URL = 'http://127.0.0.1:8000';

const CATEGORIAS = {
  AL: 'Alimentos', HG: 'Higiene', LM: 'Limpeza', VD: 'Vestuário', OT: 'Outros'
};
 
const CAT_COLORS = {
  AL: '#4caf7d', HG: '#13928e', LM: '#2196b0', VD: '#8b6fc2', OT: '#e8a838'
};
 
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
 
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
  body { font-family: 'DM Sans', sans-serif; background: #0d1117; color: #e6edf3; }
 
  .app { display: flex; min-height: 100vh; }
 
  /* SIDEBAR */
  .sidebar {
    width: 240px; min-height: 100vh; background: #161b22;
    border-right: 1px solid #21262d; display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; z-index: 100;
  }
  .sidebar-logo {
    padding: 28px 24px 20px; border-bottom: 1px solid #21262d;
  }
  .sidebar-logo h1 {
    font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700;
    color: #4caf7d; letter-spacing: -0.5px;
  }
  .sidebar-logo span { color: #13928e; }
  .sidebar-logo p { font-size: 11px; color: #8b949e; margin-top: 2px; }
  .sidebar-nav { padding: 16px 12px; flex: 1; }
  .nav-label {
    font-size: 10px; font-weight: 600; color: #484f58; letter-spacing: 1.2px;
    text-transform: uppercase; padding: 8px 12px 6px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px;
    border-radius: 8px; cursor: pointer; color: #8b949e; font-size: 14px;
    font-weight: 500; transition: all 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: #21262d; color: #e6edf3; }
  .nav-item.active { background: #1a2f23; color: #4caf7d; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .sidebar-footer {
    padding: 16px; border-top: 1px solid #21262d;
  }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px;
    border-radius: 8px; background: #21262d;
  }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #4caf7d, #13928e);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: #e6edf3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 11px; color: #8b949e; }
  .logout-btn {
    background: none; border: none; color: #8b949e; cursor: pointer;
    font-size: 14px; padding: 4px; border-radius: 4px; transition: color 0.15s;
  }
  .logout-btn:hover { color: #f85149; }
 
  /* MAIN */
  .main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; }
 
  /* TOPBAR */
  .topbar {
    background: #161b22; border-bottom: 1px solid #21262d;
    padding: 16px 32px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .page-title { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 600; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .badge-online {
    display: flex; align-items: center; gap: 6px; font-size: 12px; color: #4caf7d;
    background: #1a2f23; padding: 4px 12px; border-radius: 20px;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: #4caf7d; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
 
  /* CONTENT */
  .content { padding: 32px; flex: 1; }
 
  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: #161b22; border: 1px solid #21262d; border-radius: 12px;
    padding: 20px; position: relative; overflow: hidden; transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: #30363d; }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .stat-card.green::before { background: linear-gradient(90deg, #4caf7d, #13928e); }
  .stat-card.teal::before { background: linear-gradient(90deg, #13928e, #2196b0); }
  .stat-card.blue::before { background: linear-gradient(90deg, #2196b0, #5c7cfa); }
  .stat-card.orange::before { background: linear-gradient(90deg, #e8a838, #f85149); }
  .stat-icon { font-size: 24px; margin-bottom: 12px; }
  .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; color: #e6edf3; }
  .stat-label { font-size: 12px; color: #8b949e; margin-top: 4px; }
 
  /* TABLE */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 15px; font-weight: 600; }
  .table-card {
    background: #161b22; border: 1px solid #21262d; border-radius: 12px; overflow: hidden;
  }
  .table-search {
    padding: 14px 20px; border-bottom: 1px solid #21262d;
  }
  .search-input {
    background: #0d1117; border: 1px solid #30363d; border-radius: 8px;
    padding: 8px 14px; color: #e6edf3; font-size: 13px; width: 280px; outline: none;
    font-family: 'DM Sans', sans-serif; transition: border-color 0.15s;
  }
  .search-input:focus { border-color: #4caf7d; }
  .search-input::placeholder { color: #484f58; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: #0d1117; }
  th {
    padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 600;
    color: #8b949e; letter-spacing: 0.8px; text-transform: uppercase;
    border-bottom: 1px solid #21262d;
  }
  td { padding: 14px 20px; font-size: 13px; border-bottom: 1px solid #161b22; color: #c9d1d9; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #1c2128; }
  .cat-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .qty-bar { display: flex; align-items: center; gap: 10px; }
  .qty-track {
    width: 80px; height: 4px; background: #21262d; border-radius: 2px; overflow: hidden;
  }
  .qty-fill { height: 100%; border-radius: 2px; }
  .empty-state {
    text-align: center; padding: 60px 20px; color: #484f58;
  }
  .empty-state .icon { font-size: 40px; margin-bottom: 12px; }
  .empty-state p { font-size: 14px; }
 
  /* DOACOES */
  .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .doacao-card {
    background: #161b22; border: 1px solid #21262d; border-radius: 12px;
    padding: 18px; transition: all 0.2s;
  }
  .doacao-card:hover { border-color: #30363d; transform: translateY(-2px); }
  .doacao-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .doacao-nome { font-weight: 600; font-size: 14px; color: #e6edf3; }
  .doacao-data { font-size: 11px; color: #8b949e; margin-top: 2px; }
  .coletada-badge {
    font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 10px;
  }
  .coletada-badge.sim { background: #1a2f23; color: #4caf7d; }
  .coletada-badge.nao { background: #2d1f0a; color: #e8a838; }
  .doacao-info { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
  .info-pill {
    background: #21262d; border-radius: 6px; padding: 4px 10px;
    font-size: 12px; color: #8b949e;
  }
 
  /* LOGIN */
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #0d1117; position: relative; overflow: hidden;
  }
  .login-bg {
    position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 600px 400px at 20% 50%, rgba(76,175,125,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 400px 600px at 80% 20%, rgba(19,146,142,0.05) 0%, transparent 70%);
  }
  .login-card {
    background: #161b22; border: 1px solid #21262d; border-radius: 16px;
    padding: 40px; width: 380px; position: relative; z-index: 1;
  }
  .login-logo { margin-bottom: 32px; }
  .login-logo h1 {
    font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700;
    color: #4caf7d; letter-spacing: -1px;
  }
  .login-logo h1 span { color: #13928e; }
  .login-logo p { font-size: 13px; color: #8b949e; margin-top: 6px; }
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12px; font-weight: 600; color: #8b949e; margin-bottom: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
  .form-input {
    width: 100%; background: #0d1117; border: 1px solid #30363d; border-radius: 8px;
    padding: 11px 14px; color: #e6edf3; font-size: 14px; outline: none;
    font-family: 'DM Sans', sans-serif; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: #4caf7d; }
  .form-input::placeholder { color: #484f58; }
  .login-btn {
    width: 100%; background: linear-gradient(135deg, #4caf7d, #13928e);
    border: none; border-radius: 8px; padding: 12px; color: #fff;
    font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s; margin-top: 8px;
  }
  .login-btn:hover { opacity: 0.9; }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .error-msg {
    background: #2d0f0f; border: 1px solid #5a1a1a; border-radius: 8px;
    padding: 10px 14px; font-size: 13px; color: #f85149; margin-bottom: 16px;
  }
 
  .loading { display: flex; align-items: center; justify-content: center; padding: 60px; color: #8b949e; }
  .spinner {
    width: 20px; height: 20px; border: 2px solid #21262d;
    border-top-color: #4caf7d; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 10px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
 
  .tabs { display: flex; gap: 4px; background: #0d1117; border-radius: 10px; padding: 4px; margin-bottom: 24px; width: fit-content; }
  .tab {
    padding: 8px 18px; border-radius: 7px; cursor: pointer; font-size: 13px;
    font-weight: 500; color: #8b949e; transition: all 0.15s; border: none; background: none;
  }
  .tab.active { background: #161b22; color: #e6edf3; box-shadow: 0 1px 3px rgba(0,0,0,0.4); }
`;
 
export default function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [aba, setAba] = useState('estoque');
  const [itens, setItens] = useState([]);
  const [doacoes, setDoacoes] = useState([]);
  const [doadores, setDoadores] = useState([]);
  const [entidades, setEntidades] = useState([]);
  const [pontos, setPontos] = useState([]);
  const [busca, setBusca] = useState('');
 
  const login = async () => {
    setLoading(true); setErro('');
    try {
      const resp = await fetch(`${API_URL}/o/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=password&username=${username}&password=${password}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
      });
      const data = await resp.json();
      if (data.access_token) {
        setToken(data.access_token);
        await carregarDados(data.access_token);
      } else {
        setErro('Usuário ou senha inválidos');
      }
    } catch {
      setErro('Erro ao conectar com a API. Verifique se o servidor está rodando.');
    }
    setLoading(false);
  };
 
  const carregarDados = async (t) => {
  const headers = { Authorization: `Bearer ${t}` };
  const [r1, r2, r3, r4, r5] = await Promise.all([
    fetch(`${API_URL}/item/`, { headers }),
    fetch(`${API_URL}/doacoes/`, { headers }),
    fetch(`${API_URL}/doadores/`, { headers }),
    fetch(`${API_URL}/entidades/`, { headers }),
    fetch(`${API_URL}/pontos-coleta/`, { headers }),
  ]);
  const [d1, d2, d3, d4, d5] = await Promise.all([r1.json(), r2.json(), r3.json(), r4.json(), r5.json()]);
  setItens(d1.results || d1 || []);
  setDoacoes(d2.results || d2 || []);
  setDoadores(d3.results || d3 || []);
  setEntidades(d4.results || d4 || []);
  setPontos(d5.results || d5 || []);
};
 
  if (!token) {
    return (
      <>
        <style>{styles}</style>
        <div className="login-page">
          <div className="login-bg" />
          <div className="login-card">
            <div className="login-logo">
              <h1>Soli<span>Bank</span></h1>
              <p>Plataforma de Gestão de Doações</p>
            </div>
            {erro && <div className="error-msg">{erro}</div>}
            <div className="form-group">
              <label className="form-label">Usuário</label>
              <input className="form-input" placeholder="Digite seu usuário" value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()} />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()} />
            </div>
            <button className="login-btn" onClick={login} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </>
    );
  }
 
  const itensFiltrados = itens.filter(i =>
    i.nome?.toLowerCase().includes(busca.toLowerCase())
  );
 
  const totalItens = itens.reduce((s, i) => s + (i.quantidade || 0), 0);
  const doacoesPendentes = doacoes.filter(d => !d.coletada).length;
 
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h1>Soli<span>Bank</span></h1>
            <p>Gestão de Doações</p>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-label">Menu</div>
            {[
              { id: 'estoque', icon: '📦', label: 'Estoque' },
              { id: 'doacoes', icon: '🤝', label: 'Doações' },
              { id: 'doadores', icon: '👥', label: 'Doadores' },
              { id: 'entidades', icon: '🏢', label: 'Entidades' },
              { id: 'pontos', icon: '📍', label: 'Pontos de Coleta' },
            ].map(item => (
              <div key={item.id} className={`nav-item ${aba === item.id ? 'active' : ''}`}
                onClick={() => setAba(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="avatar">{username[0]?.toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{username}</div>
                <div className="user-role">Administrador</div>
              </div>
              <button className="logout-btn" onClick={() => { setToken(''); setUsername(''); setPassword(''); }} title="Sair">✕</button>
            </div>
          </div>
        </aside>
 
        {/* MAIN */}
        <main className="main">
          <div className="topbar">
            <span className="page-title">
              {aba === 'estoque' ? 'Estoque' : aba === 'doacoes' ? 'Doações' : 'Doadores'}
            </span>
            <div className="topbar-right">
              <span className="badge-online"><span className="dot" />API Conectada</span>
            </div>
          </div>
 
          <div className="content">
            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card green">
                <div className="stat-icon">📦</div>
                <div className="stat-value">{itens.length}</div>
                <div className="stat-label">Tipos de itens</div>
              </div>
              <div className="stat-card teal">
                <div className="stat-icon">🔢</div>
                <div className="stat-value">{totalItens}</div>
                <div className="stat-label">Unidades em estoque</div>
              </div>
              <div className="stat-card blue">
                <div className="stat-icon">🤝</div>
                <div className="stat-value">{doacoes.length}</div>
                <div className="stat-label">Doações registradas</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">⏳</div>
                <div className="stat-value">{doacoesPendentes}</div>
                <div className="stat-label">Pendentes de coleta</div>
              </div>
            </div>
 
            {/* ESTOQUE */}
            {aba === 'estoque' && (
              <>
                <div className="section-header">
                  <span className="section-title">Itens em Estoque</span>
                </div>
                <div className="table-card">
                  <div className="table-search">
                    <input className="search-input" placeholder="🔍  Buscar item..." value={busca}
                      onChange={e => setBusca(e.target.value)} />
                  </div>
                  {itensFiltrados.length === 0 ? (
                    <div className="empty-state">
                      <div className="icon">📭</div>
                      <p>Nenhum item encontrado</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Categoria</th>
                          <th>Quantidade</th>
                          <th>Unidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itensFiltrados.map(item => {
                          const maxQty = Math.max(...itens.map(i => i.quantidade || 0), 1);
                          const cor = CAT_COLORS[item.categoria] || '#8b949e';
                          return (
                            <tr key={item.id}>
                              <td style={{ fontWeight: 500, color: '#e6edf3' }}>{item.nome}</td>
                              <td>
                                <span className="cat-badge" style={{ background: cor + '22', color: cor }}>
                                  {CATEGORIAS[item.categoria] || item.categoria}
                                </span>
                              </td>
                              <td>
                                <div className="qty-bar">
                                  <span style={{ fontWeight: 600, color: '#e6edf3', minWidth: 30 }}>{item.quantidade}</span>
                                  <div className="qty-track">
                                    <div className="qty-fill" style={{ width: `${Math.min((item.quantidade / maxQty) * 100, 100)}%`, background: cor }} />
                                  </div>
                                </div>
                              </td>
                              <td style={{ color: '#8b949e' }}>{item.unidade_medida}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
 
            {/* DOACOES */}
            {aba === 'doacoes' && (
              <>
                <div className="section-header">
                  <span className="section-title">Doações Registradas</span>
                </div>
                {doacoes.length === 0 ? (
                  <div className="empty-state"><div className="icon">🤝</div><p>Nenhuma doação cadastrada</p></div>
                ) : (
                  <div className="cards-grid">
                    {doacoes.map(d => {
                      const cor = CAT_COLORS[d.categoria] || '#8b949e';
                      const data = d.data_doacao ? new Date(d.data_doacao).toLocaleDateString('pt-BR') : '—';
                      return (
                        <div key={d.id} className="doacao-card">
                          <div className="doacao-header">
                            <div>
                              <div className="doacao-nome">{d.nome}</div>
                              <div className="doacao-data">{data}</div>
                            </div>
                            <span className={`coletada-badge ${d.coletada ? 'sim' : 'nao'}`}>
                              {d.coletada ? '✓ Coletada' : '⏳ Pendente'}
                            </span>
                          </div>
                          <div className="doacao-info">
                            <span className="info-pill" style={{ color: cor }}>
                              {CATEGORIAS[d.categoria] || d.categoria}
                            </span>
                            <span className="info-pill">{d.quantidade} {d.unidade_medida}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
 
            {/* DOADORES */}
            {aba === 'doadores' && (
              <>
                <div className="section-header">
                  <span className="section-title">Doadores Cadastrados</span>
                </div>
                <div className="table-card">
                  {doadores.length === 0 ? (
                    <div className="empty-state"><div className="icon">👥</div><p>Nenhum doador cadastrado</p></div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Tipo</th>
                          <th>Email</th>
                          <th>Telefone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doadores.map(d => (
                          <tr key={d.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                  width: 30, height: 30, borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #4caf7d, #13928e)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0
                                }}>{d.nome?.[0]?.toUpperCase()}</div>
                                <span style={{ fontWeight: 500, color: '#e6edf3' }}>{d.nome}</span>
                              </div>
                            </td>
                            <td>
                              <span className="cat-badge" style={{ background: d.tipo === 'PF' ? '#13928e22' : '#2196b022', color: d.tipo === 'PF' ? '#13928e' : '#2196b0' }}>
                                {d.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                              </span>
                            </td>
                            <td style={{ color: '#8b949e' }}>{d.email}</td>
                            <td style={{ color: '#8b949e' }}>{d.telefone || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
            {aba === 'entidades' && (
  <>
    <div className="section-header">
      <span className="section-title">Entidades Beneficiadas</span>
    </div>
    <div className="table-card">
      {entidades.length === 0 ? (
        <div className="empty-state"><div className="icon">🏢</div><p>Nenhuma entidade cadastrada</p></div>
      ) : (
        <table>
          <thead><tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Endereço</th></tr></thead>
          <tbody>
            {entidades.map(e => (
              <tr key={e.id}>
                <td style={{ fontWeight: 500, color: '#e6edf3' }}>{e.nome}</td>
                <td style={{ color: '#8b949e' }}>{e.email || '—'}</td>
                <td style={{ color: '#8b949e' }}>{e.telefone || '—'}</td>
                <td style={{ color: '#8b949e' }}>{e.endereco || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
)}

{aba === 'pontos' && (
  <>
    <div className="section-header">
      <span className="section-title">Pontos de Coleta</span>
    </div>
    <div className="table-card">
      {pontos.length === 0 ? (
        <div className="empty-state"><div className="icon">📍</div><p>Nenhum ponto de coleta cadastrado</p></div>
      ) : (
        <table>
          <thead><tr><th>Nome</th><th>Endereço</th><th>Telefone</th></tr></thead>
          <tbody>
            {pontos.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500, color: '#e6edf3' }}>{p.nome}</td>
                <td style={{ color: '#8b949e' }}>{p.endereco || '—'}</td>
                <td style={{ color: '#8b949e' }}>{p.telefone || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
)}
          </div>
        </main>
      </div>
    </>
  );
}