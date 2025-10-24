// Pokemon API Response Types
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

export interface PokemonBasic {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  height: number;
  weight: number;
  types: PokemonType[];
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

// UI State Types
export interface PokemonCardData {
  id: number;
  name: string;
  imageUrl: string;
}

