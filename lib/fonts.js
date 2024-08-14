import localFont from 'next/font/local'

export const loretta = localFont({
  src: [
    {
      path: '../assets/fonts/Loretta-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Loretta-LightItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-loretta',
})

export const valty = localFont({
  src: [
    {
      path: '../assets/fonts/Valty-Regular.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-valty',
})

export const helveticaNowVar = localFont({
  src: [
    {
      path: '../assets/fonts/HelveticaNowVar.woff2',
      style: 'normal',
    },
    {
      path: '../assets/fonts/HelveticaNowVar-Italic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-helvetica-now-var',
})