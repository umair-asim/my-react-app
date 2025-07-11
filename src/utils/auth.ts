export function getAuthTokenHeader(): { Authorization: string } | {} {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
