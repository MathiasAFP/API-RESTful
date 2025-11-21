// Members API - RESPONSABILIDADE: LUAN
// Mock de membros e relacionamento com equipes

const members = [
  { id: 1, name: 'Felipe Bordignon', email: 'felipe@example.com', teamId: 1 },
  { id: 2, name: 'Luan Martini', email: 'luan@example.com', teamId: 2 },
  { id: 3, name: 'Matheus Polinski', email: 'matheus@example.com', teamId: 3 },
];

export const getMembers = async () => {
  return members;
};

export const getMembersByTeam = async (teamId) => {
  return members.filter(m => m.teamId === teamId);
};

export const createMember = async (member) => {
  const newMember = { id: Math.max(...members.map(m => m.id), 0) + 1, ...member };
  members.push(newMember);
  return newMember;
};

export const deleteMember = async (id) => {
  const index = members.findIndex(m => m.id === id);
  if (index > -1) {
    members.splice(index, 1);
  }
  return true;
};

export const updateMember = async (id, updates) => {
  const member = members.find(m => m.id === id);
  if (member) {
    Object.assign(member, updates);
  }
  return member;
};
