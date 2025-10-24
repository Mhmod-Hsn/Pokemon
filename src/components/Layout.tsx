import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/pokemon/');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-red-500">Poké</span>
                <span className="text-gray-800">dex</span>
              </div>
            </Link>

            {/* Navigation - Only show on list pages */}
            {!isDetailPage && (
              <nav className="flex gap-2">
                <Link to="/">
                  <Button
                    variant={location.pathname === '/' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    Page Controls
                  </Button>
                </Link>
                <Link to="/load-more">
                  <Button
                    variant={
                      location.pathname === '/load-more' ? 'default' : 'ghost'
                    }
                    size="sm"
                  >
                    Infinite Scroll
                  </Button>
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built with React, TypeScript, and shadcn/ui |{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Data from PokéAPI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

