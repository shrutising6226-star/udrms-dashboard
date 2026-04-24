import React, { useEffect, useState } from 'react';
import { Shield, MapPin, Building, Activity, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const PublicPortal = () => {
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState({ totalActivities: 0, activeAgencies: 0, totalFundsDisbursed: 0 });
  const [loading, setLoading] = useState(true);
  
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actRes, sumRes, postsRes] = await Promise.all([
          fetch('/api/v1/public/activities'),
          fetch('/api/v1/public/dashboard'),
          fetch('/api/v1/public/posts')
        ]);
        setActivities(await actRes.json());
        setSummary(await sumRes.json());
        setPosts(await postsRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Public Portal...</div>;

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    setSubmittingPost(true);
    try {
      const res = await fetch('/api/v1/public/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: newPostAuthor, content: newPostContent })
      });
      const data = await res.json();
      setPosts([data, ...posts]);
      setNewPostContent('');
      setNewPostAuthor('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPost(false);
    }
  };

  const activitiesByType = activities.reduce((acc, curr) => {
    acc[curr.activityType] = (acc[curr.activityType] || 0) + 1;
    return acc;
  }, {});
  const pieChartData = Object.keys(activitiesByType).map(key => ({ name: key, value: activitiesByType[key] }));
  const COLORS = ['#2563EB', '#16A34A', '#D97706', '#DC2626', '#9333EA'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">ReliefSync <span className="font-light text-slate-500">Transparency Portal</span></h1>
        </div>
        <div className="text-sm font-medium text-slate-500">Public Accountability Dashboard</div>
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full text-blue-600"><Activity className="w-8 h-8"/></div>
            <div><p className="text-sm text-gray-500 font-bold uppercase">Total Interventions</p><p className="text-3xl font-black">{summary.totalActivities}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <div className="p-4 bg-green-50 rounded-full text-green-600"><Building className="w-8 h-8"/></div>
            <div><p className="text-sm text-gray-500 font-bold uppercase">Active Agencies</p><p className="text-3xl font-black">{summary.activeAgencies}</p></div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">
            <div className="p-4 bg-orange-50 rounded-full text-orange-600"><IndianRupee className="w-8 h-8"/></div>
            <div><p className="text-sm text-gray-500 font-bold uppercase">Funds Tracked</p><p className="text-3xl font-black">₹{(summary.totalFundsDisbursed / 1000).toFixed(1)}k</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Live Relief Activities Feed</h2>
            {activities.map(activity => (
              <div key={activity.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">{activity.activityType}</span>
                    <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${activity.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {activity.status}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 gap-4 mb-3">
                  <span className="flex items-center gap-1"><Building className="w-4 h-4"/> {activity.agency.name}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {activity.zone}</span>
                  <span className="text-gray-400">• {format(new Date(activity.startDate), 'MMM dd, yyyy')}</span>
                </div>
                <p className="text-sm text-gray-700">{activity.description}</p>
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-500">Budget: ₹{activity.budget.toLocaleString()}</span>
                  <span className="text-gray-500">Beneficiaries: {activity.beneficiaries.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><PieChartIcon className="w-5 h-5"/> Activity Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
             </div>
             
             {/* COMMUNITY NOTICEBOARD */}
             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">Community Noticeboard</h3>
                
                <form onSubmit={handlePostSubmit} className="mb-4 space-y-3 shrink-0">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    className="w-full border p-2 rounded text-sm"
                    value={newPostAuthor}
                    onChange={(e) => setNewPostAuthor(e.target.value)}
                  />
                  <textarea
                    required
                    placeholder="Share an update or need... Anyone can post!"
                    className="w-full border p-2 rounded text-sm resize-none h-20"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={submittingPost}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                  >
                    {submittingPost ? 'Posting...' : 'Post Message'}
                  </button>
                </form>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {posts.map(post => (
                    <div key={post.id} className="bg-slate-50 p-3 rounded border border-gray-200 text-sm shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-blue-900">{post.author}</span>
                        <span className="text-xs text-gray-500">{format(new Date(post.createdAt), 'MMM dd, HH:mm')}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                    </div>
                  ))}
                  {posts.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No posts yet. Be the first!</p>}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicPortal;
