import {
	fetchPokemonDetails,
	fetchPokemonDetailsForList,
	fetchPokemonList,
} from '@/services/pokemonApi';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

const POKEMON_PER_PAGE = 20;

/**
 * Hook to fetch a paginated list of Pokemon with their details
 */
export function usePokemonList(page: number = 1, limit: number = POKEMON_PER_PAGE) {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ['pokemon', 'list', page, limit],
    queryFn: async () => {
      const listResponse = await fetchPokemonList(limit, offset);
      const detailedPokemon = await fetchPokemonDetailsForList(listResponse.results);
      
      return {
        pokemon: detailedPokemon,
        total: listResponse.count,
        next: listResponse.next,
        previous: listResponse.previous,
      };
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch Pokemon with infinite scrolling
 */
export function usePokemonInfinite(limit: number = POKEMON_PER_PAGE) {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'infinite', limit],
    queryFn: async ({ pageParam = 0 }) => {
      const listResponse = await fetchPokemonList(limit, pageParam);
      const detailedPokemon = await fetchPokemonDetailsForList(listResponse.results);
      
      return {
        pokemon: detailedPokemon,
        nextOffset: listResponse.next ? pageParam + limit : undefined,
        total: listResponse.count,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single Pokemon's details
 */
export function usePokemonDetail(id: string | number) {
  return useQuery({
    queryKey: ['pokemon', 'detail', id],
    queryFn: () => fetchPokemonDetails(id),
    staleTime: 10 * 60 * 1000, // Details are less likely to change
    gcTime: 30 * 60 * 1000,
    enabled: !!id, // Only run query if id is provided
  });
}

// Re-export for convenience
export { useQueryClient } from '@tanstack/react-query';

