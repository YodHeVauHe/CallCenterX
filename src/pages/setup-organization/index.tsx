import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { Building2, Users, GraduationCap, Rocket, Briefcase, Building, ExternalLink } from 'lucide-react';

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

const plans = [
  { value: 'free', label: 'Free - $0/month', description: 'Perfect for getting started' },
  { value: 'pro', label: 'Pro - $25/month', description: 'For growing teams' },
  { value: 'enterprise', label: 'Enterprise - Custom', description: 'For large organizations' },
];

export function SetupOrganization() {
  const [isLoading, setIsLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('free');
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

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

    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create an organization.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      const slug = generateSlug(organizationName);

      // Create organization
      const { data: organization, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName.trim(),
          slug,
        })
        .select()
        .single();

      if (orgError) {
        throw orgError;
      }

      // Add user to organization
      const { error: memberError } = await supabase
        .from('user_organizations')
        .insert({
          user_id: user.id,
          organization_id: organization.id,
        });

      if (memberError) {
        throw memberError;
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">
              Create a new organization
            </h1>
            <div className="text-gray-400 space-y-1">
              <p>This is your organization within CallCenterX.</p>
              <p>For example, you can use the name of your company or department.</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="organizationName" className="text-white font-medium">
                Name
              </Label>
              <Input
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="What's the name of your company or team?"
                required
                disabled={isLoading}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">
                Type
              </Label>
              <Select value={organizationType} onValueChange={setOrganizationType} disabled={isLoading}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="What would best describe your organization?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {organizationTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <SelectItem 
                        key={type.value} 
                        value={type.value}
                        className="text-white hover:bg-gray-600 focus:bg-gray-600"
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-400">What would best describe your organization?</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-medium">
                Company size
              </Label>
              <Select value={companySize} onValueChange={setCompanySize} disabled={isLoading}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder="How many people are in your company?" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {companySizes.map((size) => (
                    <SelectItem 
                      key={size.value} 
                      value={size.value}
                      className="text-white hover:bg-gray-600 focus:bg-gray-600"
                    >
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-400">How many people are in your company?</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label className="text-white font-medium">
                  Plan
                </Label>
                <Label className="text-white font-medium">
                  Pricing
                </Label>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
              <Select value={selectedPlan} onValueChange={setSelectedPlan} disabled={isLoading}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-green-500 focus:ring-green-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {plans.map((plan) => (
                    <SelectItem 
                      key={plan.value} 
                      value={plan.value}
                      className="text-white hover:bg-gray-600 focus:bg-gray-600"
                    >
                      {plan.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-400">The Plan applies to your new organization.</p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-gray-400">
                You can rename your organization later
              </div>
              <div className="flex space-x-3">
                <Button 
                  type="button"
                  variant="outline"
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => navigate('/login')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !organizationName.trim() || !organizationType}
                  className="bg-green-600 hover:bg-green-700 text-white border-0"
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}