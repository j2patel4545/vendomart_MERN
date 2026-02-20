export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("user");
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
