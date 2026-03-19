import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JobForm from "@/components/jobs/JobForm";

export default function PostJobPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-display font-bold" style={{ color: "var(--text)" }}>
            Post a New Job
          </h1>
          <p className="text-xs font-medium mt-1 text-muted">
            Fill in the details below. Your job will be reviewed before going
            live.
          </p>
        </div>
        <div className="surface-card-strong p-6">
          <JobForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
