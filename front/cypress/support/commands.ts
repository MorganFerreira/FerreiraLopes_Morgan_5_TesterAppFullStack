Cypress.Commands.add('loginAdmin', () => {
    
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
        body: {
            id: 1,
            username: 'userName',
            firstName: 'firstName',
            lastName: 'lastName',
            admin: true
        }
    })
    cy.intercept('GET', '/api/session')
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
})

Cypress.Commands.add('loginUser', () => {
  
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
        body: {
            id: 1,
            username: 'userName',
            firstName: 'firstName',
            lastName: 'lastName',
            admin: false
        }
    })
    cy.intercept('GET', '/api/session')
    cy.get('input[formControlName=email]').type("test1@gmail.com")
    cy.get('input[formControlName=password]').type(`${"test1test1"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
})

Cypress.Commands.add('loginUserWithSession', () => {
  
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', {
        body: {
            id: 1,
            username: 'userName',
            firstName: 'firstName',
            lastName: 'lastName',
            admin: false
        }
    })
    cy.intercept('GET', '/api/session', {
        body: [{
            id: 1,
            name: 'session test1',
            description: 'session test1',
            date: '2025-05-12T00:00:00.000+00:00',
            teacher_id: 1,
            users: []
        }]
    })
    cy.get('input[formControlName=email]').type("test1@gmail.com")
    cy.get('input[formControlName=password]').type(`${"test1test1"}{enter}{enter}`)
    cy.url().should('include', '/sessions')
})
