import React, { useState, useEffect } from 'react';
import Header from './components/header';
import api from './services/api';

import './App.css';

function App() {
  const [projects, setProjects] = useState([]);

  async function handleAddProject()  {
    const project = await api.post('projects', { title: `Novo Projeto ${Date.now()}`, owner: 'Bruno'});
    setProjects([...projects, project.data]);
  }

  useEffect(() => {
    api.get('projects').then(response => {
      const { data } = response;
      setProjects(data);
    });
  }, []);

  return (
    <>
      <Header title="Homepage" />
      <ul>
        {
          projects.map(project => <li key={project.id} >{project.title}</li>)
        }
      </ul>
      <button type="button" onClick={handleAddProject}> Adicionar Projeto</button>
    </>
  );
}

export default App;