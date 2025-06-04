import '../support/commands.ts'

describe('Register spec', () => {

    it('should init register form ', () => {
        cy.visit('/register');
        cy.get('app-register').should('be.visible');
        cy.get('app-register form').should('be.visible');
        cy.get('app-register form input[formControlName=firstName]').should('be.visible');
        cy.get('app-register form input[formControlName=lastName]').should('be.visible');
        cy.get('app-register form input[formControlName=email]').should('be.visible');
        cy.get('app-register form input[formControlName=password]').should('be.visible');
        cy.get('app-register form button[type="submit"]').should('be.visible');
    })

    it('should register then login', () => {
        cy.visit('/register')
        //Mock register
        cy.intercept('POST', '/api/auth/register', { body: { } })
        cy.get('input[formControlName=firstName]').type("test1")
        cy.get('input[formControlName=lastName]').type("test1")
        cy.get('input[formControlName=email]').type("test1@gmail.com")
        cy.get('input[formControlName=password]').type(`${"test1test1"}{enter}{enter}`)
        cy.url().should('include', '/login')
        cy.loginUser()
    })

    it('should not register with bad credentials', () => {
        cy.visit('/register')
        //Mock register
        cy.intercept('POST', '/api/auth/register', { statusCode: 400, body: { message: 'Bad credentials' } })
        cy.get('input[formControlName=firstName]').type("test1")
        cy.get('input[formControlName=lastName]').type("test1")
        cy.get('input[formControlName=email]').type("testEmail@gmail.com")
        cy.get('input[formControlName=password]').type(`${"psw"}{enter}{enter}`);
        cy.contains('An error occurred').should('be.visible');
    })
});
