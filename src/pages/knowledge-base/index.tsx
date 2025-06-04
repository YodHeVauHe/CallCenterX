import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, File, FileText, Filter, Plus, Search, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
        <p className="text-muted-foreground">
          Manage your call center knowledge base and resources.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search knowledge base..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Button>
          </div>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{article.title}</CardTitle>
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription className="line-clamp-2">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex justify-between p-4">
                    <div className="text-xs text-muted-foreground">
                      Updated {article.updatedAt}
                    </div>
                    <div className="text-xs">
                      By {article.author}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {files.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{file.name}</CardTitle>
                      <FileIcon type={file.type} />
                    </div>
                    <CardDescription className="text-xs">
                      {file.size} • {file.type.toUpperCase()}
                    </CardDescription>
                  </CardHeader>
                  <Separator />
                  <CardFooter className="flex justify-between p-4">
                    <div className="text-xs text-muted-foreground">
                      Uploaded {file.uploadedAt}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{category.name}</CardTitle>
                    <CardDescription>
                      {category.articleCount} articles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
              <Card className="flex h-full flex-col items-center justify-center border-dashed p-6">
                <Plus className="mb-2 h-6 w-6 text-muted-foreground" />
                <p className="text-sm font-medium">Add Category</p>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Analytics</CardTitle>
                <CardDescription>
                  View usage statistics and article performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed analytics view is under development.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const articles = [
  {
    id: "1",
    title: "How to Handle Customer Complaints",
    description: "A comprehensive guide on effectively handling customer complaints and turning negative experiences into positive outcomes.",
    tags: ["customer service", "complaints", "resolution"],
    updatedAt: "2 days ago",
    author: "Sarah Wilson",
  },
  {
    id: "2",
    title: "Refund Policy Guidelines",
    description: "Detailed explanation of the company's refund policies, including timeframes, eligible products, and processing procedures.",
    tags: ["refunds", "policy", "payments"],
    updatedAt: "1 week ago",
    author: "David Chen",
  },
  {
    id: "3",
    title: "Product Troubleshooting: Basic Steps",
    description: "Step-by-step guide for troubleshooting common product issues that customers may encounter.",
    tags: ["troubleshooting", "products", "technical"],
    updatedAt: "3 days ago",
    author: "Jessica Taylor",
  },
  {
    id: "4",
    title: "Using the CRM System Effectively",
    description: "Best practices for agents to maximize the benefits of the CRM system during customer interactions.",
    tags: ["CRM", "tools", "internal"],
    updatedAt: "5 days ago",
    author: "Michael Lee",
  },
  {
    id: "5",
    title: "Escalation Protocol",
    description: "When and how to escalate customer issues to supervisors or specialized departments.",
    tags: ["escalation", "protocol", "workflow"],
    updatedAt: "2 weeks ago",
    author: "Emma Brown",
  },
  {
    id: "6",
    title: "Call Center Etiquette Guide",
    description: "Professional etiquette guidelines for call center agents, including tone, language, and customer engagement best practices.",
    tags: ["etiquette", "professionalism", "communication"],
    updatedAt: "1 month ago",
    author: "Robert Miller",
  },
];

const files = [
  {
    id: "1",
    name: "Product_Catalog_2023.pdf",
    type: "pdf",
    size: "4.2 MB",
    uploadedAt: "3 days ago",
  },
  {
    id: "2",
    name: "Call_Scripts_Template.docx",
    type: "docx",
    size: "245 KB",
    uploadedAt: "1 week ago",
  },
  {
    id: "3",
    name: "Onboarding_Training.pptx",
    type: "pptx",
    size: "8.7 MB",
    uploadedAt: "2 weeks ago",
  },
  {
    id: "4",
    name: "Customer_Feedback_Analysis.xlsx",
    type: "xlsx",
    size: "1.8 MB",
    uploadedAt: "4 days ago",
  },
  {
    id: "5",
    name: "Technical_Support_Flowchart.png",
    type: "png",
    size: "680 KB",
    uploadedAt: "6 days ago",
  },
  {
    id: "6",
    name: "Compliance_Guidelines_2023.pdf",
    type: "pdf",
    size: "3.5 MB",
    uploadedAt: "1 month ago",
  },
];

const categories = [
  {
    id: "1",
    name: "Customer Support",
    description: "General customer support guidance and protocols",
    articleCount: 24,
  },
  {
    id: "2",
    name: "Technical Support",
    description: "Product troubleshooting and technical assistance",
    articleCount: 18,
  },
  {
    id: "3",
    name: "Policies & Procedures",
    description: "Company policies and standard procedures",
    articleCount: 12,
  },
  {
    id: "4",
    name: "Training Materials",
    description: "Agent training and development resources",
    articleCount: 9,
  },
  {
    id: "5",
    name: "Product Information",
    description: "Detailed product specifications and features",
    articleCount: 32,
  },
  {
    id: "6",
    name: "Call Scripts",
    description: "Templates and examples for different call scenarios",
    articleCount: 15,
  },
  {
    id: "7",
    name: "Compliance",
    description: "Regulatory and compliance information",
    articleCount: 8,
  },
];

function FileIcon({ type }: { type: string }) {
  switch (type.toLowerCase()) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />;
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'xlsx':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'pptx':
      return <FileText className="h-5 w-5 text-orange-500" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
}