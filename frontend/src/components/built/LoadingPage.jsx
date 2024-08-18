import { Spinner } from "@chakra-ui/react";
const LoadingPage = () => {
  return (
    <div className="bg-extGray flex items-center content-center h-screen mx-auto">
      <Spinner className="size-20 mx-auto text-white" thickness="20px" />
    </div>
  );
};
export default LoadingPage;
