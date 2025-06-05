import { LoginForm } from "@/components/login-form"

export function Login() {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <img
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
          alt="Team working in a call center"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  )
}