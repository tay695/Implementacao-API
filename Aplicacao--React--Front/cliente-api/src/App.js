import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa o Bootstrap

function App() {
  // Estado para guardar os dados que virão do Django
  const [itens, setItens] = useState([]);

  // Esse bloco roda assim que a tela abre
  useEffect(() => {
    fetch('http://127.0.0') 
      .then(response => response.json())           
      .then(data => setItens(data))                
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Cliente API - Meu Projeto</h1>
      <div className="row">
        {itens.map(item => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                {/* Ajuste os campos abaixo de acordo com o seu JSON */}
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
