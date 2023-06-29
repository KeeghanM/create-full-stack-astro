import { spawn } from 'child_process'
import ora from 'ora'
import chalk from 'chalk'

export default function setupAstro(name) {
  return new Promise((resolve, reject) => {
    const process = spawn('npm', ['create', 'astro@latest', name], {
      shell: true,
    })

    let spinner = ora({
      text: 'Setting up the base Astro project...',
      color: 'blue',
    }).start()

    process.stdout.on('data', (data) => {
      const output = data.toString()

      if (output.includes('create-astro package?')) {
        process.stdin.write('y\n')
        spinner.text = 'Installing create-astro package...'
      } else if (
        output.includes('How would you like to start your new project?')
      ) {
        process.stdin.write('1\n')
        spinner.text = 'Configuring basic template...'
      } else if (output.includes('Install dependencies?')) {
        process.stdin.write('1\n')
        spinner.text = 'Installing dependencies...'
      } else if (output.includes('Do you plan to write TypeScript?')) {
        process.stdin.write('1\n')
        spinner.text = 'Setting up TypeScript...'
      } else if (output.includes('How strict should TypeScript be?')) {
        process.stdin.write('1\n')
        spinner.text = 'Configuring TypeScript...'
      } else if (output.includes('Initialize a new git repository?')) {
        process.stdin.write('1\n')
        spinner.text = 'Initializing Git repository...'
      }
    })

    process.on('exit', (code) => {
      if (code !== 0) {
        console.log(`\n${chalk.red(`Astro process exited with code ${code}`)}`)
        process.exit(code)
      }
      spinner.succeed('Base astro setup complete!')
      resolve()
    })
  })
}
