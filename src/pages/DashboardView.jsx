import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AppShell } from '../components/layout/AppShell';
import { StatCard } from '../components/ui/StatCard';
import { Avatar } from '../components/ui/Avatar';
import { Users, UserPlus, Building2, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { format } from 'date-fns';

const DashboardView = () => {
  const { token } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/v1/dashboard/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [token]);

  if (loading) return <AppShell><div className="flex justify-center p-12">Loading...</div></AppShell>;
  if (!data) return <AppShell><div>Failed to load data</div></AppShell>;

  const COLORS = ['#2ECC9A', '#1AAF80', '#A8E6D0', '#FBBF24', '#60A5FA'];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard Overview</h1>
        
        {/* ROW 1: Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={Users} label="Total Employees" value={data.stats.totalEmployees} change={12} trend="up" />
          <StatCard icon={UserPlus} label="New Hires" value={data.stats.newHiresThisMonth} change={5} trend="up" />
          <StatCard icon={Building2} label="Departments" value={data.stats.departments} />
          <StatCard icon={Activity} label="Active Rate" value={`${data.stats.activeRate}%`} change={2} trend="down" />
        </div>

        {/* ROW 2: Recent Employees & Dept Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-text-primary">Recent Hires</h3>
              <button className="text-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-sm text-text-secondary">
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Position</th>
                    <th className="pb-3 font-medium">Department</th>
                    <th className="pb-3 font-medium">Join Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentHires.map(emp => (
                    <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <Avatar src={emp.avatarUrl} name={emp.name} size="sm" />
                        <span className="font-medium text-text-primary text-sm">{emp.name}</span>
                      </td>
                      <td className="py-3 text-sm text-text-secondary">{emp.position}</td>
                      <td className="py-3 text-sm text-text-secondary">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                          {emp.department}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-text-secondary">{format(new Date(emp.joinDate), 'MMM dd, yyyy')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-surface rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-border p-6 flex flex-col">
            <h3 className="text-lg font-bold text-text-primary mb-4">Department Distribution</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.deptDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.deptDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 3: Attendance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-border p-6">
             <h3 className="text-lg font-bold text-text-primary mb-4">Today's Attendance</h3>
             <div className="flex gap-4">
                <div className="flex-1 bg-status-activeBg p-4 rounded-xl border border-green-100">
                  <div className="text-sm font-medium text-status-activeText mb-1">Present</div>
                  <div className="text-2xl font-bold text-status-activeText">{data.attendance.present}</div>
                </div>
                <div className="flex-1 bg-status-inactiveBg p-4 rounded-xl border border-red-100">
                  <div className="text-sm font-medium text-status-inactiveText mb-1">Absent</div>
                  <div className="text-2xl font-bold text-status-inactiveText">{data.attendance.absent}</div>
                </div>
                <div className="flex-1 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <div className="text-sm font-medium text-yellow-800 mb-1">On Leave</div>
                  <div className="text-2xl font-bold text-yellow-800">{data.attendance.leave}</div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
};

export default DashboardView;
