// API utility functions for making authenticated requests

// const API_BASE_URL ='http://127.0.0.1:8000';
const API_BASE_URL ='https://mysite-f1ym.onrender.com';
// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `JWT ${token}` }),
  };
};

// Helper function to handle token refresh
const handleTokenRefresh = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Token refresh failed');
  }

  const { accessToken } = await response.json();
  localStorage.setItem('accessToken', accessToken);
  return accessToken;
};

// Generic API request function with automatic token refresh
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  let response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  // If token expired, try to refresh and retry
  if (response.status === 401) {
    try {
      await handleTokenRefresh();
      response = await fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
};

// Specific API functions for different data types

// Journal API calls
export const journalAPI = {
  getEntries: () => apiRequest('/app/journals/'),
  createEntry: (entry: any) => apiRequest('/app/journals/', {
    method: 'POST',
    body: JSON.stringify(entry),
  }),
  updateEntry: (id: string, entry: any) => apiRequest(`/app/journals/${id}//`, {
    method: 'PATCH',
    body: JSON.stringify(entry),
  }),
  deleteEntry: (id: string) => apiRequest(`/app/journals/${id}//`, {
    method: 'DELETE',
  }),
};

// Goals API calls
export const goalsAPI = {
  getGoals: () => apiRequest('/app/goals/'),
  createGoal: (goal: any) => apiRequest('/app/goals/', {
    method: 'POST',
    body: JSON.stringify(goal),
  }),
  updateGoal: (id: string, goal: any) => apiRequest(`/app/goals/${id}//`, {
    method: 'PATCH',
    body: JSON.stringify({completed:goal.completed}),
  }),
  deleteGoal: (id: string) => apiRequest(`/app/goals/${id}//`, {
    method: 'DELETE',
  }),
};

export const habitsAPI = {
  getHabits: () => apiRequest('/app/habits/'),
  getHabitCompletions: (id: string) => apiRequest(`/app/habits/${id}/completions/`),
  createHabit: (habit: any) => apiRequest('/app/habits/', {
    method: 'POST',
    body: JSON.stringify(habit),
  }),
  updateHabit: (id: string, habit: any) => apiRequest(`/app/habits/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(habit),
  }),
  deleteHabit: (id: string) => apiRequest(`/app/habits/${id}/`, {
    method: 'DELETE',
  }),
  toggleHabit: (id: string, date: string) => apiRequest(`/app/habits/${id}/toggle/`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  }),
  isHabitCompleted: (id: string, date: string) => apiRequest(`/app/habits/${id}/completed?date=${date}`),
  getHabitStats: (id: string) => apiRequest(`/app/habits/${id}/stats/`),
};

// Mood API calls
export const moodAPI = {
  getMoodEntries: () => apiRequest('/app/moods/'),
  createMoodEntry: (entry: any) => apiRequest('/app/moods/', {
    method: 'POST',
    body: JSON.stringify(entry),
  }),
  updateMoodEntry: (id: string, entry: any) => apiRequest(`/app/moods/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  }),
  deleteMoodEntry: (id: string) => apiRequest(`/app/moods/${id}/`, {
    method: 'DELETE',
  }),
};

// Cravings API calls
export const cravingsAPI = {
  getCravings: () => apiRequest('/app/cravings/'),
  createCraving: (craving: any) => apiRequest('/app/cravings/', {
    method: 'POST',
    body: JSON.stringify(craving),
  }),
  updateCraving: (id: string, craving: any) => apiRequest(`/app/cravings/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(craving),
  }),
  deleteCraving: (id: string) => apiRequest(`/app/cravings/${id}/`, {
    method: 'DELETE',
  }),
};

// Support contacts API calls
export const supportAPI = {
  getContacts: () => apiRequest('/support'),
  createContact: (contact: any) => apiRequest('/support', {
    method: 'POST',
    body: JSON.stringify(contact),
  }),
  updateContact: (id: string, contact: any) => apiRequest(`/support/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(contact),
  }),
  deleteContact: (id: string) => apiRequest(`/support/${id}/`, {
    method: 'DELETE',
  }),
};


// User profile API calls
// Add to your existing api.ts file
export const userAPI = {
  getProfile: () => apiRequest('/auth/users/me'),
  getStats: () => apiRequest('/app/profiles/me'),
  updateUser: (data: { first_name: string; last_name: string ; email:string})=> apiRequest('/auth/users/me/', {
    method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(data),
  }),
    updateProfile: (data: { start_date?: string; saved_money?: number }) => apiRequest('/app/profiles/me/', {
    method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },

    body: JSON.stringify(data),
  }),
  updateSobrietyDate: (date: string) => apiRequest('/app/profiles/me/', {
    method: 'PATCH',
    body: JSON.stringify({ start_date: date }),
  }),
  updateDailyCost: (cost: number) => apiRequest('/app/profiles/me/', {
    method: 'PATCH', 
    body: JSON.stringify({ saved_money: cost }),
  }),
};
