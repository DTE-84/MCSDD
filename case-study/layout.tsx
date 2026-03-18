import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PCSP - MCSDD Case Study",
  description: "High-fidelity clinical documentation and compliance engine for MCSDD.",
  openGraph: {
    title: "PCSP - MCSDD Case Study",
    description: "Healthcare Compliance Engine Architecture",
    images: ["/DTE-E-Portfolio/assets/pcsp1.png"],
  },
};

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
