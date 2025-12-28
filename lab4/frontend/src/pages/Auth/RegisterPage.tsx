import React from "react";
import { RegisterPage as AuthRegisterPage } from "../../features/auth/pages/RegisterPage";
import { MetaTags } from "../../app/seo/MetaTags";

const RegisterPage: React.FC = () => {
  return (
    <>
      <MetaTags title="Реєстрація" />
      <AuthRegisterPage />
    </>
  );
};

export default RegisterPage;
