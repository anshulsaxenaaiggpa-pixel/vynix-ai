import { headers } from 'next/headers';
import PricingClient from './PricingClient';

export default async function PricingPage() {
    // Server-side Geo Detection
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';

    // Simple check for India IP (Mock logic for now, or use a library)
    // In production, Next.js Middleware or a service like ipapi.co is better.
    // For now, we'll pass the IP to the client component or do a simple fetch if possible.

    // Let's try to fetch geo info here on the server to avoid client flicker
    let countryCode = 'US';
    let currency: 'USD' | 'INR' = 'USD';

    try {
        // Use a fast geo service or trusted header if behind Cloudflare/Vercel
        // Vercel/Railway often frame 'x-vercel-ip-country' or similar.
        const countryHeader = headersList.get('x-vercel-ip-country') || headersList.get('cf-ipcountry');

        if (countryHeader) {
            countryCode = countryHeader;
        } else if (ip !== '127.0.0.1' && ip !== '::1') {
            // Fallback to fetch if no headers (e.g. Railway without CDN prop?)
            // Note: Fetching in RSC is fine. 
            const response = await fetch(`http://ip-api.com/json/${ip}`, { next: { revalidate: 3600 } });
            const data = await response.json();
            countryCode = data.countryCode || 'US';
        }

        if (countryCode === 'IN') {
            currency = 'INR';
        }
    } catch (error) {
        console.error('Geo detection failed:', error);
        // Fallback to USD
    }

    return (
        <PricingClient
            initialCurrency={currency}
            countryCode={countryCode}
        />
    );
}
