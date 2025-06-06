import { RegisterForm } from "@/components/register-form"

export function Register() {
  return (
    <div className="min-h-screen w-full bg-muted flex items-center justify-center p-6">
      <div className="w-full max-w-md mx-auto">
        <RegisterForm />
      </div>
    </div>
  )
}