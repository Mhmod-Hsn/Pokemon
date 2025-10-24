import { ErrorDisplay } from '@/components/ErrorDisplay';
import { LoadingCard } from '@/components/LoadingCard';
import { PokemonCard } from '@/components/PokemonCard';
import { Button } from '@/components/ui/button';
import { usePokemonList } from '@/hooks/usePokemon';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const POKEMON_PER_PAGE = 20;

export function PaginationView() {
  const [currentPage, setCurrentPage] = useState(1);

  // Use React Query hook
  const { data, isLoading, isError, error, refetch } = usePokemonList(
    currentPage,
    POKEMON_PER_PAGE
  );

  const totalPages = data ? Math.ceil(data.total / POKEMON_PER_PAGE) : 0;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    const halfShow = Math.floor(showPages / 2);

    let startPage = Math.max(1, currentPage - halfShow);
    let endPage = Math.min(totalPages, currentPage + halfShow);

    if (currentPage <= halfShow) {
      endPage = Math.min(showPages, totalPages);
    }
    if (currentPage >= totalPages - halfShow) {
      startPage = Math.max(1, totalPages - showPages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  // Error state
  if (isError) {
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
          Discover and explore Pokemon with page controls
        </p>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: POKEMON_PER_PAGE }).map((_, index) => (
              <LoadingCard key={index} />
            ))
          : data?.pokemon.map((p) => (
              <PokemonCard
                key={p.id}
                id={p.id}
                name={p.name}
                imageUrl={p.sprites.other['official-artwork'].front_default}
              />
            ))}
      </div>

      {/* Pagination Controls */}
      {!isLoading && data && data.pokemon.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-muted-foreground">
                  {page}
                </span>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({POKEMON_PER_PAGE} Pokemon shown)
          </p>
        </div>
      )}
    </div>
  );
}
