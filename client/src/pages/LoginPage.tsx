import { useNavigate } from "react-router-dom"
import { LoginForm } from "../components/login-form"
import { useAuth } from "../hooks/useAuth"


export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth() 

  const handleLoginSuccess = (token: string, user: any) => {
    login(token, user)
    navigate("/")
  }


  const handleLoginError = (error: string) => {
    console.error("Login attempt failed:", error)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      <LoginForm
        className="w-full max-w-sm"
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  )
}
