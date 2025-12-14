import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { preferences, country, experience } = await request.json();

        if (!preferences) {
            return NextResponse.json(
                { error: 'Job preferences are required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey) {
            console.error('RAPIDAPI_KEY is missing');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Construct the search query
        let query = `${preferences}`;
        if (experience) {
            query += ` ${experience} level`;
        }

        // Map country codes to names for better search context
        const countryMap: { [key: string]: string } = {
            bd: 'Bangladesh',
            in: 'India',
            us: 'United States',
            uk: 'United Kingdom',
            ca: 'Canada',
            de: 'Germany',
            au: 'Australia',
            sg: 'Singapore',
        };
        const locationName = countryMap[country] || country;

        query += ` in ${locationName}`;

        console.log(`Searching for jobs: ${query}`);

        const url = 'https://jsearch.p.rapidapi.com/search';
        const params = new URLSearchParams({
            query: query,
            page: '1',
            num_pages: '3',
            date_posted: 'week', // Latest 7 days
        });

        const response = await fetch(`${url}?${params.toString()}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from JSearch API');
        }

        const data = await response.json();

        // JSearch returns { status: "OK", request_id: "...", data: [...] }
        if (data.status !== 'OK') {
            throw new Error('JSearch API returned an error');
        }

        const jobs = data.data?.map((job: any) => ({
            title: job.job_title,
            company: job.employer_name,
            location: `${job.job_city || ''}, ${job.job_country || ''}`.replace(/^, /, '').replace(/, $/, '') || 'Remote/Unspecified',
            salary: job.job_min_salary && job.job_max_salary
                ? `$${job.job_min_salary} - $${job.job_max_salary}`
                : 'Salary not specified',
            type: job.job_employment_type || 'Full-time',
            matchReason: job.job_description ? job.job_description.slice(0, 150) + '...' : 'Matches your search criteria',
            link: job.job_apply_link || job.job_google_link || '#',
            postedAt: job.job_posted_at_datetime_utc,
            logo: job.employer_logo,
        })) || [];

        return NextResponse.json({ jobs });

    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch job suggestions' },
            { status: 500 }
        );
    }
}
