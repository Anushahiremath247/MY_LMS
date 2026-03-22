import { NextRequest, NextResponse } from "next/server";
import { getCoursesPage } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 12);
  const search = searchParams.get("search") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const accessType = (searchParams.get("accessType") as "free" | "paid" | "subscription" | null) ?? undefined;
  const enrolledOnly = searchParams.get("enrolledOnly") === "true";
  const data = await getCoursesPage({
    page,
    limit,
    search,
    category,
    accessType,
    enrolledOnly
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300"
    }
  });
}
