import React from "react";
import { LoginPage as AuthLoginPage } from "../../features/auth/pages/LoginPage";
import { MetaTags } from "../../app/seo/MetaTags";

const LoginPage: React.FC = () => {
  return (
    <>
      <MetaTags title="Вхід" />
      <AuthLoginPage />
    </>
  );
};

export default LoginPage;
