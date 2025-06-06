import { LoginForm } from "@/components/login-form"

export function Login() {
  return (
    <div className="min-h-screen w-full bg-muted flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </div>
  )
}