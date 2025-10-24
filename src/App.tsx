import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Layout } from "@/components/Layout";
import { LoadMoreView } from "@/pages/LoadMoreView";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PaginationView } from "@/pages/PaginationView";
import { PokemonDetailPage } from "@/pages/PokemonDetailPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TestErrorPage } from "./pages/TestErrorPage";

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
		<BrowserRouter>
			<ErrorBoundary>
				<QueryClientProvider client={queryClient}>
					<Layout>
						<Routes>
							<Route path="/" element={<PaginationView />} />
							<Route path="/load-more" element={<LoadMoreView />} />
							<Route path="/pokemon/:id" element={<PokemonDetailPage />} />
							<Route path="/test-error" element={<TestErrorPage />} />
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</Layout>
				</QueryClientProvider>
			</ErrorBoundary>
		</BrowserRouter>
	);
}

export default App;
