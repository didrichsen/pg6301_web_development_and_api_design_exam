import LoginWithMicrosoft from "../Authentication/OpenIdConnect/ActiveDirectory/LoginWithMicrosoft";
import LoginWithGoogle from "../Authentication/OpenIdConnect/Google/LoginWithGoogle";

const LoginPage = ({ applicationConfig }) => {
  return (
    <div className="login-container">
      <button className="login-button">
        <LoginWithMicrosoft applicationConfig={applicationConfig}>
          Login With Microsoft
        </LoginWithMicrosoft>
      </button>
      <button className="login-button">
        <LoginWithGoogle applicationConfig={applicationConfig}>
          Login With Google
        </LoginWithGoogle>
      </button>
    </div>
  );
};

export default LoginPage;
