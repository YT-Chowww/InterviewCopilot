import { Button, Input, Label } from "@renderer/components/ui";
import {  useState } from "react";
import { useLogin } from "@renderer/hooks/use-login";

export const EmailLoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signIn }  = useLogin();

  return (
    <div className="w-full">
      <div className="w-full grid gap-4 mb-6">
        <div className="grid gap-2">
          <Label htmlFor="email">邮箱</Label>
          <Input
            id="email"
            className="h-10"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">密码</Label>
          <Input
            id="password"
            className="h-10"
            type="password"
            placeholder="请输入密码"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={()=>{signIn('credentials', {
            email,
            password
          })}}
        >
          登录
        </Button>
      </div>
    </div>
  );
};
