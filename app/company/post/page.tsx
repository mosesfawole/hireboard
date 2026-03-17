import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JobForm from "@/components/jobs/JobForm";

export default function PostJobPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-6">
        <div>
          <h1 className="text-xl font-display font-bold text-white">
            Post a New Job
          </h1>
          <p className="text-xs font-mono mt-1" style={{ color: "#5a5a8a" }}>
            Fill in the details below. Your job will be reviewed before going
            live.
          </p>
        </div>
        <div
          className="rounded-xl p-6"
          style={{ background: "#0f0f20", border: "1px solid #252540" }}
        >
          <JobForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
