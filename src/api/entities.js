import { supabaseClient } from './supabaseClient';

// Exportar entidades que agora usam Supabase
export const Channel = supabaseClient.entities.Channel;
export const AIAgent = supabaseClient.entities.AIAgent;
export const Journey = supabaseClient.entities.Journey;
export const Dashboard = supabaseClient.entities.Dashboard;

// Manter compatibilidade com o código existente
export const base44 = supabaseClient;

// auth sdk:
export const User = supabaseClient.auth;