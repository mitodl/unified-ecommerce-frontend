import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mitodl/smoot-design";
import { render } from "@testing-library/react";

const TestProviders: React.FC<{
  children: React.ReactNode;
  queryClient: QueryClient;
}> = ({ children, queryClient }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>{children}</ThemeProvider>
  </QueryClientProvider>
);

/**
 * Render a component with providers for testing.
 */
const renderWithProviders = (component: React.ReactNode) => {
  const queryClient = new QueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <TestProviders queryClient={queryClient}>{children}</TestProviders>;
  };
  const view = render(component, {
    wrapper: Wrapper,
  });

  return { view, queryClient };
};

export { renderWithProviders };
