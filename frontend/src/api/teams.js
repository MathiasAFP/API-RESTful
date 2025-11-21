// Teams API - RESPONSABILIDADE: FELIPE
// Mock de equipes e rotas GET/DELETE

const teams = [
  { id: 1, name: 'Design Team', description: 'Equipe de Design' },
  { id: 2, name: 'Backend Team', description: 'Equipe de Backend' },
  { id: 3, name: 'Frontend Team', description: 'Equipe de Frontend' },
];

export const getTeams = async () => {
  return teams;
};

export const createTeam = async (team) => {
  const newTeam = { id: Math.max(...teams.map(t => t.id), 0) + 1, ...team };
  teams.push(newTeam);
  return newTeam;
};

export const deleteTeam = async (id) => {
  const index = teams.findIndex(t => t.id === id);
  if (index > -1) {
    teams.splice(index, 1);
  }
  return true;
};

export const updateTeam = async (id, updates) => {
  const team = teams.find(t => t.id === id);
  if (team) {
    Object.assign(team, updates);
  }
  return team;
};
