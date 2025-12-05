import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import LeadFinder from './views/LeadFinder';
import VoiceAssistant from './components/VoiceAssistant';
import { Lead, LeadStatus, LeadTemperature } from './types';
import { Users, Mail } from 'lucide-react';
import LeadCard from './components/LeadCard';

// Placeholder Mock Data
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    businessName: 'Apex Innovations',
    industry: 'Software',
    location: 'San Francisco, CA',
    status: LeadStatus.ENGAGED,
    temperature: LeadTemperature.HOT,
    score: 85,
    notes: 'Interested in enterprise automation tools. Contact: Sarah (CTO).',
    email: 'sarah@apex.io',
    source: 'Manual'
  },
  {
    id: '2',
    businessName: 'GreenLeaf Realty',
    industry: 'Real Estate',
    location: 'Austin, TX',
    status: LeadStatus.PROSPECT,
    temperature: LeadTemperature.WARM,
    score: 65,
    notes: 'Looking for better lead management. Growing fast.',
    website: 'https://greenleaf.example.com',
    source: 'AI Search'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
    alert("Lead added to CRM!");
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard leads={leads} />;
      case 'finder':
        return <LeadFinder onAddLead={addLead} />;
      case 'crm':
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
                        <p className="text-gray-500">Manage your relationships and pipeline.</p>
                    </div>
                    <button className="bg-royal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-royal-700">
                        Export CSV
                    </button>
                </div>
                <div className="space-y-4">
                    {leads.map(lead => <LeadCard key={lead.id} lead={lead} />)}
                </div>
            </div>
        );
      case 'outreach':
        return (
             <div className="p-8 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Automated Outreach</h1>
                    <p className="text-gray-500">Configure campaigns and templates.</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center py-20">
                    <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Campaigns are active</h3>
                    <p className="text-gray-500 mb-6">AI is sending emails to 'Hot' leads automatically.</p>
                    <button className="bg-royal-50 text-royal-700 px-6 py-2 rounded-lg font-bold border border-royal-200 hover:bg-royal-100">
                        View Logs
                    </button>
                </div>
            </div>
        );
      case 'analytics':
        return (
             <div className="p-8 max-w-7xl mx-auto">
                 <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 h-64 flex items-center justify-center text-gray-400">
                        Revenue Forecast Chart Placeholder
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 h-64 flex items-center justify-center text-gray-400">
                        Team Performance Chart Placeholder
                    </div>
                 </div>
             </div>
        );
      default:
        return <Dashboard leads={leads} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 relative">
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-10 px-8 flex items-center justify-end">
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">Demo User</p>
                    <p className="text-xs text-gray-500">Pro Plan</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-royal-100 flex items-center justify-center text-royal-600 font-bold border-2 border-white shadow-sm">
                    DU
                </div>
            </div>
        </header>
        
        {renderView()}

        {/* Floating Voice Assistant */}
        <VoiceAssistant onClose={() => {}} />
      </main>
    </div>
  );
};

export default App;