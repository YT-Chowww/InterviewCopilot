import { Outlet, Link } from "react-router-dom";
// import {
//   AppSettingsProviderContext,
// } from "@renderer/context";
// import { useContext } from "react";
import { Button } from "@renderer/components/ui/button";

export const Layout = () => {
  // const { user } = useContext(AppSettingsProviderContext);

  // if (!user) {
    return (
      <div
        className="h-screen flex justify-center items-center"
        date-testid="layout-onboarding"
      >
        <div className="text-center">
          <div className="text-lg mb-6">
            欢迎来到<span className="font-semibold"> Interview Copilot App</span>
          </div>

          <div className="">
            <Link to="/home" replace>
              <Button size="lg">开始使用</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  // } else {
  //   return (
  //     <div className="min-h-screen" data-testid="layout-home">
  //       <div className="flex flex-start">
  //         <div className="flex-1 border-l overflow-x-hidden">
  //           <Outlet />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
};
