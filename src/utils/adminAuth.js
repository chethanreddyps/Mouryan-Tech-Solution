export const ADMIN_TOKEN_KEY = 'adminToken';

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminToken = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminAuth = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem('adminPassword');
};

export const getAdminAuthHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
