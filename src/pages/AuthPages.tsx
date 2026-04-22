import AuthForm from "@/components/auth/AuthForm";

export const LoginPage = () => <AuthForm mode="login" />;
export const RegisterPage = () => <AuthForm mode="register" />;
export const ForgotPasswordPage = () => <AuthForm mode="forgot" />;
export const ResetPasswordPage = () => <AuthForm mode="reset" />;
