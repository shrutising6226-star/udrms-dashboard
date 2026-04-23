import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';
import { Building, Shield, HeartHandshake, FileText, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

const AgenciesView = () => {
  const { token } = useAuthStore();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const res = await fetch('/api/v1/agencies', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setAgencies(data);
      } catch (error) {
        console.error("Failed to fetch agencies", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, [token]);

  if (loading) return <AppShell><div className="flex justify-center p-12">Loading Agencies...</div></AppShell>;

  const getIcon = (type) => {
    switch(type) {
      case 'GOVT': return <Shield className="w-8 h-8 text-blue-600" />;
      case 'NGO': return <HeartHandshake className="w-8 h-8 text-green-600" />;
      default: return <Building className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Registered Agencies</h1>
          <p className="text-sm text-text-secondary mt-1">Directory of all organizations participating in the disaster relief efforts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map(agency => (
            <div key={agency.id} className="bg-surface rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-full border border-gray-100">
                  {getIcon(agency.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{agency.name}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block uppercase">
                    {agency.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-text-muted font-medium flex items-center gap-1 mb-1">
                    <FileText className="w-3 h-3" /> Activities
                  </p>
                  <p className="text-lg font-bold">{agency._count.activities}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium flex items-center gap-1 mb-1">
                    <IndianRupee className="w-3 h-3" /> Disbursements
                  </p>
                  <p className="text-lg font-bold">{agency._count.funds}</p>
                </div>
              </div>

              <div className="mt-4 text-xs text-text-muted">
                Registered on {format(new Date(agency.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          ))}

          {agencies.length === 0 && (
            <div className="col-span-full text-center py-12 text-text-muted">No agencies registered.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default AgenciesView;
