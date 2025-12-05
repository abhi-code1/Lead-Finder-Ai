import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lead, LeadStatus } from '../types';
import { TrendingUp, Users, CheckCircle, Mail } from 'lucide-react';

interface DashboardProps {
  leads: Lead[];
}

const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Conversion Rate', value: '4.2%', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Emails Sent', value: '1,240', icon: Mail, color: 'bg-purple-100 text-purple-600' },
    { label: 'Closed Deals', value: '18', icon: CheckCircle, color: 'bg-orange-100 text-orange-600' },
  ];

  const statusData = [
    { name: 'Prospect', value: leads.filter(l => l.status === LeadStatus.PROSPECT).length || 15 },
    { name: 'Engaged', value: leads.filter(l => l.status === LeadStatus.ENGAGED).length || 8 },
    { name: 'Negotiation', value: leads.filter(l => l.status === LeadStatus.NEGOTIATION).length || 4 },
    { name: 'Closed', value: leads.filter(l => l.status === LeadStatus.CLOSED).length || 2 },
  ];

  const COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6', '#22c55e'];

  const activityData = [
    { name: 'Mon', calls: 4, emails: 24 },
    { name: 'Tue', calls: 3, emails: 13 },
    { name: 'Wed', calls: 9, emails: 38 },
    { name: 'Thu', calls: 2, emails: 20 },
    { name: 'Fri', calls: 6, emails: 28 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your lead generation pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Outreach Activity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="emails" fill="#4338ca" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="calls" fill="#a3e635" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Pipeline Status</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
             {statusData.map((item, idx) => (
                 <div key={item.name} className="flex items-center justify-between text-sm">
                     <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                         <span className="text-gray-600">{item.name}</span>
                     </div>
                     <span className="font-bold text-gray-900">{item.value}</span>
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;