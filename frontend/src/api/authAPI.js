const API_URL = 'http://localhost:3000';

export const loginAPI = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login API failed')
    }

    const { data, token } = response.json();
    localStorage.setItem('token', token);

    return data;
  } catch (err) {
    console.error('Error logging in', err.message);
    throw err;
  }
};