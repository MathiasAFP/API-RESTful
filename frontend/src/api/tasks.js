// Tasks API
// Mock de tarefas

const tasks = [
  { id: 1, title: 'Design Homepage', description: 'Criar design da homepage', teamId: 1, status: 'Em Progresso' },
  { id: 2, title: 'API Auth', description: 'Implementar autenticação', teamId: 2, status: 'Concluído' },
  { id: 3, title: 'React Components', description: 'Criar componentes React', teamId: 3, status: 'Pendente' },
];

export const getTasks = async () => {
  return tasks;
};

export const getTasksByTeam = async (teamId) => {
  return tasks.filter(t => t.teamId === teamId);
};

export const createTask = async (task) => {
  const newTask = { id: Math.max(...tasks.map(t => t.id), 0) + 1, ...task };
  tasks.push(newTask);
  return newTask;
};

export const deleteTask = async (id) => {
  const index = tasks.findIndex(t => t.id === id);
  if (index > -1) {
    tasks.splice(index, 1);
  }
  return true;
};

export const updateTask = async (id, updates) => {
  const task = tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, updates);
  }
  return task;
};
