import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import JobForm from "@/components/jobs/JobForm";
import { BriefcaseBusiness, Sparkles } from "lucide-react";

export default function PostJobPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="page-shell flex-1 space-y-6">
        <section className="surface-card-strong hero-panel p-6 md:p-8">
          <div className="max-w-2xl space-y-4">
            <span className="section-kicker">
              <Sparkles size={12} />
              Employer studio
            </span>
            <div className="flex items-start gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "var(--hero-accent-soft)" }}
              >
                <BriefcaseBusiness size={20} style={{ color: "var(--hero-accent)" }} />
              </div>
              <div>
                <h1
                  className="text-3xl font-display font-bold tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  Post a new role with a stronger first impression
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-7 text-muted">
                  Fill in the details below. Every listing goes through review before
                  it appears on the public board.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="surface-card-strong p-6 md:p-7">
          <JobForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
