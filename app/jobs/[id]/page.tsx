import { getJobById } from "@/lib/db";
import { notFound } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Badge, { getJobTypeBadge, formatJobType } from "@/components/ui/Badge";
import {
  MapPin,
  DollarSign,
  Building2,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job || job.status !== "ACTIVE") notFound();

  const company = job.company;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-mono transition-colors"
          style={{ color: "#5a5a8a" }}
        >
          <ArrowLeft size={12} />
          Back to jobs
        </Link>

        <div
          className="rounded-xl p-6 space-y-4"
          style={{
            background: "#0f0f20",
            border: "1px solid #252540",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: "#1a1a30" }}
            >
              {company?.logo ? (
                <Image
                  src={company.logo}
                  alt={company.name ?? ""}
                  width={64}
                  height={64}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <Building2 size={24} style={{ color: "#5a5a8a" }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-display font-bold text-white">
                {job.title}
              </h1>
              <p className="text-sm font-mono mt-1" style={{ color: "#5a5a8a" }}>
                {company?.name}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge
                  label={formatJobType(job.type)}
                  variant={getJobTypeBadge(job.type)}
                />
                <div
                  className="flex items-center gap-1 text-xs font-mono"
                  style={{ color: "#5a5a8a" }}
                >
                  <MapPin size={11} />
                  {job.location}
                </div>
                {job.salary && (
                  <div
                    className="flex items-center gap-1 text-xs font-mono"
                    style={{ color: "#5a5a8a" }}
                  >
                    <DollarSign size={11} />
                    {job.salary}
                  </div>
                )}
              </div>
            </div>
          </div>

          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "#4d9fff", color: "#ffffff" }}
          >
            Apply for this Position
            <ExternalLink size={14} />
          </a>
        </div>

        <div
          className="rounded-xl p-6"
          style={{
            background: "#0f0f20",
            border: "1px solid #252540",
          }}
        >
          <h2 className="text-sm font-display font-bold text-white mb-4">
            Job Description
          </h2>
          <div
            className="text-sm font-mono leading-relaxed whitespace-pre-wrap"
            style={{ color: "#a0a0c4" }}
          >
            {job.description}
          </div>
        </div>

        {company && (
          <div
            className="rounded-xl p-6 space-y-3"
            style={{
              background: "#0f0f20",
              border: "1px solid #252540",
            }}
          >
            <h2 className="text-sm font-display font-bold text-white">
              About {company.name}
            </h2>
            {company.description && (
              <p
                className="text-sm font-mono leading-relaxed"
                style={{ color: "#a0a0c4" }}
              >
                {company.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {company.location && (
                <div
                  className="flex items-center gap-1.5 text-xs font-mono"
                  style={{ color: "#5a5a8a" }}
                >
                  <MapPin size={11} />
                  {company.location}
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono"
                  style={{ color: "#4d9fff" }}
                >
                  <ExternalLink size={11} />
                  {company.website}
                </a>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
