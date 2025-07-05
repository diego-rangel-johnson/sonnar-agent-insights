import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Settings,
  HelpCircle,
  Search,
  Bell,
  UserCircle,
  Menu,
  FileText,
  BarChart2,
  Users,
  LogOut,
  ChevronDown,
  PieChart,
  Headphones,
  Lightbulb,
  Briefcase
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    {
      name: 'Principal',
      items: [
        {
          name: 'Dashboard',
          icon: LayoutDashboard,
          path: 'Dashboard'
        },
        {
          name: 'Agents Marketplace',
          icon: Bot,
          path: 'AIAgents'
        },
        {
          name: 'Agent Insights',
          icon: Lightbulb,
          path: 'AgentInsights'
        },
        {
          name: 'Agent Analytics',
          icon: BarChart2,
          path: 'Stats'
        }
      ]
    },
    {
      name: 'Comunicações',
      items: [
        {
          name: 'Canais',
          icon: MessageSquare,
          path: 'Channels'
        },
        {
          name: 'Atendimento',
          icon: Headphones,
          path: 'Support'
        }
      ]
    },
    {
      name: 'Configurações',
      items: [
        {
          name: 'Integrações',
          icon: PieChart,
          path: 'Integrations'
        },
        {
          name: 'Configurações',
          icon: Settings,
          path: 'Settings'
        },
        {
          name: 'Ajuda',
          icon: HelpCircle,
          path: 'Help'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Backdrop for mobile view */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-gradient-to-b from-indigo-700 to-purple-800 text-white",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-5 border-b border-purple-600">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
            </div>
          </div>

          <div className="flex-1 px-3 py-4 overflow-y-auto">
            {navigation.map((section) => (
              <div key={section.name} className="mb-6">
                <h2 className="px-4 mb-2 text-xs font-semibold text-purple-300 uppercase">
                  {section.name}
                </h2>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPageName === item.path;
                    
                    return (
                      <li key={item.name}>
                        <Link
                          to={createPageUrl(item.path)}
                          className={cn(
                            "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-purple-100 hover:bg-white/5"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-purple-600">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2 ring-2 ring-white/20">
                <UserCircle className="w-8 h-8 text-purple-200" />
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Renault</p>
                <p className="text-xs text-purple-300">Admin</p>
              </div>
              <Button variant="ghost" size="icon" className="text-purple-200 hover:text-white hover:bg-purple-800">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <div className="flex items-center flex-1 gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="relative flex items-center max-w-md w-full">
              <Search className="w-4 h-4 text-gray-400 absolute ml-3" />
              <Input 
                placeholder="Pesquisar..." 
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="w-5 h-5" />
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-purple-600"
              >
                3
              </Badge>
            </Button>

            <div className="hidden md:flex items-center">
              <Button variant="ghost" className="flex items-center text-sm font-medium gap-2">
                <span>Cliente: Renault</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}

