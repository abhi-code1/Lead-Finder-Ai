import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, Loader2, Plus, Sparkles } from 'lucide-react';
import { Lead, SearchParams } from '../types';
import { searchLeads } from '../services/gemini';
import LeadCard from '../components/LeadCard';

interface LeadFinderProps {
  onAddLead: (lead: Lead) => void;
}

const LeadFinder: React.FC<LeadFinderProps> = ({ onAddLead }) => {
  const [params, setParams] = useState<SearchParams>({
    industry: '',
    location: '',
    keywords: ''
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.industry || !params.location) return;

    setLoading(true);
    setSearched(true);
    setResults([]);

    const foundLeads = await searchLeads(params.industry, params.location);
    setResults(foundLeads);
    setLoading(false);
  };

  const industries = [
    "Real Estate", "Software Development", "Healthcare", "Marketing Agencies", "Manufacturing", "Restaurants"
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Finder</h1>
        <p className="text-gray-500">Use AI to scour the web for high-potential leads in any industry.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Briefcase className="w-4 h-4" /> Industry / Niche
            </label>
            <input 
              type="text" 
              placeholder="e.g. Dental Clinics, SaaS Startups"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 focus:border-royal-500 outline-none transition-all"
              value={params.industry}
              onChange={(e) => setParams({...params, industry: e.target.value})}
              required
            />
          </div>
          
          <div className="md:col-span-4 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Location
            </label>
            <input 
              type="text" 
              placeholder="e.g. Austin, TX"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-royal-500 focus:border-royal-500 outline-none transition-all"
              value={params.location}
              onChange={(e) => setParams({...params, location: e.target.value})}
              required
            />
          </div>

          <div className="md:col-span-4">
             <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-royal-600 hover:bg-royal-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
             >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 text-neon-400" />}
                Find Leads
             </button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
            {industries.map(ind => (
                <button 
                    key={ind} 
                    type="button"
                    onClick={() => setParams({...params, industry: ind})}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors"
                >
                    {ind}
                </button>
            ))}
        </div>
      </div>

      {loading && (
          <div className="text-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-royal-200 border-t-royal-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900">AI is scanning the web...</h3>
              <p className="text-gray-500">Searching directories, maps, and social profiles.</p>
          </div>
      )}

      {!loading && searched && results.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
              <p className="text-gray-500">Try broadening your search criteria.</p>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((lead) => (
            <div key={lead.id} className="relative group">
                <LeadCard lead={lead} />
                <button 
                    onClick={() => onAddLead(lead)}
                    className="absolute top-4 right-4 bg-neon-400 hover:bg-neon-500 text-royal-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110"
                    title="Add to CRM"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default LeadFinder;