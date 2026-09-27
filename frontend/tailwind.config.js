/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Apple/Linear স্টাইল কালার প্যালেট
        background: '#ffffff',
        foreground: '#0f172a', // Slate-900
        primary: '#0071e3',    // Apple Blue
        secondary: '#64748b',  // Slate-500
        accent: '#f8fafc',     // Slate-50
        border: '#e2e8f0',     // Slate-200 (খুবই পাতলা বর্ডার)
      },
      fontFamily: {
        // প্রিমিয়াম সিস্টেম ফন্ট
        sans: ['Inter', 'San Francisco', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        // অত্যন্ত হালকা এবং প্রিমিয়াম শ্যাডো
        'apple': '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
        'linear': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}