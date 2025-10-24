import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingCard } from '@/components/LoadingCard';
import { PokemonCard } from '@/components/PokemonCard';
import { Button } from '@/components/ui/button';
import { usePokemonInfinite } from '@/hooks/usePokemon';
import { Loader2 } from 'lucide-react';

const POKEMON_PER_LOAD = 20;

export function LoadMoreView() {
  // Use React Query infinite hook
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePokemonInfinite(POKEMON_PER_LOAD);

  // Flatten all pages into a single array
  const allPokemon = data?.pages.flatMap((page) => page.pokemon) || [];
  const totalCount = data?.pages[0]?.total || 0;

  // Error state for initial load
  if (isError && allPokemon.length === 0) {
    return (
      <ErrorDisplay
        message={error?.message || 'Failed to load Pokémon data'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pokédex</h1>
        <p className="text-muted-foreground">
          Discover and explore Pokemon with infinite scroll
        </p>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {/* Show loaded Pokemon */}
        {allPokemon.map((p) => (
          <PokemonCard
            key={p.id}
            id={p.id}
            name={p.name}
            imageUrl={p.sprites.other['official-artwork'].front_default}
          />
        ))}

        {/* Show loading skeletons on initial load */}
        {isLoading &&
          Array.from({ length: POKEMON_PER_LOAD }).map((_, index) => (
            <LoadingCard key={`loading-${index}`} />
          ))}
      </div>

      {/* Load More Button */}
      {!isLoading && (
        <div className="flex flex-col items-center gap-4">
          {/* Show error for "load more" failures */}
          {isError && allPokemon.length > 0 && (
            <div className="text-sm text-destructive mb-2">
              <p>{error?.message || 'Failed to load more Pokémon'}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {hasNextPage ? (
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              size="lg"
              className="min-w-[200px]"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm">
              You've reached the end! All {totalCount} Pokémon loaded.
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Showing {allPokemon.length} of {totalCount} Pokemon
          </p>
        </div>
      )}
    </div>
  );
}
