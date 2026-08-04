import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { preferences, country, experience } = await request.json();

    if (!preferences) {
      return NextResponse.json(
        { error: "Job preferences are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.RAPIDAPI_KEY;

    // Construct search query
    let query = `${preferences}`;
    if (experience) {
      query += ` ${experience} level`;
    }

    const countryMap: { [key: string]: string } = {
      bd: "Bangladesh",
      in: "India",
      us: "United States",
      uk: "United Kingdom",
      ca: "Canada",
      de: "Germany",
      au: "Australia",
      sg: "Singapore",
    };
    const locationName = countryMap[country] || country || "";
    if (locationName) {
      query += ` in ${locationName}`;
    }

    console.log(`[Job Suggestions] Searching for jobs: "${query}"`);

    let jobs: any[] = [];

    // 1. Primary Search via JSearch API (RapidAPI)
    if (apiKey) {
      try {
        const url = "https://jsearch.p.rapidapi.com/search";
        const params = new URLSearchParams({
          query: query,
          page: "1",
          num_pages: "1",
        });

        const response = await fetch(`${url}?${params.toString()}`, {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === "OK" && Array.isArray(data.data)) {
            jobs = data.data.map((job: any) => ({
              title: job.job_title,
              company: job.employer_name,
              location:
                `${job.job_city || ""}, ${job.job_country || ""}`
                  .replace(/^, /, "")
                  .replace(/, $/, "") || locationName || "Remote/Unspecified",
              salary:
                job.job_min_salary && job.job_max_salary
                  ? `$${job.job_min_salary} - $${job.job_max_salary}`
                  : "Salary not specified",
              type: job.job_employment_type || "Full-time",
              matchReason: job.job_description
                ? job.job_description.slice(0, 150) + "..."
                : "Matches your search criteria",
              link: job.job_apply_link || job.job_google_link || "#",
              postedAt: job.job_posted_at_datetime_utc || "Recently posted",
              logo: job.employer_logo,
            }));
          }
        } else {
          console.warn(
            `[Job Suggestions] JSearch returned status ${response.status}: ${response.statusText}`,
          );
        }
      } catch (jsearchErr) {
        console.warn("[Job Suggestions] JSearch API request warning:", jsearchErr);
      }
    }

    // 2. Fallback to SerpAPI Google Jobs if JSearch yielded 0 results or failed
    if (jobs.length === 0) {
      console.log("[Job Suggestions] Fallback: Searching via Google Jobs SerpAPI...");
      const serpApiKey = process.env.SERPAPI_API_KEY;
      if (serpApiKey) {
        try {
          const serpRes = await fetch(
            `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&api_key=${serpApiKey}`,
          );
          if (serpRes.ok) {
            const serpData = await serpRes.json();
            if (serpData.jobs_results && Array.isArray(serpData.jobs_results)) {
              jobs = serpData.jobs_results.map((j: any) => ({
                title: j.title,
                company: j.company_name,
                location: j.location || locationName || "Remote/Unspecified",
                salary: j.detected_extensions?.salary || "Competitive",
                type: j.detected_extensions?.schedule_type || "Full-time",
                matchReason: j.snippet || "Matches your search criteria",
                link: j.related_links?.[0]?.link || j.share_link || "#",
                postedAt: j.detected_extensions?.posted_at || "Recently posted",
                logo: j.thumbnail,
              }));
            }
          }
        } catch (serpErr) {
          console.warn("[Job Suggestions] SerpAPI Google Jobs fallback error:", serpErr);
        }
      }
    }

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error in job-suggestions route:", error);
    return NextResponse.json({ jobs: [] }, { status: 200 });
  }
}
