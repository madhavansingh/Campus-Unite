export type UserRole = 'user' | 'organizer' | 'authority';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stream?: string;
  skills?: string[];
  hobbies?: string[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  tags: string[];
  organizerId: string;
  organizerName: string;
  status: 'pending' | 'approved' | 'denied';
  rsvps?: string[];
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  time?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
}
