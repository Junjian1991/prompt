import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users: User[] = JSON.parse(data);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return null;
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error verifying password:', error);
    return null;
  }
}

export async function createUser(name: string, email: string, password: string): Promise<User | null> {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users: User[] = JSON.parse(data);
    
    if (users.find(u => u.email === email)) {
      return null;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword
    };
    
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export function getUserByEmail(email: string): User | null {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users: User[] = JSON.parse(data);
    return users.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
