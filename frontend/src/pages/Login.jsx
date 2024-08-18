import {
  Input,
  Stack,
  InputGroup,
  InputLeftAddon,
  Button,
  Spinner
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import siteLogo from "../images/site-logo-white.png";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useSWRConfig } from "swr";
import LoadingPage from "../components/built/LoadingPage";
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const context = useOutletContext();
  const { mutate } = useSWRConfig();
  const navigate = useNavigate();

  useEffect(() => {
    if (context.profile.name) {
      console.log("##login - alreadt logged in ");
      navigate("/");
    }
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // add something here that will check if there's already a logged in account
    if (username && password) {
      try {
        const body = { name: username, password: password };
        const response = await fetch("http://localhost:3000/api/users/login", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        await mutate("http://localhost:3000/api/users/profile");
        setIsLoading(false);
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please complete input fields");
    }
  };
  const onNameChange = (e) => {
    setUsername(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      {isLoading ? (
        <LoadingPage></LoadingPage>
      ) : (
        <div className="bg-extGray text-extWhite">
          <div className="flex flex-col mx-auto h-dvh max-w-[600px]">
            <div className="py-10 max-w-[80%] mx-auto">
              <img
                src={siteLogo}
                alt="Liquid Drive"
                className="h-full w-full object-contain "
              />
            </div>
            <div>
              <form
                action="api/users/login"
                className="flex flex-col gap-4 justify-center"
                onSubmit={onSubmitForm}
              >
                <div className="mx-auto flex flex-col gap-4">
                  <InputGroup className="self-center">
                    <InputLeftAddon className="bg-extGreen py-1 px-2 text-center">
                      <p className="w-[80px]">Username</p>
                    </InputLeftAddon>
                    <Input
                      type="text"
                      placeholder="my-awesome-password"
                      className="pl-3 w-[300px] text-black outline-none"
                      value={username}
                      onChange={onNameChange}
                    />
                  </InputGroup>

                  {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
                  <InputGroup>
                    <InputLeftAddon className="bg-extGreen py-1 px-2 text-center">
                      <p className="w-[80px]">Password</p>
                    </InputLeftAddon>
                    <Input
                      type="password"
                      placeholder="my-awesome-password"
                      className="pl-3 w-[300px] text-black outline-none"
                      value={password}
                      onChange={onPasswordChange}
                    />
                  </InputGroup>
                </div>

                <Button
                  type="submit"
                  variant="solid"
                  className="bg-extGreen w-[150px] py-2 mx-auto"
                >
                  Login
                </Button>
                <div>
                  <p>Create account here</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default LoginPage;
