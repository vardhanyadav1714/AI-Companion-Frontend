import LoginForm from "./login-form";

export default function LoginPage() {
  return <LoginForm googleClientId={process.env.GOOGLE_CLIENT_ID || ""} />;
}
