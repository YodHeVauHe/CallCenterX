import { RegisterForm } from "@/components/register-form"

export function Register() {
  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}