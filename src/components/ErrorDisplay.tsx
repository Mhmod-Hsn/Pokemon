import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
		<div className="flex items-center justify-center min-h-[400px] p-4">
			<Card className="w-full max-w-md">
				<CardContent className="pt-6">
					<div className="flex flex-col items-center text-center space-y-4">
						<div className="rounded-full bg-destructive/10 p-3">
							<AlertCircle className="w-8 h-8 text-destructive" />
						</div>
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">
								Oops! Something went wrong
							</h3>
							<p className="text-sm text-muted-foreground">{message}</p>
						</div>
						<div className="flex flex-col gap-2 mt-4">
							{onRetry && (
								<Button onClick={onRetry} className="gap-2">
									<RefreshCw className="w-4 h-4" />
									Try Again
								</Button>
							)}
							<Button asChild variant="outline" className="gap-2">
								<a href="/" >
									<Home className="w-4 h-4" />
									Back to Home
								</a>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

