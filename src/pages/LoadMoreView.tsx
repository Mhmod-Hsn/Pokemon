import { ErrorDisplay } from "@/components/ErrorDisplay";
import { LoadingCard } from "@/components/LoadingCard";
import { PokemonCard } from "@/components/PokemonCard";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { usePokemonInfinite, usePokemonSearch } from "@/services/pokemonApi";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const POKEMON_PER_LOAD = 20;

export function LoadMoreView() {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchQuery = searchParams.get("q") || "";

	// Use search hook when searching, otherwise use infinite hook
	const searchResult = usePokemonSearch(searchQuery);
	const infiniteResult = usePokemonInfinite(POKEMON_PER_LOAD);

	// Choose which result to use
	const isSearching = !!searchQuery;
	const {
		data: searchData,
		isLoading: searchLoading,
		isError: searchError,
		error: searchErrorMsg,
	} = searchResult;

	const {
		data: infiniteData,
		isLoading: infiniteLoading,
		isError: infiniteError,
		error: infiniteErrorMsg,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = infiniteResult;

	// Flatten all pages into a single array
	const allPokemon = useMemo(() => {
		if (isSearching) {
			return searchData ? [searchData] : [];
		}
		return infiniteData?.pages.flatMap((page) => page.pokemon) || [];
	}, [isSearching, searchData, infiniteData?.pages]);

	const totalCount = infiniteData?.pages[0]?.total || 0;
	const isLoading = isSearching ? searchLoading : infiniteLoading;
	const isError = isSearching ? searchError : infiniteError;
	const error = isSearching ? searchErrorMsg : infiniteErrorMsg;

	const handleSearch = (query: string) => {
		if (query) {
			searchParams.set("q", query);
		} else {
			searchParams.delete("q");
		}
		setSearchParams(searchParams);
	};

	const handleClearSearch = () => {
		searchParams.delete("q");
		setSearchParams(searchParams);
	};

	// Error state for initial load
	if (isError && allPokemon.length === 0) {
		const errorMessage = isSearching
			? 'Pokémon not found. Try searching by exact name (e.g., "pikachu") or ID (e.g., "25")'
			: error?.message || "Failed to load Pokémon data";

		return (
			<div className="container mx-auto px-4 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">Pokédex</h1>
					<p className="text-muted-foreground">
						Discover and explore Pokemon with infinite scroll
					</p>
				</div>

				<SearchInput
					value={searchQuery}
					onChange={handleSearch}
					onClear={handleClearSearch}
					placeholder="Search by exact name or ID..."
				/>

				<ErrorDisplay
					message={errorMessage}
					onRetry={isSearching ? undefined : () => refetch()}
				/>
			</div>
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

			{/* Search Input */}
			<SearchInput
				value={searchQuery}
				onChange={handleSearch}
				onClear={handleClearSearch}
				placeholder="Search by exact name or ID..."
			/>

			{/* Results Info */}
			{searchQuery && !isLoading && allPokemon.length > 0 && (
				<div className="mb-6 text-center">
					<p className="text-sm text-muted-foreground">
						Found <span className="font-semibold text-foreground">1</span>{" "}
						Pokémon
					</p>
				</div>
			)}

			{/* Pokemon Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
				{/* Show loaded Pokemon */}
				{allPokemon.map((p) => (
					<PokemonCard
						key={p.id}
						id={p.id}
						name={p.name}
						imageUrl={p.sprites.other["official-artwork"].front_default}
					/>
				))}

				{/* Show loading skeletons on initial load */}
				{isLoading &&
					Array.from({ length: isSearching ? 1 : POKEMON_PER_LOAD }).map(
						(_, index) => <LoadingCard key={`loading-${index}`} />
					)}
			</div>

			{/* Load More Button - Only show if not searching */}
			{!isLoading && !searchQuery && (
				<div className="flex flex-col items-center gap-4">
					{/* Show error for "load more" failures */}
					{isError && allPokemon.length > 0 && (
						<div className="text-sm text-destructive mb-2">
							<p>{error?.message || "Failed to load more Pokémon"}</p>
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
								"Load More"
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
