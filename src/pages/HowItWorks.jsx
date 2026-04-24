import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Lightbulb, ArrowRightLeft, BarChart3, Info } from 'lucide-react';

const HowItWorks = () => {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
            <Info className="w-8 h-8 text-blue-600"/> Platform Documentation
          </h1>
          <p className="text-text-secondary mt-2 text-lg">A guide to the active coordination features powering UDRMS.</p>
        </div>

        <div className="grid gap-8">
          
          {/* Resource Match Engine */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <ArrowRightLeft className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">1. The Resource Marketplace "Match Engine"</h2>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">The Problem: Supply & Demand Gaps</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  One of the biggest issues in disaster relief is the gap between supply and demand—one NGO might have 500 blankets, while another is urgently looking for them nearby.
                </p>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-gray-800 mb-2">How UDRMS Solves It:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    When an agency logs an <b>Active Ground Need</b> (e.g., Thermal Blankets in Sector 4), the system automatically scans the <b>Available Inventory</b> database. It cross-references the required item category and the geographical zone. If it finds a match, it actively alerts the requesting agency right on their dashboard, allowing them to directly request the resources from the holding NGO instead of duplicating purchasing efforts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Shadow Planning */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">2. Predictive "Shadow Planning"</h2>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">The Problem: Repeating Past Mistakes</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Valuable post-disaster reports are often buried in PDFs and forgotten. When a new disaster strikes, responders often make the exact same logistical errors.
                </p>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-gray-800 mb-2">How UDRMS Solves It:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    When an agency begins filling out the form to log a new activity, the system watches what <b>Zone</b> and <b>Activity Type</b> they are typing in. It immediately filters through the historical "Lessons Learned" database. If it detects that a past relief effort in that specific zone failed (for example, medical camps washing away in flood zones), it instantly surfaces a warning and a recommendation to the user before they even hit submit.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Data Aggregation */}
          <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">3. Dashboard Analytics Aggregation</h2>
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider">The Problem: Stale Reporting</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In crisis scenarios, waiting for nightly database jobs to update charts means nodal officers are making decisions based on outdated data.
                </p>
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-gray-800 mb-2">How UDRMS Solves It:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    To give nodal officers a bird's-eye view of the relief effort, the dashboard calculates analytics on the fly using Javascript array reductions. The system takes the raw list of field activities, aggregates the total budget spent by each agency for the Bar Chart, and tallies the frequency of each activity type for the Pie Chart. As soon as a user applies a filter, the charts instantly recalculate to reflect the live data.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
};

export default HowItWorks;
