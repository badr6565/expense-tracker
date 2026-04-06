export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

const USERS_KEY = 'et_users';
const CURRENT_USER_KEY = 'et_current_user';

export function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function hashPassword(password: string): string {
  return btoa(unescape(encodeURIComponent(password)));
}

export function createUser(name: string, email: string, password: string): User {
  const users = getUsers();
  const user: User = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  return user;
}

export function verifyPassword(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  if (!user) return null;
  return user.passwordHash === hashPassword(password) ? user : null;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function seedDemoUser(): void {
  const users = getUsers();
  if (users.length === 0) {
    createUser('Demo User', 'demo@example.com', 'password123');
  }
}
