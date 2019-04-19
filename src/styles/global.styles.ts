import { createGlobalStyle } from 'styled-components/macro'

export default createGlobalStyle<{ background?: string }>`
  html, body, #root {
    height: 100vh;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background: ${p => p.background || '#fafafa'};
  }

  svg * {
    font-family: 'Roboto', sans-serif;
  }

  a {
    text-decoration: none;
  }
`
