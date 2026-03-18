import { getActiveJobs } from "@/lib/db";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JobList from "@/components/jobs/JobList";
import JobFilters from "@/components/jobs/JobFilters";
import { Briefcase } from "lucide-react";

// This page runs on the server — data is fetched before the page is sent to the browser
// This is called Server Side Rendering (SSR) — faster initial load, better SEO
export default async function JobsPage() {
  const jobs = await getActiveJobs();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Briefcase size={18} style={{ color: "#4d9fff" }} />
            <h1
              className="text-xl font-display font-bold"
              style={{ color: "inherit" }}
            >
              Browse Jobs
            </h1>
          </div>
          <p className="text-sm font-mono" style={{ color: "#5a5a8a" }}>
            {jobs.length} opportunities available
          </p>
        </div>

        {/* Filters */}
        <JobFilters />

        {/* Job list */}
        <JobList jobs={jobs} />
      </main>

      <Footer />
    </div>
  );
}
