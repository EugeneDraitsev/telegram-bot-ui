import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
   html, body, #root {
     height: 100vh;
   }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background: ${(p) => p.theme?.colors?.background ?? '#fafafa'};
  }

   *, *::before, *::after {
     box-sizing: border-box;
   }

   svg * {
     font-family: 'Roboto', sans-serif;
   }

   a {
     text-decoration: none;
     color: inherit;
   }
`

export default GlobalStyles
