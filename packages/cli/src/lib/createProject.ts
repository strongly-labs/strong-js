import chalk from 'chalk'
import execa from 'execa'
import { copy, remove, rename } from 'fs-extra'
import { Ora } from 'ora'
import glob from 'tiny-glob'
import { JsonObject } from 'type-fest'
import { cannibalise } from './cannibalise'
import { createPackage } from './createPackage'

const { promisify } = require('util')
const rimraf = promisify(require('rimraf'))

export const createProject = async (
  name: string,
  config: JsonObject | null,
  spinner: Ora,
) => {
  const repos = config?.repos as JsonObject

  if (repos.projectTemplate) {
    const repo = repos.projectTemplate as JsonObject
    const clone = async () => {
      try {
        spinner.start(`Cloning ${chalk.blue.bold(repo.url)}...`)

        await execa('git', [
          'clone',
          '--single-branch',
          '--branch',
          repo.branch as string,
          repo.url as string,
          name,
        ])

        spinner.succeed('Template cloned successfully')
      } catch (error) {
        spinner.fail('Failed to clone template repo ' + repo.url)
        throw error
      }
    }

    const cannibaliseProject = async () => {
      try {
        spinner.start(`Cannibalising strong-js for ${chalk.blue.bold(name)}...`)

        await cannibalise(name)

        spinner.succeed('Cannibalised successfully')
      } catch (error) {
        spinner.fail('Cannibalisation failed')
        throw error
      }
    }

    const createExamplePackage = async () => {
      try {
        spinner.start(`Creating package ${chalk.blue.bold(name)}...`)

        await createPackage({
          org: name,
          name: 'example',
          template: 'strong-package',
          workspace: 'tmp/*',
        })

        await rimraf(`packages/*`)
        await copy('tmp/example', 'packages/example')
        await rimraf('tmp')

        spinner.succeed('Package packages/example created successfully')
      } catch (error) {
        spinner.fail('Package creation failed')
        throw error
      }
    }

    const prune = async () => {
      try {
        spinner.start(`Pruning files ${chalk.blue.bold(name)}...`)

        await rimraf('.git')
        await remove('.github/label.yml')

        const changesets = await glob(`.changeset/!(README).md`)

        for (const changeset of changesets) {
          await remove(changeset)
        }

        spinner.succeed('Files pruned successfully')
      } catch (error) {
        spinner.fail('Failed to prune')
        throw error
      }
    }

    const install = async () => {
      try {
        spinner.start(
          `Installing dependencies... This can take a few minutes ⌛️`,
        )

        await execa('yarn', ['install'])

        spinner.succeed('Dependencies installed successfully')
      } catch (error) {
        spinner.fail('Failed installing dependencies')
        throw error
      }
    }

    const postInstall = async () => {
      try {
        spinner.start('Running post install scripts...')

        await rename(`backend/.env.example`, `backend/.env`)
        await rename(
          `apps/web/app-main/.env.example`,
          `apps/web/app-main/.env.local`,
        )

        await rename(
          `apps/mobile/app-one/.env.example`,
          `apps/mobile/app-one/.env`,
        )

        await execa('yarn', ['data:gen'])
        await execa('yarn', ['build'])

        // Link packages
        await execa('npx', ['strong-js', 'link', '@strong-js/crud'])

        spinner.succeed('Project created successfuly!')

        console.log('Now you can cd into the directory and try:\n\n')

        console.log(chalk.green.bold('yarn up && yarn apps:dev\n\n'))
      } catch (error) {
        spinner.fail('Post install scripts failed')
        throw error
      }
    }

    await clone()
    await cannibaliseProject()

    // Set project dir as current working directory
    process.chdir(name)

    // Run inside project dir
    await createExamplePackage()
    await prune()
    await install()
    await postInstall()
  } else {
    spinner.fail(
      `Git repo for projectTemplate not found. Please add it to "repos" section of your root/strong.json`,
    )
  }

  process.exit(1)
}
