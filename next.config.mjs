/** @type {import('next').NextConfig} */
const nextConfig = {
    'env': {
        // API_URL: 'http://localhost:3000',
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        HOST: process.env.HOST,
        PROJECT_ID: process.env.PROJECT_ID,
        STORAGE_BUCKET: process.env.STORAGE_BUCKET,
        MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
        APP_ID: process.env.APP_ID,
        GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    },
};

export default nextConfig;
