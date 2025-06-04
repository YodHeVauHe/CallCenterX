import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface VoiceMetrics {
  callQuality: number;
  responseAccuracy: number;
  sentiment: number;
  clarity: number;
}

interface VoiceMetricsProps {
  metrics: VoiceMetrics;
}

export function VoiceMetrics({ metrics }: VoiceMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Call Quality
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.callQuality}%</div>
          <Progress 
            value={metrics.callQuality} 
            className="h-2 mt-2"
            indicatorClassName={
              metrics.callQuality > 80 
                ? "bg-green-500" 
                : metrics.callQuality > 60 
                ? "bg-yellow-500" 
                : "bg-red-500"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Response Accuracy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.responseAccuracy}%</div>
          <Progress 
            value={metrics.responseAccuracy} 
            className="h-2 mt-2"
            indicatorClassName={
              metrics.responseAccuracy > 90 
                ? "bg-green-500" 
                : metrics.responseAccuracy > 75 
                ? "bg-yellow-500" 
                : "bg-red-500"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Customer Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.sentiment}%</div>
          <Progress 
            value={metrics.sentiment} 
            className="h-2 mt-2"
            indicatorClassName={
              metrics.sentiment > 70 
                ? "bg-green-500" 
                : metrics.sentiment > 40 
                ? "bg-yellow-500" 
                : "bg-red-500"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Voice Clarity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.clarity}%</div>
          <Progress 
            value={metrics.clarity} 
            className="h-2 mt-2"
            indicatorClassName={
              metrics.clarity > 85 
                ? "bg-green-500" 
                : metrics.clarity > 70 
                ? "bg-yellow-500" 
                : "bg-red-500"
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}