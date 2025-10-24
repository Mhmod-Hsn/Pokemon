import { Card, CardContent } from '@/components/ui/card';
import { formatPokemonId, formatPokemonName } from '@/services/pokemonApi';
import { Link } from 'react-router-dom';

interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
}

export function PokemonCard({ id, name, imageUrl }: PokemonCardProps) {
  return (
    <Link to={`/pokemon/${id}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-6">
          <div className="aspect-square relative mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {formatPokemonId(id)}
            </p>
            <h3 className="text-lg font-semibold capitalize">
              {formatPokemonName(name)}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

