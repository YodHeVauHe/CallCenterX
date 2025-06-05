import { RegisterForm } from "@/components/register-form"

export function Register() {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2">
      <div className="relative hidden md:block">
        <img
          src="https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg"
          alt="Modern office workspace"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center p-4">
        <RegisterForm />
      </div>
    </div>
  )
}