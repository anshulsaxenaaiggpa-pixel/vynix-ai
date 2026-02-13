import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
    title: 'Vynix AI - AI Content Operating System',
    description: 'Create cinematic videos, studio voiceovers, and original music with AI. 60% cheaper than Runway + Suno + ElevenLabs combined. Start creating for free.',
    keywords: ['AI video generator', 'AI music generator', 'AI voice synthesis', 'content creation', 'Vynix AI', 'text to video', 'text to music', 'AI tools'],
    authors: [{ name: 'Vynix AI' }],
    creator: 'Vynix AI',
    publisher: 'Vynix AI',
    metadataBase: new URL('https://www.vynix.pro'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://www.vynix.pro',
        title: 'Vynix AI - AI Content Operating System',
        description: 'Create cinematic videos, studio voiceovers, and original music with AI. 60% cheaper than Runway + Suno + ElevenLabs combined.',
        siteName: 'Vynix AI',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Vynix AI - AI Content Operating System',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Vynix AI - AI Content Operating System',
        description: 'Create cinematic videos, studio voiceovers, and original music with AI. Start creating for free.',
        images: ['/og-image.png'],
        creator: '@vynixai',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
            <body className="bg-vynix-darker text-white font-body antialiased">
                <div className="min-h-screen bg-gradient-to-br from-vynix-darker via-vynix-dark to-vynix-darker">
                    {/* Background effects */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vynix-cyan/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vynix-purple/20 rounded-full blur-3xl"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}
