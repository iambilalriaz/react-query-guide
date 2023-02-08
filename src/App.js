import { QueryClient, QueryClientProvider } from 'react-query';
import Users from './Users';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
};

export default App;
