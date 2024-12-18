
import { LoginForm } from "@renderer/components";

export default () => {

  return (
    <div className="h-screen w-full px-4 py-6 lg:px-8 flex flex-col">


      <div className="flex-1 flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};
