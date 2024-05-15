export const checkValidData = (email, password) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  if (!email) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(email)) {
    errors.email = "This is not a valid email format.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 4) {
    errors.password = "Password must be more than 4 characters.";
  } else if (password.length > 10) {
    errors.password = "Password cannot exceed more than 10 characters.";
  }

  return errors;
};
