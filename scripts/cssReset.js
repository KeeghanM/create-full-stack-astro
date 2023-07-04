import ora from 'ora'
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'

const colorValidator = async (input) => {
  if (
    (input.includes('#') ? !input.includes(',') : input.includes(',')) &&
    !input.includes('(') &&
    !input.includes(')')
  ) {
    return true
  }
  return 'Invalid Input'
}

const hexToRgb = (hex) =>
  hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16))

const defaultPrimary = '249,101,0'
const defaultAccent = '0,116,191'

const questions = [
  {
    type: 'confirm',
    name: 'colorScheme',
    message: 'Do you already have a primary & accent color?',
  },
  {
    when: (answers) => answers.colorScheme === true,
    type: 'input',
    name: 'primaryColor',
    default: defaultPrimary,
    message:
      'What is your Primary Color? (if using a hex value like #ffffff please include the "#". If using an RGB value like RGB(255,255,255) just enter the numbers separated by , "255,255,255"',
    validate: colorValidator,
  },
  {
    when: (answers) => answers.colorScheme === true,
    type: 'input',
    name: 'accentColor',
    default: defaultAccent,
    message:
      'What is your Accent Color? (if using a hex value like #ffffff please include the "#". If using an RGB value like RGB(255,255,255) just enter the numbers separated by , "255,255,255"',
    validate: colorValidator,
  },
]

export default async function setupCSS(projectName) {
  let spinner = ora({
    text: `Setting some default CSS...`,
    color: 'blue',
  }).start()

  spinner.succeed(`Prismic Added!`)
  const { colorScheme, primaryColor, accentColor } = await inquirer.prompt(
    questions
  )

  let primaryCol = colorScheme ? primaryColor : defaultPrimary
  let accentCol = colorScheme ? accentColor : defaultAccent

  const [primaryR, primaryG, primaryB] = primaryCol.includes('#')
    ? hexToRgb(primaryCol)
    : primaryCol.split(',')

  const [accentR, accentG, accentB] = accentCol.includes('#')
    ? hexToRgb(accentCol)
    : accentCol.split(',')

  const fontFamilyImportString = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Montserrat:wght@300;400;700&display=swap" rel="stylesheet">
    </head>
`

  const CssString = `
  <style is:global>
  /* @link https://utopia.fyi/type/calculator?c=320,18,1.2,1240,20,1.333,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */
      :root {
        --clr-text-rgb: 26,38,45;
        --clr-surface-rgb: 243,243,243;
        --clr-primary-rgb: ${primaryR},${primaryG},${primaryB};
        --clr-accent-rgb: ${accentR},${accentG},${accentB};

        --clr-text: rgb(var(--clr-text-rgb));
        --clr-surface: rgb(var(--clr-surface-rgb));
        --clr-primary: rgb(var(--clr-primary-rgb));
        --clr-accent: rgb(var(--clr-accent-rgb));

        --ff-base: 'Montserrat', sans-serif;
        --ff-accent: 'Barlow Condensed', sans-serif;

        --fs-200: clamp(0.70rem, calc(0.81rem + -0.13vw), 0.78rem);
        --fs-300: clamp(0.94rem, calc(0.94rem + 0.00vw), 0.94rem);
        --fs-400: clamp(1.13rem, calc(1.08rem + 0.22vw), 1.25rem);
        --fs-500: clamp(1.35rem, calc(1.24rem + 0.55vw), 1.67rem);
        --fs-600: clamp(1.62rem, calc(1.41rem + 1.05vw), 2.22rem);
        --fs-700: clamp(1.94rem, calc(1.59rem + 1.77vw), 2.96rem);
        --fs-800: clamp(2.33rem, calc(1.77rem + 2.81vw), 3.95rem);
        --fs-900: clamp(2.80rem, calc(1.94rem + 4.28vw), 5.26rem);
      }

      @media (prefers-color-scheme: dark){
         :root {
          --clr-text-rgb: 243,243,243;
          --clr-surface-rgb: 26,38,45;

          --clr-text: rgb(var(--clr-text-rgb));
          --clr-surface: rgb(var(--clr-surface-rgb));
         }
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      * {
        margin:0;
      }

      html {
        color-scheme: light dark;
      }

      img {
        max-width: 100%;
        display: block;
      }

      body {
        font-family: var(--ff-base);
        font-size: var(--fs-400);
        line-height: 1.7;
        background: var(--clr-surface);
        color: var(--clr-text);
      }

      h1, h2, h3 {
        font-family: var(--ff-accent);
        line-height: 1.1;
        text-wrap: balance;
      }

      h1 {
        font-size: var(--fs-800);
        color: var(--clr-primary);
        margin-top: 2em;
      }

      h2 {
        font-size: var(--fs-600);
        color: var(--clr-primary);
      }

      a {
        color: var(--clr-primary);
      }

      a:hover,
      a:focus {
        color: var(--accent);
      }

      ::marker {
        color: var(--clr-primary);
      }

      .wrapper {
        width: min(100% - 3rem, 75ch);
        margin-inline: auto;
      }

      .flow > * + * {
        margin-top: var(--flow-space, 1em);
      }

      h2 {
        --flow-space: 1.5em;
      }
    </style>
    `

  const filePath = path.join(
    process.cwd(),
    projectName,
    'src/layouts/Layout.astro'
  )

  let astroFile = fs.readFileSync(filePath, 'utf-8')
  astroFile = astroFile.replace(`</head>`, fontFamilyImportString)
  astroFile = astroFile.split('<style is:global>')[0] + CssString

  fs.writeFileSync(filePath, astroFile)
}
