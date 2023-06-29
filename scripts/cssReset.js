import ora from 'ora'
import fs from 'fs'
import path from 'path'

export default async function setupCSS(projectName) {
  let spinner = ora({
    text: `Setting some default CSS...`,
    color: 'blue',
  }).start()

  spinner.succeed(`Prismic Added!`)
  const { primaryColor } = await inquirer.prompt({
    type: 'input',
    name: 'primaryColor',
    message: 'What is your Primary Color?',
  })

  const filePath = path.join(
    process.cwd(),
    projectName,
    'src/pages/index.astro'
  )
  let astroFile = fs.readFileSync(filePath, 'utf-8')

  astroFile = astroFile.replace(
    '</body>',
    `<style is:global>
      :root{
        --clr-primary: ${primaryColor};
      }
      *{
        margin: 0;
      }
    </style>
    </body>`
  )
  fs.writeFileSync(filePath, astroFile)
}
