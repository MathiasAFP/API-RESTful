export default function Header({ onLogout }) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Projetos</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Perfil</button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
