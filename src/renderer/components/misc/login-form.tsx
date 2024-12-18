import {
    Separator,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@renderer/components/ui";
  import { useContext } from "react";
  import { Button } from "@renderer/components/ui";
  import { Link } from "react-router-dom";
  import { AppSettingsProviderContext } from "@renderer/context";
  import {
    GithubLoginButton,
  } from "@renderer/components";
  import { EmailLoginForm } from "./email-login-form";
  
  export const LoginForm = () => {
    const { user } = useContext(AppSettingsProviderContext);
  
  
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{!user ? '登录' : '登录成功'}</CardTitle>
        </CardHeader>
  
        <CardContent>
          { !user ? (     
            <div>
              <EmailLoginForm />
              <div className="">
                <Separator className="my-4" />
                <div className="flex items-center space-x-2 justify-center">
                  <GithubLoginButton />
                </div>
              </div>
            </div>     
            ) : (
            <div className="flex justify-center">
              <Link to="/" replace>
                 <Button className="w-24">开始使用</Button>
              </Link>
            </div>)}
        </CardContent>
      </Card>
    );
  };
  