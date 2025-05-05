import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stream } from "./modules/stream/stream";
function App() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Stream />
		</QueryClientProvider>
	);
}

export default App;
