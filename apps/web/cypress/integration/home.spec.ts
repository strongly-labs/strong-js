import { sharedContent } from '@stly/lib'

const loginUrl = `${Cypress.env('SITE_NAME')}/signin`

describe('Home Page', () => {
  before(() => {
    cy.log(`Visiting ${loginUrl}`)
    cy.visit('/')
  })

  it('should load shared content', () => {
    cy.get('[data-test-id=home-shared-content]').contains(sharedContent.name)
  })
})
