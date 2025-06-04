import '../support/commands.ts'

describe('Me and Not-found', () => {
  
    it('should login', () => {
        //Mock user
        cy.intercept('GET', '/api/user/1',
            {
                body: {
                    email: 'test1@gmail.com',
                    firstName: 'test1',
                    lastName: 'test1',
                    admin: false,
                    createdAt: new Date(2025, 5),
                    updatedAt: new Date(2025, 5)
                }
            }
        )
        cy.loginUser()
        cy.url().should('include', '/sessions')
        cy.contains('span.link', 'Account').should('be.visible')
        cy.contains('span.link', 'Account').click()
        cy.contains('Name: test1 TEST1').should('be.visible')
        cy.contains('Email: test1@gmail.com').should('be.visible');
        cy.contains('Delete my account:').should('be.visible');
        cy.contains('Create at: June 1, 2025').should('be.visible');
        cy.contains('Last update: June 1, 2025').should('be.visible');
    })

    it('should delete account', () => {
        //Mock DELETE user1
        cy.intercept('DELETE', 'api/user/1', { statusCode: 200 })
        cy.contains('span.ml1', 'Detail').click()
        cy.contains('Your account has been deleted !').should('be.visible')
        cy.wait(3000)
    })

    it('should redirect to not-found page', () => {
        cy.visit('/notAPage');
        cy.url().should('include', '/404')
        cy.contains('h1','Page not found').should('be.visible');
    })
});
