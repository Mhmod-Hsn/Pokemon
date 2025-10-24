import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="aspect-square relative mb-4 bg-gray-50 rounded-lg">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-12 mx-auto" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

