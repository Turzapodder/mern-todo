import { useNavigate } from "react-router-dom"
import { SignupForm } from "../components/signup-form"
import { useAuth } from "../hooks/useAuth"

export function SignupPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSignupSuccess = (token: string, user: any) => {
    // Store token and user in auth context
    login(token, user)
    
    // Redirect to dashboard or home page
    navigate("/")
  }

  const handleSignupError = (error: string) => {
    console.error("Signup error:", error)
    // Error is already displayed in the form component
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignupForm
        onSuccess={handleSignupSuccess}
        onError={handleSignupError}
        className="w-full max-w-sm"
      />
    </div>
  )
}