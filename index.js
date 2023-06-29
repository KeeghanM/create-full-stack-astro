#!/usr/bin/env node

import { execSync } from 'child_process'
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'

function runCommand(command, directory = '.') {
  execSync(command, { stdio: 'inherit', cwd: path.resolve(directory) })
}

async function main() {
  const { name } = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'What is the name of your new project?',
  })

  console.log('Creating a new Astro project...')
  runCommand(`npm create astro@latest ${name} -y`)

  const options = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'solid',
      message: 'Do you want to add solidJS?',
    },
    {
      type: 'confirm',
      name: 'tailwind',
      message: 'Do you want to add Tailwind?',
    },
    {
      type: 'confirm',
      name: 'vercel',
      message: 'Do you want to deploy to Vercel?',
    },
    {
      type: 'confirm',
      name: 'flowbite',
      message: 'Do you want to add Flowbite?',
    },
    {
      type: 'confirm',
      name: 'prismic',
      message: 'Do you want to add Prismic?',
    },
    {
      type: 'confirm',
      name: 'cssReset',
      message: 'Do you want to setup recommended CSS Resets/Defaults?',
    },
  ])

  if (options.solid) {
    console.log('Adding SolidJS...')
    runCommand('npx astro add solid', name)
  }

  if (options.tailwind || options.flowbite) {
    console.log('Adding Tailwind...')
    runCommand('npx astro add tailwind', name)

    if (options.flowbite) {
      console.log('Adding Flowbite...')
      runCommand('npm install flowbite', name)
      let tailwindConfig = fs.readFileSync(
        path.resolve(name, 'tailwind.config.cjs'),
        'utf-8'
      )
      tailwindConfig = tailwindConfig.replace(
        'module.exports = {',
        "module.exports = {\n\tplugins: [require('flowbite/plugin')],"
      )
      fs.writeFileSync(
        path.resolve(name, 'tailwind.config.cjs'),
        tailwindConfig
      )
    }
  }

  if (options.vercel) {
    console.log('Preparing for deployment to Vercel...')
    runCommand('npx astro add vercel', name)
  }

  if (options.prismic) {
    console.log('Adding Prismic...')
    runCommand('npm install @prismicio/client', name)

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
    fs.writeFileSync(path.resolve(name, 'src/lib/prismic.js'), prismicContent)
  }

  if (options.cssReset) {
    console.log('Setting up CSS Resets/Defaults...')
    let astroFile = fs.readFileSync(
      path.resolve(name, 'src/pages/index.astro'),
      'utf-8'
    )
    astroFile = astroFile.replace(
      '</body>',
      '<style is:global>*{margin:0;}</style>\n</body>'
    )
    fs.writeFileSync(path.resolve(name, 'src/pages/index.astro'), astroFile)
  }

  console.log('Setup completed!')
}

main()
