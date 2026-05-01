import { RegisterForm } from "@/components/register-form"

export function Register() {
  return (
    <div className="dark min-h-svh bg-background flex items-center justify-center p-6">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(142 71% 45%) 1px, transparent 1px), linear-gradient(90deg, hsl(142 71% 45%) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative w-full max-w-sm">
        {/* Terminal window chrome */}
        <div className="mb-1 flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-t border border-b-0 border-border">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive opacity-70" />
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-amber opacity-70" />
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-green opacity-70" />
          <span className="ml-auto text-xs text-muted-foreground">CallCenterX — Register</span>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
