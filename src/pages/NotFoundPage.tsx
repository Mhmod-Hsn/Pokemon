import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* 404 Illustration */}
              <div className="relative">
                <div className="text-9xl font-bold text-muted-foreground/20">
                  404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl">❓</div>
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-3">
                <h1 className="text-3xl font-bold">Pokémon Not Found!</h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  This Pokémon seems to have fled! The page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    <Home className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
                <Link to="/load-more">
                  <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                    <Search className="w-4 h-4" />
                    Explore Pokémon
                  </Button>
                </Link>
              </div>

              {/* Helpful Suggestions */}
              <div className="pt-8 border-t w-full max-w-md">
                <p className="text-sm text-muted-foreground mb-3">
                  Looking for something specific?
                </p>
                <div className="flex flex-col gap-2 text-sm">
                  <Link 
                    to="/" 
                    className="text-primary hover:underline"
                  >
                    → View all Pokémon with pagination
                  </Link>
                  <Link 
                    to="/load-more" 
                    className="text-primary hover:underline"
                  >
                    → Browse Pokémon with infinite scroll
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

