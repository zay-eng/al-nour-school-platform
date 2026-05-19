const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.access_token || user.token;
};

/**
 * Authentication Service - API calls for user authentication
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { success, access_token, user }
   */
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and token in localStorage
      if (data.success && data.access_token) {
        const userData = {
          ...data.user,
          access_token: data.access_token,
          token_type: data.token_type || 'Bearer',
          isAuthenticated: true,
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   * @returns {Promise<Object>}
   */
  logout: async () => {
    try {
      const token = getAuthToken();
      
      if (token) {
        const response = await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn('Logout API call failed, clearing local storage anyway');
        }
      }

      // Clear localStorage regardless of API response
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Clear localStorage even if API call fails
      localStorage.removeItem('user');
      return { success: true };
    }
  },

  /**
   * Logout from all devices
   * @returns {Promise<Object>}
   */
  logoutAll: async () => {
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/auth/logout-all`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Logout all failed');
      }

      // Clear localStorage
      localStorage.removeItem('user');
      
      return data;
    } catch (error) {
      console.error('Logout all error:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise<Object>}
   */
  getCurrentUser: async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user');
      }

      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} passwords - { current_password, new_password, new_password_confirmation }
   * @returns {Promise<Object>}
   */
  changePassword: async (passwords) => {
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(passwords),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return !!(user.isAuthenticated && user.access_token);
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getUser: () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.isAuthenticated ? user : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Get user role
   * @returns {string|null}
   */
  getUserRole: () => {
    const user = authService.getUser();
    return user?.role || null;
  },
};

export default authService;
