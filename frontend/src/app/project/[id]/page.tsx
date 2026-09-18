"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function ProjectRedirectPage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/project/${params.id}/youtube`);
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-surface text-xs font-semibold text-brand-gray">
      Loading preview workspace...
    </div>
  );
}
