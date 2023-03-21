/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ['./**/*.html'],
    safelist: [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-violet-500'
    ]
  },
  content: ['./**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: []
}

