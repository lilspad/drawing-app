/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ['./**/*.{html,js}'],
    options: {
        safelist: [/(from|via|to|border|bg|text)-(.*)-(\\d{1}0{1,2})/]
    }
},
  content: ['./**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: []
}

