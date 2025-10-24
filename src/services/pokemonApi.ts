import type { Pokemon, PokemonBasic, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

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

