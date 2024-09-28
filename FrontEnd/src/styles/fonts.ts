import { Pattaya, Inter } from 'next/font/google';

export const pattaya = Pattaya({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-pattaya',
});

export const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});