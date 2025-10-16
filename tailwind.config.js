/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html", "script.js"],
  darkMode: "selector",
  theme: {
    screens:{
      'mobile': {'max':'425px'},
      'tablet': '768px',
      'desktop': '1024px'
    },
    safelist: ['text-green'],
    extend: {
      colors: {
        red:'#ff0000c4',
        green: '#57C76F',
        purple: {
          default:'#9E78CF',
          light: '#DFC7FF',
          dark: '#1D1825',
          black: '#15101C'
        },
        
      }
    },
  },
  plugins: [],
}

