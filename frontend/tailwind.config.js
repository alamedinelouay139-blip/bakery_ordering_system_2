/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(280, 70%, 60%)',
                    dark: 'hsl(280, 70%, 50%)',
                },
                secondary: 'hsl(200, 70%, 55%)',
                success: 'hsl(140, 60%, 50%)',
                danger: 'hsl(0, 70%, 60%)',
                bg: {
                    primary: 'hsl(240, 15%, 8%)',
                    secondary: 'hsl(240, 12%, 12%)',
                },
                text: {
                    primary: 'hsl(0, 0%, 95%)',
                    secondary: 'hsl(0, 0%, 70%)',
                },
                border: 'hsl(240, 10%, 20%)',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
            borderRadius: {
                'md': '12px',
                'lg': '16px',
            },
            boxShadow: {
                'md': '0 4px 16px rgba(0, 0, 0, 0.4)',
                'lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
                'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
            },
            animation: {
                'spin-slow': 'spin 0.8s linear infinite',
                'slide-in': 'slideIn 0.3s ease-out',
            },
            keyframes: {
                slideIn: {
                    from: { transform: 'translateX(100%)', opacity: '0' },
                    to: { transform: 'translateX(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
