import React, { useState } from 'react';
import { Lead, LeadTemperature } from '../types';
import { Mail, Phone, MapPin, ExternalLink, MoreVertical, MessageSquare, Globe } from 'lucide-react';
import { generateOutreachMessage } from '../services/gemini';

interface LeadCardProps {
  lead: Lead;
  onMoveStage?: (id: string, stage: string) => void;
  compact?: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, compact = false }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedMsg, setGeneratedMsg] = useState<string | null>(null);

  const getTempColor = (temp: LeadTemperature) => {
    switch (temp) {
      case LeadTemperature.HOT: return 'bg-red-50 text-red-600 border-red-100';
      case LeadTemperature.WARM: return 'bg-orange-50 text-orange-600 border-orange-100';
      case LeadTemperature.COLD: return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const handleGenerateOutreach = async () => {
    setGenerating(true);
    const msg = await generateOutreachMessage(lead, 'email');
    setGeneratedMsg(msg);
    setGenerating(false);
  };

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
             <h4 className="font-bold text-gray-900">{lead.businessName}</h4>
             <span className={`text-xs px-2 py-0.5 rounded-full border ${getTempColor(lead.temperature)}`}>
               {lead.temperature} • {lead.score}%
             </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{lead.notes}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900">{lead.businessName}</h3>
            {lead.website && (
                <a href={lead.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-royal-600">
                    <ExternalLink className="w-4 h-4" />
                </a>
            )}
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {lead.location}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className={`text-xs font-bold px-3 py-1 rounded-full border ${getTempColor(lead.temperature)}`}>
                {lead.temperature} Lead
            </div>
            <span className="text-xs font-semibold text-gray-400">Score: {lead.score}/100</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
            {lead.notes || "No notes available."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {lead.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" /> {lead.phone}
            </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" /> {lead.email || "Email unavailable"}
        </div>
      </div>

      {lead.searchSources && lead.searchSources.length > 0 && (
        <div className="mb-4 pt-3 border-t border-gray-100">
           <div className="flex items-center gap-1 mb-2">
              <Globe className="w-3 h-3 text-royal-500" />
              <span className="text-xs font-bold text-gray-500 uppercase">Verified Sources</span>
           </div>
           <div className="flex flex-wrap gap-2">
              {lead.searchSources.slice(0, 3).map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] bg-royal-50 text-royal-600 px-2 py-1 rounded border border-royal-100 hover:bg-royal-100 truncate max-w-[150px]"
                    title={source.title}
                  >
                    {source.title.substring(0, 20)}{source.title.length > 20 ? '...' : ''}
                  </a>
              ))}
              {lead.searchSources.length > 3 && (
                  <span className="text-[10px] text-gray-400 px-1 py-1">+{lead.searchSources.length - 3} more</span>
              )}
           </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
         <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{lead.status}</span>
         <div className="flex gap-2">
             <button 
                onClick={handleGenerateOutreach}
                disabled={generating}
                className="flex items-center gap-2 px-3 py-2 bg-royal-50 hover:bg-royal-100 text-royal-700 text-sm font-medium rounded-lg transition-colors"
            >
                {generating ? (
                    <span className="animate-spin w-4 h-4 border-2 border-royal-600 border-t-transparent rounded-full"></span>
                ) : (
                    <MessageSquare className="w-4 h-4" />
                )}
                AI Draft
             </button>
             <button className="px-3 py-2 bg-royal-600 hover:bg-royal-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                Connect
             </button>
         </div>
      </div>

      {generatedMsg && (
          <div className="mt-4 p-4 bg-royal-50 border border-royal-100 rounded-lg animate-in fade-in slide-in-from-top-2">
             <div className="flex justify-between mb-2">
                <h5 className="text-xs font-bold text-royal-800 uppercase">AI Draft</h5>
                <button onClick={() => setGeneratedMsg(null)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
             </div>
             <p className="text-sm text-gray-700 whitespace-pre-line font-mono leading-relaxed">{generatedMsg}</p>
             <div className="mt-3 flex justify-end gap-2">
                 <button className="text-xs font-medium text-royal-600 hover:text-royal-800">Copy</button>
                 <button className="text-xs font-medium bg-royal-600 text-white px-3 py-1 rounded hover:bg-royal-700">Send</button>
             </div>
          </div>
      )}
    </div>
  );
};

export default LeadCard;