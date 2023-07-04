#!/usr/bin/env node

import inquirer from 'inquirer'

//setup imports
import setupAstro from './scripts/astro.js'
import astroAdd from './scripts/astroAdd.js'
import setupFlowbite from './scripts/flowbite.js'
import setupPrismic from './scripts/prismic.js'
import setupCSS from './scripts/cssReset.js'

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Project name?',
    default: 'my-astro-project',
  },
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
]

async function main() {
  const answers = await inquirer.prompt(questions)
  const name = answers.name
  const solid = answers.solid
  const tailwind = answers.tailwind
  const vercel = answers.vercel
  const flowbite = answers.flowbite
  const prismic = answers.prismic
  const cssReset = answers.cssReset

  await setupAstro(name)

  if (solid) await astroAdd(name, 'solid')
  if (vercel) await astroAdd(name, 'vercel')
  if (tailwind || flowbite) {
    await astroAdd(name, 'tailwind')
    if (flowbite) {
      await setupFlowbite(name)
    }
  }
  if (prismic) await setupPrismic(name)
  if (cssReset) await setupCSS(name)
}

main()
