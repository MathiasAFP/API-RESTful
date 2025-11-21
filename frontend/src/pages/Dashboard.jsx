import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TeamList from '../features/Teams/TeamList';
import { useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('teams');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getMainContent = () => {
    switch(activeView) {
      case 'teams':
        return <TeamList />;
      case 'members':
        return <div className="p-6"><h2 className="text-2xl font-bold">Membros</h2></div>;
      case 'tasks':
        return <div className="p-6"><h2 className="text-2xl font-bold">Tarefas</h2></div>;
      default:
        return <TeamList />;
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
