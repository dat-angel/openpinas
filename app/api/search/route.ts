import { NextRequest, NextResponse } from "next/server"
import { searchIndex, getSearchSuggestions, getCategories } from "@/lib/search-index"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || "all"
  const limit = parseInt(searchParams.get("limit") || "10", 10)

  if (!query || query.trim().length < 2) {
    return NextResponse.json({
      results: [],
      suggestions: getSearchSuggestions(),
      categories: getCategories(),
    })
  }

  const results = searchIndex(query, category, limit)

  return NextResponse.json({
    results,
    query,
    category,
    count: results.length,
  })
}
