import { Layout } from "@/components/Layout";
import { LoadMoreView } from "@/pages/LoadMoreView";
import { PaginationView } from "@/pages/PaginationView";
import { PokemonDetailPage } from "@/pages/PokemonDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			refetchOnWindowFocus: false,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/" element={<PaginationView />} />
						<Route path="/load-more" element={<LoadMoreView />} />
						<Route path="/pokemon/:id" element={<PokemonDetailPage />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
