import type { Pokemon, PokemonBasic, PokemonListResponse } from '@/types/pokemon';
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const BASE_URL = "https://pokeapi.co/api/v2";
const POKEMON_PER_PAGE = 20;

/**
 * Fetch a paginated list of Pokemon
 * @param limit Number of Pokemon to fetch
 * @param offset Starting position
 */
export async function fetchPokemonList(
	limit: number = 20,
	offset: number = 0
): Promise<PokemonListResponse> {
	const response = await fetch(
		`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Fetch detailed information for a specific Pokemon
 * @param id Pokemon ID or name
 */
export async function fetchPokemonDetails(
	id: string | number
): Promise<Pokemon> {
	const response = await fetch(`${BASE_URL}/pokemon/${id}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch Pokemon details: ${response.statusText}`);
	}

	return response.json();
}

/**
 * Search for a Pokemon by name or ID using the API
 * @param query Pokemon name or ID
 */
export async function searchPokemon(query: string): Promise<Pokemon> {
	// Clean and lowercase the query for the API
	const cleanQuery = query.trim().toLowerCase();
	return fetchPokemonDetails(cleanQuery);
}

/**
 * Hook to search for a Pokemon by name or ID
 */
export function usePokemonSearch(query: string) {
	return useQuery({
		queryKey: ["pokemon", "search", query],
		queryFn: () => searchPokemon(query),
		enabled: !!query && query.trim().length > 0,
		staleTime: 10 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
		retry: false, // Don't retry on 404
	});
}

/**
 * Hook to fetch a single Pokemon's details
 */
export function usePokemonDetail(id: string | number) {
	return useQuery({
		queryKey: ["pokemon", "detail", id],
		queryFn: async () => await fetchPokemonDetails(id),
		staleTime: 10 * 60 * 1000, // Details are less likely to change
		gcTime: 30 * 60 * 1000,
		enabled: !!id, // Only run query if id is provided
	});
}

/**
 * Extract Pokemon ID from the API URL
 * @param url Pokemon URL from the list endpoint
 */
export function extractPokemonId(url: string): number {
	const matches = url.match(/\/pokemon\/(\d+)\//);
	return matches ? parseInt(matches[1], 10) : 0;
}

/**
 * Fetch detailed Pokemon data for a list of basic Pokemon
 * @param pokemonList List of basic Pokemon from the list endpoint
 */
export async function fetchPokemonDetailsForList(
	pokemonList: PokemonBasic[]
): Promise<Pokemon[]> {
	const promises = pokemonList.map((pokemon) => {
		const id = extractPokemonId(pokemon.url);
		return fetchPokemonDetails(id);
	});

	return Promise.all(promises);
}

/**
 * Hook to fetch a paginated list of Pokemon with their details
 */
export function usePokemonList(
	page: number = 1,
	limit: number = POKEMON_PER_PAGE
) {
	const offset = (page - 1) * limit;

	return useQuery({
		queryKey: ["pokemon", "list", page, limit],
		queryFn: async () => {
			const listResponse = await fetchPokemonList(limit, offset);
			const detailedPokemon = await fetchPokemonDetailsForList(
				listResponse.results
			);

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
		queryKey: ["pokemon", "infinite", limit],
		queryFn: async ({ pageParam = 0 }) => {
			const listResponse = await fetchPokemonList(limit, pageParam);
			const detailedPokemon = await fetchPokemonDetailsForList(
				listResponse.results
			);

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
 * Format Pokemon name for display (capitalize first letter)
 */
export function formatPokemonName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Format Pokemon ID for display with leading zeros
 */
export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, '0')}`;
}
