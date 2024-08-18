import { useNavigate } from "react-router-dom";

const logoutUser = async () => {
  const navigate = useNavigate();
  try {
    const response = await fetch("http://localhost:3000/api/users/logout", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    });
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export { logoutUser };
