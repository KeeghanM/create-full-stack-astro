import { spawn } from 'child_process'
import ora from 'ora'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

export default async function setupFlowbite(projectName) {
  return new Promise((resolve, reject) => {
    const spawnProcess = spawn('npm', ['install', 'flowbite'], {
      shell: true,
      cwd: path.join(process.cwd(), projectName),
    })

    let spinner = ora({
      text: `Adding Flowbite...`,
      color: 'blue',
    }).start()

    spawnProcess.on('exit', (code) => {
      if (code !== 0) {
        console.log(`\n${chalk.red(`process exited with code ${code}`)}`)
        spawnProcess.exit(code)
      }
      const filePath = path.join(
        process.cwd(),
        projectName,
        'tailwind.config.cjs'
      )

      spinner.succeed(`Flowbite Added!`)
      let tailwindConfig = fs.readFileSync(filePath, 'utf-8')
      tailwindConfig = tailwindConfig.replace(
        'module.exports = {',
        "module.exports = {\n\tplugins: [require('flowbite/plugin')],"
      )
      fs.writeFileSync(filePath, tailwindConfig)
      resolve()
    })
  })
}
