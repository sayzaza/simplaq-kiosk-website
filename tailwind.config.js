/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        milk: '#fef4ee',
        black: '#17181b',
        blackOverlay64: 'rgba(0, 0, 0, 0.64)',
        magenta: '#6941c6',
        blue: '#175cd3',
        blue2: '#17b1d3',
        blue4: '#6941c6',
        greyBlack: '#262626',
        greyMilk: '#D7DADD',
        greyDark: '#666666',
        greyMedium: '#868686',
        greyLight: '#ececec',
        greyWhite: '#f5f5f5',
        greySnow: '#fcfcfc',
        greyText: '#5c5c5c',
        greyLighter: '#e4e4e4',
        greenLight2: '#F4FCF9',
        greenLight: '#17b1d3',
        green: '#26ad75',
        greenDark: '#219766',
        orange: '#dda231',
        orangeDark: '#e83a64',
        orangeLight: '#f18c53',
        error: '#cf3737',
        blue2: '#17b1d3',
        blue3: '#175cd3',
        blue4: '#6941c6',
        blue5: '#eef4ff',
        blue6: '#3538cd',
        yellow: ' #dda231',
        backgroundLightPrimary: '#17181b',
        backroundLightSeptenary: '#f9fafb',
        light3: '#EEF1F4',
        brandSecondaryLightMax: '#fcebef',
        brandSecondaryNormal: '#e83a64',

        purpleLight: '#F7F2FC',
        purpleLight2: '#F2F5FC',
        purpleLight3: '#F7FBFF',
        sky: "#3A92DD",
      },
      backgroundImage: {
        radialPrimary: 'var(--brand-gradient-primary, radial-gradient(204.89% 132.84% at 6.50% 94.37%, #F18C53 0%, #E83A64 100%))'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        raleway: ['RaleWay', 'sans-serif']
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'md': '18px',
        'xl': '20px',
        '2xl': '24px',
        '4xl': '32px'
      },
      screens: {
        'lg': '1080px',
        '2xl': '1700px'
      }
    }
  },
  plugins: []
}
