import inquirer from 'inquirer'

import { spawn } from 'child_process'
import ora from 'ora'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

export default async function setupPrismic(projectName) {
  return new Promise((resolve, reject) => {
    const spawnProcess = spawn('npm', ['install', '@prismicio/client'], {
      shell: true,
      cwd: path.join(process.cwd(), projectName),
    })

    let spinner = ora({
      text: `Adding Prismic...`,
      color: 'blue',
    }).start()

    spawnProcess.on('exit', async (code) => {
      if (code !== 0) {
        console.log(`\n${chalk.red(`process exited with code ${code}`)}`)
        spawnProcess.exit(code)
      }
      spinner.succeed(`Prismic Added!`)
      const { repositoryName } = await inquirer.prompt({
        type: 'input',
        name: 'repositoryName',
        message: 'What is your Prismic repository name?',
      })

      const prismicContent = `
      const prismic = require('@prismicio/client');
      const client = prismic.client('${repositoryName}');
      module.exports = client;
    `
      const dirPath = path.join(process.cwd(), projectName, 'src/lib')
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      fs.writeFileSync(
        path.resolve(path.resolve(dirPath, 'prismic.js')),
        prismicContent
      )
      resolve()
    })
  })
}
