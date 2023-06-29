import { spawn } from 'child_process'
import ora from 'ora'
import chalk from 'chalk'
import path from 'path'

export default async function astroAdd(projectName, installerName) {
  return new Promise((resolve, reject) => {
    const spawnProcess = spawn('npx', ['astro', 'add', installerName], {
      shell: true,
      cwd: path.join(process.cwd(), projectName),
    })

    let spinner = ora({
      text: `Adding ${installerName}...`,
      color: 'blue',
    }).start()

    spawnProcess.stdout.on('data', (data) => {
      const output = data.toString()

      if (output.includes('Astro will run the following command:')) {
        spawnProcess.stdin.write('y\n')
        spinner.text = 'Installing packages...'
      } else if (output.includes('Astro will make the following changes')) {
        spawnProcess.stdin.write('y\n')
        spinner.text = 'Configuring files...'
      } else if (output.includes('Continue?')) {
        spawnProcess.stdin.write('y\n')
        spinner.text = 'Setting up...'
      }
    })

    spawnProcess.on('exit', (code) => {
      if (code !== 0) {
        console.log(`\n${chalk.red(`process exited with code ${code}`)}`)
        spawnProcess.exit(code)
      }
      spinner.succeed(`${installerName} Added!`)
      resolve()
    })
  })
}
