import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Building2, Users, GraduationCap, Rocket, Briefcase, Building } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const organizationTypes = [
  {
    value: 'personal',
    label: 'Personal',
    description: 'For individual use and personal projects',
    icon: Users,
  },
  {
    value: 'educational',
    label: 'Educational',
    description: 'For schools, universities, and educational institutions',
    icon: GraduationCap,
  },
  {
    value: 'startup',
    label: 'StartUp',
    description: 'For early-stage companies and entrepreneurs',
    icon: Rocket,
  },
  {
    value: 'agency',
    label: 'Agency',
    description: 'For marketing agencies and service providers',
    icon: Briefcase,
  },
  {
    value: 'company',
    label: 'Company',
    description: 'For established businesses and enterprises',
    icon: Building,
  },
];

const companySizes = [
  { value: '1', label: 'Just me' },
  { value: '2-10', label: '2-10 people' },
  { value: '11-50', label: '11-50 people' },
  { value: '51-200', label: '51-200 people' },
  { value: '201-500', label: '201-500 people' },
  { value: '500+', label: '500+ people' },
];

export function SetupOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!organizationName.trim()) {
      toast({
        title: 'Error',
        description: 'Organization name is required.',
        variant: 'destructive',
      });
      return;
    }

    if (!organizationType) {
      toast({
        title: 'Error',
        description: 'Please select an organization type.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Generate a unique slug
      const baseSlug = generateSlug(organizationName);
      let slug = baseSlug;
      let counter = 1;

      // Check if slug exists and make it unique
      while (true) {
        const { data: existing } = await supabase
          .from('organizations')
          .select('id')
          .eq('slug', slug)
          .single();

        if (!existing) break;
        
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create organization
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName.trim(),
          slug: slug,
        })
        .select()
        .single();

      if (orgError) {
        throw orgError;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not found');
      }

      // Add user to organization via user_organizations table
      const { error: userOrgError } = await supabase
        .from('user_organizations')
        .insert({
          user_id: user.id,
          organization_id: organization.id,
        });

      if (userOrgError) {
        throw userOrgError;
      }

      // Refresh user data to include new organization
      await refreshUser();

      toast({
        title: 'Success!',
        description: 'Your organization has been created successfully.',
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Organization setup error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create organization. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Create a new organization
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-400 mt-3">
              This is your organization within CallCenterX.
              <br />
              For example, you can use the name of your company or department.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-12 pb-12">
            <form onSubmit={onSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="organizationName" className="text-base font-medium text-slate-700 dark:text-slate-300">
                  Name
                </Label>
                <Input
                  id="organizationName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="What's the name of your company or team?"
                  required
                  disabled={isLoading}
                  className="h-14 text-lg border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
                  Type
                </Label>
                <Select value={organizationType} onValueChange={setOrganizationType} disabled={isLoading}>
                  <SelectTrigger className="h-14 text-lg border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800">
                    <SelectValue placeholder="What would best describe your organization?" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    {organizationTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <SelectItem 
                          key={type.value} 
                          value={type.value}
                          className="py-4 px-4 hover:bg-slate-50 dark:hover:bg-slate-700 focus:bg-slate-50 dark:focus:bg-slate-700"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 dark:text-white">{type.label}</span>
                              <span className="text-sm text-slate-500 dark:text-slate-400">{type.description}</span>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium text-slate-700 dark:text-slate-300">
                  Company size
                </Label>
                <Select value={companySize} onValueChange={setCompanySize} disabled={isLoading}>
                  <SelectTrigger className="h-14 text-lg border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-800">
                    <SelectValue placeholder="How many people are in your company?" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    {companySizes.map((size) => (
                      <SelectItem 
                        key={size.value} 
                        value={size.value}
                        className="py-3 hover:bg-slate-50 dark:hover:bg-slate-700 focus:bg-slate-50 dark:focus:bg-slate-700"
                      >
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  You can rename your organization later
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !organizationName.trim() || !organizationType}
                  className="h-12 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Creating organization...
                    </>
                  ) : (
                    "Create organization"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}