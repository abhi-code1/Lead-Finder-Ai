import React from 'react';
import { LayoutDashboard, Search, Users, Send, Settings, BarChart3 } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'finder', label: 'Lead Finder', icon: Search },
    { id: 'crm', label: 'Leads CRM', icon: Users },
    { id: 'outreach', label: 'Outreach', icon: Send },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b border-gray-100">
        <Logo />
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive 
                  ? 'bg-royal-50 text-royal-700 shadow-sm ring-1 ring-royal-100' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-royal-600' : 'text-gray-400'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
         <div className="bg-gradient-to-br from-royal-600 to-royal-900 rounded-xl p-4 text-white">
            <h4 className="font-bold text-sm mb-1">Pro Plan</h4>
            <p className="text-royal-100 text-xs mb-3">Unlimited AI Search & Auto-Outreach</p>
            <button className="w-full bg-neon-400 hover:bg-neon-500 text-royal-900 text-xs font-bold py-2 rounded-lg transition-colors">
                Upgrade Now
            </button>
         </div>
         <button className="mt-4 w-full flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-gray-900 text-sm font-medium">
             <Settings className="w-4 h-4" /> Settings
         </button>
      </div>
    </div>
  );
};

export default Sidebar;