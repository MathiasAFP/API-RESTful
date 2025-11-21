import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data
let users = [
  { id: 1, name: 'Admin', email: 'admin@example.com', password: '123456' }
];

let teams = [
  { id: 1, name: 'Frontend', userId: 1 },
  { id: 2, name: 'Backend', userId: 1 }
];

let members = [
  { id: 1, name: 'João Silva', teamId: 1 },
  { id: 2, name: 'Maria Santos', teamId: 2 }
];

let tasks = [
  { id: 1, title: 'Implementar login', status: 'completed' },
  { id: 2, title: 'Criar API', status: 'in_progress' }
];

// Tokens
const tokens = {};

// ===== AUTH ROUTES =====
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  const userExists = users.some(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Usuário já existe' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };

  users.push(newUser);
  const token = `token_${Date.now()}_${Math.random()}`;
  tokens[token] = newUser.id;

  res.json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  const token = `token_${Date.now()}_${Math.random()}`;
  tokens[token] = user.id;

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
});

// Middleware de autenticação
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token || !tokens[token]) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  req.userId = tokens[token];
  next();
}

// ===== TEAMS ROUTES - RESPONSABILIDADE: FELIPE =====
app.get('/api/teams', authMiddleware, (req, res) => {
  const userTeams = teams.filter(t => t.userId === req.userId);
  res.json(userTeams);
});

app.post('/api/teams', authMiddleware, (req, res) => {
  const { name, description } = req.body;

  const newTeam = {
    id: Math.max(...teams.map(t => t.id), 0) + 1,
    name,
    description: description || '',
    userId: req.userId
  };

  teams.push(newTeam);
  res.status(201).json(newTeam);
});

app.delete('/api/teams/:id', authMiddleware, (req, res) => {
  const teamIndex = teams.findIndex(t => t.id == req.params.id && t.userId === req.userId);

  if (teamIndex === -1) {
    return res.status(404).json({ message: 'Equipe não encontrada' });
  }

  teams.splice(teamIndex, 1);
  res.json({ message: 'Equipe deletada' });
});

// ===== MEMBERS ROUTES - RESPONSABILIDADE: LUAN =====
app.get('/api/members', authMiddleware, (req, res) => {
  const userTeams = teams.filter(t => t.userId === req.userId).map(t => t.id);
  const userMembers = members.filter(m => userTeams.includes(m.teamId));

  const membersWithTeamName = userMembers.map(m => {
    const team = teams.find(t => t.id === m.teamId);
    return { ...m, teamName: team?.name };
  });

  res.json(membersWithTeamName);
});

app.post('/api/members', authMiddleware, (req, res) => {
  const { name, team } = req.body;

  const teamExists = teams.find(t => t.id == team && t.userId === req.userId);
  if (!teamExists) {
    return res.status(404).json({ message: 'Equipe não encontrada' });
  }

  const newMember = {
    id: Math.max(...members.map(m => m.id), 0) + 1,
    name,
    teamId: parseInt(team)
  };

  members.push(newMember);
  res.status(201).json(newMember);
});

app.delete('/api/members/:id', authMiddleware, (req, res) => {
  const memberIndex = members.findIndex(m => m.id == req.params.id);

  if (memberIndex === -1) {
    return res.status(404).json({ message: 'Membro não encontrado' });
  }

  members.splice(memberIndex, 1);
  res.json({ message: 'Membro deletado' });
});

// ===== TASKS ROUTES =====
app.get('/api/tasks', authMiddleware, (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', authMiddleware, (req, res) => {
  const { title, status } = req.body;

  const newTask = {
    id: Math.max(...tasks.map(t => t.id), 0) + 1,
    title,
    status: status || 'pending'
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', authMiddleware, (req, res) => {
  const { status } = req.body;
  const task = tasks.find(t => t.id == req.params.id);

  if (!task) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }

  task.status = status;
  res.json(task);
});

app.delete('/api/tasks/:id', authMiddleware, (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id == req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Tarefa deletada' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
