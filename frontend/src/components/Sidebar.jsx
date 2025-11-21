export default function Sidebar({ activeView, setActiveView, onLogout }) {
  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 h-screen p-6 flex flex-col">
      <nav className="flex-1 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Menu</h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveView('teams')}
                className={`w-full text-left block px-4 py-2 rounded ${activeView === 'teams' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Equipes
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('members')}
                className={`w-full text-left block px-4 py-2 rounded ${activeView === 'members' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Membros
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveView('tasks')}
                className={`w-full text-left block px-4 py-2 rounded ${activeView === 'tasks' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              >
                Tarefas
              </button>
            </li>
          </ul>
        </div>
      </nav>
      
      <button 
        onClick={onLogout}
        className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sair
      </button>
    </aside>
  );
}
