import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/queryClient'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Pages />
      <Toaster />
      {/* Dev tools apenas em desenvolvimento */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
          toggleButtonProps={{ 
            style: { 
              zIndex: 99999,
              position: 'fixed',
              bottom: '20px',
              right: '20px',
            } 
          }}
        />
      )}
    </QueryClientProvider>
  )
}

export default App 