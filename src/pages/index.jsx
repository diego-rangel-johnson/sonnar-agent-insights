import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Channels from "./Channels";
import AIAgents from "./AIAgents";
import Stats from "./Stats";
import Support from "./Support";
import AgentInsights from "./AgentInsights";
import LandingPage from "./LandingPage";

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Suspense } from "react";
import { AuthProvider, useAuth } from '@/hooks/useAuth.jsx';
import PageSkeleton from '@/components/ui/LoadingStates';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <PageSkeleton />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componente de rota pública (redireciona se já autenticado)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <PageSkeleton />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const PAGES = {
    Dashboard: Dashboard,
    Channels: Channels,
    AIAgents: AIAgents,
    AgentInsights: AgentInsights,
    Stats: Stats,
    Support: Support,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Componente principal de conteúdo das páginas
function PagesContent() {
    const { signOut } = useAuth();
    
    return (
        <Suspense fallback={<PageSkeleton />}>
            <Routes>
                {/* Rota pública - Landing Page */}
                <Route 
                    path="/" 
                    element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    } 
                />
                
                {/* Rotas protegidas */}
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Dashboard" onLogout={signOut}>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/channels" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Channels" onLogout={signOut}>
                            <Channels />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/aiagents" element={
                    <ProtectedRoute>
                        <Layout currentPageName="AIAgents" onLogout={signOut}>
                            <AIAgents />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/agentinsights" element={
                    <ProtectedRoute>
                        <Layout currentPageName="AgentInsights" onLogout={signOut}>
                            <AgentInsights />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/stats" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Stats" onLogout={signOut}>
                            <Stats />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                <Route path="/support" element={
                    <ProtectedRoute>
                        <Layout currentPageName="Support" onLogout={signOut}>
                            <Support />
                        </Layout>
                    </ProtectedRoute>
                } />
                
                {/* Rota de captura para URLs não encontradas */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default function Pages() {
    return (
        <Router>
            <AuthProvider>
                <PagesContent />
            </AuthProvider>
        </Router>
    );
}