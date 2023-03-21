/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ['./index.html'],
    options: {
        safelist: [/(from|via|to|border|bg|text)-(.*)-(\\d{1}0{1,2})/]
    }
},
  content: ['./index.html'],
  theme: {
    extend: {},
  },
  plugins: []
}

