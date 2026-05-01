import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { Loader2, UserPlus } from "lucide-react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      setIsLoading(true)
      await register(email, password, name)
      toast({
        title: "Account created",
        description: "Please verify your email if required.",
      })
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
            <h1 className="text-lg font-semibold text-foreground">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Start managing your AI call center
            </p>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Jane Smith"
                required
                disabled={isLoading}
                className="h-9 bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jane@company.com"
                required
                disabled={isLoading}
                className="h-9 bg-background border-border focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
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
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>
            ) : (
              <><UserPlus className="mr-2 h-4 w-4" />Create Account</>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </form>

        <div className="flex items-center justify-center border-t border-border px-6 py-3">
          <span className="text-xs text-muted-foreground">
            By creating an account you agree to our{" "}
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Terms</a>
            {" "}and{" "}
            <a href="#" className="hover:text-primary transition-colors underline underline-offset-4">Privacy Policy</a>.
          </span>
        </div>
      </div>
    </div>
  )
}
