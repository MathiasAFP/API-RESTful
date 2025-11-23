import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TeamList from '../features/Teams/TeamList';
import MemberList from '../features/Members/MemberList';
import TaskList from '../features/Tasks/TaskList';
import { useState } from 'react';

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleAddMemberToProject = (projetoId, projetoNome) => {
    setActiveView('members');
    // Dispara evento para o MemberList pré-selecionar o projeto
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('addMemberToProject', { 
        detail: { projetoId, projetoNome } 
      }));
    }, 100);
  };

  const getMainContent = () => {
    switch(activeView) {
      case 'teams':
        return <TeamList onAddMemberToProject={handleAddMemberToProject} />;
      case 'members':
        return <MemberList />;
      case 'tasks':
        return <TaskList />;
      default:
        return <TeamList onAddMemberToProject={handleAddMemberToProject} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <Header onLogout={handleLogout} />
        <main className="flex-1 overflow-auto">
          {getMainContent()}
        </main>
      </div>
    </div>
  );
}
