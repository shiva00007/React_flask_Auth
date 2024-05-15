import { useState } from "react";
import { checkValidData } from "../utlis/validate";
import axios from "axios";

const Login = () => {
  const [isSigninForm, setIsSigninForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleSigninForm = () => {
    setIsSigninForm(!isSigninForm);
    setErrorMessage(null); // Reset error message when switching forms
    setFormData({ name: "", email: "", password: "" }); // Reset form data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleButtonClick = async () => {
    const { name, email, password } = formData;
    const errors = checkValidData(email, password);

    if (Object.keys(errors).length !== 0) {
      setErrorMessage(errors);
      return;
    }

    try {
      const url = isSigninForm
        ? "http://127.0.0.1:5000/login"
        : "http://127.0.0.1:5000/register";
      const payload = isSigninForm
        ? { email, password }
        : { name, email, password };

      const response = await axios.post(url, payload);
      console.log(response);

      if (response.data.success) {
        console.log(response.data.message); // Handle success (e.g., redirect or display a success message)
      } else {
        setErrorMessage(response.data.message); // Display error message from the server
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again."); // Handle network errors
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-sm p-8 bg-black text-white rounded-md shadow-md"
      >
        <h1 className="text-3xl font-bold text-center mb-6">
          {isSigninForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSigninForm && (
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="p-2 my-4 w-full bg-gray-700 rounded-md"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="p-2 my-4 w-full bg-gray-700 rounded-md"
          value={formData.email}
          onChange={handleChange}
        />
        <p className="text-red-700 font-bold text-sm mb-2">
          {errorMessage?.email}
        </p>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="p-2 my-4 w-full bg-gray-700 rounded-md"
          value={formData.password}
          onChange={handleChange}
        />
        <p className="text-red-700 font-bold text-sm mb-2">
          {errorMessage?.password}
        </p>
        <p className="text-red-700 font-bold text-sm mb-4">{errorMessage}</p>
        <button
          className="p-4 mb-4 bg-red-700 w-full rounded-md cursor-pointer hover:bg-red-800"
          onClick={handleButtonClick}
        >
          {isSigninForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="text-center cursor-pointer" onClick={toggleSigninForm}>
          {isSigninForm
            ? "New User? Sign Up Now"
            : "Already Registered? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default Login;
