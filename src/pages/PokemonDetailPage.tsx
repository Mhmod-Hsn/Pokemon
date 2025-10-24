import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePokemonDetail } from '@/hooks/usePokemon';
import {
	formatPokemonId,
	formatPokemonName,
} from '@/services/pokemonApi';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-600',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-700',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-400',
};

export function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use React Query hook
  const { data: pokemon, isLoading, isError, error, refetch } = usePokemonDetail(id || '');

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <ErrorDisplay
          message={error?.message || 'Failed to load Pokémon details'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {isLoading ? (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="shrink-0 mx-auto md:mx-0">
                <Skeleton className="w-64 h-64 rounded-lg" />
              </div>
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-10 w-48" />
                </div>
                <Skeleton className="h-6 w-32" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : pokemon ? (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Pokemon Image */}
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-64 h-64 bg-gray-50 rounded-lg flex items-center justify-center p-4">
                  <img
                    src={pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Pokemon Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-lg font-medium text-muted-foreground mb-1">
                    {formatPokemonId(pokemon.id)}
                  </p>
                  <h1 className="text-4xl font-bold capitalize">
                    {formatPokemonName(pokemon.name)}
                  </h1>
                </div>

                {/* Types */}
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Type
                  </h2>
                  <div className="flex gap-2">
                    {pokemon.types.map((typeInfo) => (
                      <Badge
                        key={typeInfo.type.name}
                        className={`${
                          TYPE_COLORS[typeInfo.type.name] || 'bg-gray-400'
                        } text-white hover:opacity-90 capitalize`}
                      >
                        {typeInfo.type.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Height</p>
                    <p className="text-2xl font-bold">
                      {(pokemon.height / 10).toFixed(1)} m
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Weight</p>
                    <p className="text-2xl font-bold">
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
