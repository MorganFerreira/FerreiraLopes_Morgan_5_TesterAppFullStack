import '../support/commands.ts'

describe('LoginAdmin, LoginUser, Login with bad credential, Logout', () => {

    it('should login admin', () => {
        cy.loginAdmin()
    })

    it('should login user', () => {
        cy.loginUser()
    })

    it('should login with bad credential', () => {
        cy.visit('/login')
        //Mock bad credentials response
        cy.intercept('POST', '/api/auth/login', { statusCode: 401,
            body: { message: 'Bad credentials'}
        })
        cy.get('input[formControlName=email]').type("badCredential@gmail.com")
        cy.get('input[formControlName=password]').type(`${"badCredential"}{enter}{enter}`)
        cy.contains('An error occurred').should('be.visible');
    })

    it('should logout', () => {
        cy.loginAdmin()
        cy.contains('Logout').click()
        cy.url().should('include', '/')
    })
})
