import { StakeholderRole } from '@/types/foodlink';

export interface DemoUser {
  email: string;
  password: string;
  role: StakeholderRole;
  roleName: string;
  name: string;
  organization: string;
  title: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'provider@foodlink.demo',
    password: 'FoodLink123',
    role: 'provider',
    roleName: 'Food Provider',
    name: 'Elena Rostova',
    organization: 'Central Catering & Commercial Kitchen',
    title: 'Executive Kitchen Lead',
  },
  {
    email: 'delivery@foodlink.demo',
    password: 'FoodLink123',
    role: 'delivery',
    roleName: 'Delivery Partner',
    name: 'Marcus Vance',
    organization: 'Metro Logistics Courier Fleet',
    title: 'Dedicated Courier #08',
  },
  {
    email: 'receiver@foodlink.demo',
    password: 'FoodLink123',
    role: 'receiver',
    roleName: 'Receiving Organization',
    name: 'Sarah Jenkins',
    organization: 'Downtown Community Shelter',
    title: 'Food Resource Coordinator',
  },
];

export interface ValidationResult {
  success: boolean;
  error?: string;
  errorField?: 'both' | 'email' | 'password';
  user?: DemoUser;
}

export function validateCredentials(emailInput: string, passwordInput: string): ValidationResult {
  const trimmedEmail = (emailInput || '').trim();
  const password = passwordInput || '';

  // TEST 1: Empty email + empty password
  if (!trimmedEmail && !password) {
    return {
      success: false,
      error: 'Please enter your email and password.',
      errorField: 'both',
    };
  }

  // TEST 3: Empty email + valid password
  if (!trimmedEmail) {
    return {
      success: false,
      error: 'Please enter your email.',
      errorField: 'email',
    };
  }

  // TEST 2: Valid email + empty password
  if (!password) {
    return {
      success: false,
      error: 'Please enter your password.',
      errorField: 'password',
    };
  }

  // TEST 4: Unknown email + any password
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      error: 'Invalid user',
      errorField: 'email',
    };
  }

  // TEST 5: Valid demo email + incorrect password
  if (user.password !== password) {
    return {
      success: false,
      error: 'Invalid password',
      errorField: 'password',
    };
  }

  return {
    success: true,
    user,
  };
}

const AUTH_COOKIE_NAME = 'foodlink_demo_auth';

export function getClientSession(): DemoUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(AUTH_COOKIE_NAME);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.role) {
        return parsed;
      }
    }

    // Fallback check in document.cookie
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${AUTH_COOKIE_NAME}=`));
    if (match) {
      const val = decodeURIComponent(match.split('=')[1]);
      return JSON.parse(val);
    }
  } catch (err) {
    console.error('Failed to parse auth session', err);
  }

  return null;
}

export function setClientSession(user: DemoUser) {
  if (typeof window === 'undefined') return;

  try {
    const serialized = JSON.stringify(user);
    localStorage.setItem(AUTH_COOKIE_NAME, serialized);
    document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(
      serialized
    )}; path=/; max-age=86400; SameSite=Lax`;
  } catch (err) {
    console.error('Failed to save auth session', err);
  }
}

export function clearClientSession() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(AUTH_COOKIE_NAME);
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } catch (err) {
    console.error('Failed to clear auth session', err);
  }
}
