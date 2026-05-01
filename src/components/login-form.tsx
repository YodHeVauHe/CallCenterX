import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { Loader2, LogIn } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      setIsLoading(true)
      await login(email, password)
      toast({ title: "Success", description: "Signed in successfully." })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password."
      toast({
        title: "Sign in failed",
        description: errorMessage === "Email not confirmed"
          ? "Your email has not been verified. Please check your inbox."
          : errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="terminal-surface rounded-b overflow-hidden">
        <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your CallCenterX account
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                disabled={isLoading}
                className="h-9 bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">Password</Label>
                <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="h-9 bg-background border-border focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
            ) : (
              <><LogIn className="mr-2 h-4 w-4" />Sign In</>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline underline-offset-4">
              Create one
            </Link>
          </p>
        </form>

        <div className="flex items-center justify-center border-t border-border px-6 py-3">
          <span className="text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Terms</a>
            {" "}and{" "}
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Privacy Policy</a>.
          </span>
        </div>
      </div>
    </div>
  )
}
