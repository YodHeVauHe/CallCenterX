import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import { Building2, Users, GraduationCap, Rocket, Briefcase, Building, Loader2, ArrowRight } from 'lucide-react';

const organizationTypes = [
  { value: 'personal',    label: 'Personal',    description: 'For individual use and personal projects',               icon: Users },
  { value: 'educational', label: 'Educational', description: 'For schools, universities, and educational institutions', icon: GraduationCap },
  { value: 'startup',     label: 'Startup',     description: 'For early-stage companies and entrepreneurs',            icon: Rocket },
  { value: 'agency',      label: 'Agency',      description: 'For marketing agencies and service providers',           icon: Briefcase },
  { value: 'company',     label: 'Company',     description: 'For established businesses and enterprises',             icon: Building },
];

const companySizes = [
  { value: '1',       label: 'Just me' },
  { value: '2-10',    label: '2–10 people' },
  { value: '11-50',   label: '11–50 people' },
  { value: '51-200',  label: '51–200 people' },
  { value: '201-500', label: '201–500 people' },
  { value: '500+',    label: '500+ people' },
];

export function SetupOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!organizationName.trim()) {
      toast({ title: 'Error', description: 'Organization name is required.', variant: 'destructive' });
      return;
    }
    if (!organizationType) {
      toast({ title: 'Error', description: 'Please select an organization type.', variant: 'destructive' });
      return;
    }
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to create an organization.', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true);
      await api.organizations.create(organizationName.trim(), generateSlug(organizationName));
      await refreshUser();
      toast({ title: 'Organization created', description: 'Your organization has been set up successfully.' });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Failed to create organization',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

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
          <span className="ml-auto text-xs text-muted-foreground">CallCenterX — New Organization</span>
        </div>

        {/* Form card */}
        <div className="terminal-surface rounded-b overflow-hidden">
          <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 border border-primary/20">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
              </div>
              <h1 className="text-lg font-semibold text-foreground">Create your organization</h1>
              <p className="text-sm text-muted-foreground">
                This is your workspace within CallCenterX. You can use your company or team name.
              </p>
            </div>

            {/* Organization name */}
            <div className="space-y-1.5">
              <Label htmlFor="organizationName" className="text-sm">Organization Name</Label>
              <Input
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Acme Corp"
                required
                disabled={isLoading}
                className="h-9 bg-background border-border focus-visible:ring-primary"
              />
            </div>

            {/* Type — button grid */}
            <div className="space-y-1.5">
              <Label className="text-sm">Organization Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {organizationTypes.map((type) => {
                  const Icon = type.icon;
                  const active = organizationType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      disabled={isLoading}
                      onClick={() => setOrganizationType(type.value)}
                      className={`flex items-center gap-2.5 rounded border px-3 py-2.5 text-left transition-colors ${
                        active
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${active ? 'bg-primary/20' : 'bg-secondary'}`}>
                        <Icon className={`h-3.5 w-3.5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company size */}
            <div className="space-y-1.5">
              <Label className="text-sm">Company Size</Label>
              <Select value={companySize} onValueChange={setCompanySize} disabled={isLoading}>
                <SelectTrigger className="h-9 bg-background border-border focus:ring-primary">
                  <SelectValue placeholder="How many people?" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value} className="text-sm focus:bg-secondary">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading || !organizationName.trim() || !organizationType}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating organization...</>
              ) : (
                <>Create Organization<ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          {/* Footer note */}
          <div className="flex items-center justify-center border-t border-border px-6 py-3">
            <span className="text-xs text-muted-foreground">
              You can rename your organization later in Settings.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
