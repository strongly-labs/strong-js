context('App', () => {
  it('should load our app and show content', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Strong-js Next App')
  })
})
