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

describe('Form List Detail', () => {
    
    it('should participate to a session then unparticipate', () => {
        cy.loginUserWithSession()
        cy.contains('session test1').should('be.visible')
        //Mock session1
        cy.intercept('GET', '/api/session/1', {
            body: {
                id: 1,
                name: 'session test1',
                description: 'session test1',
                date: '2025-05-12T00:00:00.000+00:00',
                createdAt: '2025-05-12T00:00:00.000+00:00',
                teacher_id: 1,
                users: []
            }
        })
        //Mocke teacher1
        cy.intercept('GET', '/api/teacher/1', [
            {
                id: 1,
                lastName: 'DELAHAYE',
                firstName: 'Margot',
                createdAt: new Date(2025, 5),
                updatedAt: new Date(2025, 5)
            }
        ])
        cy.contains('span.ml1', 'Detail').click()
        cy.contains('span.ml1', 'Participate').should('be.visible')
        //Mock participate
        cy.intercept('POST', '/api/session/1/participate/1', { statusCode: 200 })
        //Mock session1 récupérée avec user1
        cy.intercept('GET', '/api/session/1', {
            body: {
                id: 1,
                name: 'session test1',
                description: 'session test1',
                date: '2025-05-12T00:00:00.000+00:00',
                createdAt: '2025-05-12T00:00:00.000+00:00',
                teacher_id: 1,
                users: [ 1 ]
            }
        })
        cy.contains('span.ml1', 'Participate').click()
        cy.contains('span.ml1', 'Do not participate').should('be.visible')
        //Mock unparticipate
        cy.intercept('DELETE', '/api/session/1/participate/1', { statusCode: 200 })
        //Mock session1 récupérée avec user1
        cy.intercept('GET', '/api/session/1', {
            body: {
                id: 1,
                name: 'session test1',
                description: 'session test1',
                date: '2025-05-12T00:00:00.000+00:00',
                createdAt: '2025-05-12T00:00:00.000+00:00',
                teacher_id: 1,
                users: []
            }
        })
        cy.contains('span.ml1', 'Do not participate').click()
        cy.contains('span.ml1', 'Participate').should('be.visible')
    })
});

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

describe('Create Update Details Delete Session as Admin)', () => {

    it('should create a session', () => {
        //Mock teachers
        cy.intercept('GET', '/api/teacher',
            [{
                id: 1,
                lastName: 'DELAHAYE',
                firstName: 'Margot',
                createdAt: new Date(2025, 5),
                updatedAt: new Date(2025, 5)
            },
            {
                id: 1,
                lastName: 'THIERCELIN',
                firstName: 'Hélène',
                createdAt: new Date(2025, 5),
                updatedAt: new Date(2025, 5)
            }]
        )
        //Mock CREATE session
        cy.intercept('POST', '/api/session',
            {
                id: 1,
                name: 'session test1',
                description: 'session test1',
                date: new Date(2025, 5),
                teacher_id: 1,
                createdAt: new Date(2025, 5)
            }
        )
        cy.loginAdmin()
        cy.contains('span.ml1', 'Create').should('be.visible')
        cy.contains('span.ml1', 'Create').click()
        cy.contains('Create session').should('be.visible')
        cy.get('input[formControlName=name]').type('session test1')
        cy.get('input[formControlName=date]').type('2025-05-12')
        cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').contains('Margot DELAHAYE').click()
        cy.get('textarea[formControlName=description]').type('session test1')
        //Mock sessions
        cy.intercept('GET', '/api/session',
            {
                body: [{
                    id: 1,
                    name: 'session test1',
                    description: 'session test1',
                    date: new Date(2025, 5),
                    teacher_id: 1,
                    users: [],
                }]
            }
        )
        cy.get('button[type=submit]').click();
        cy.url().should('include', '/sessions')
        cy.contains('Session created !').should('be.visible')
        cy.wait(3000)
        cy.contains('session test1').should('be.visible')
    })

    it('should update a session', () => {
        //Mock teachers
        cy.intercept('GET', '/api/teacher',
            [{
                id: 1,
                lastName: 'DELAHAYE',
                firstName: 'Margot',
                createdAt: new Date(2025, 5),
                updatedAt: new Date(2025, 5)
            },
            {
                id: 1,
                lastName: 'THIERCELIN',
                firstName: 'Hélène',
                createdAt: new Date(2025, 5),
                updatedAt: new Date(2025, 5)
            }]
        )
        //Mock session1
        cy.intercept('GET', '/api/session/1',
            {
                body: {
                    id: 1,
                    name: 'session test1',
                    description: 'session test1',
                    date: '2025-05-12T00:00:00.000+00:00',
                    createdAt: '2025-05-12T00:00:00.000+00:00',
                    teacher_id: 1,
                    users: []
                }
            }
        )
        cy.contains('span.ml1', 'Edit').click()
        cy.get('input[formControlName=name]').type(' updated')
        cy.get('textarea[formControlName=description]').type(' updated')
        //Mock sessions
        cy.intercept('GET', '/api/session',
            {
                body: [{
                    id: 1,
                    name: 'session test1 updated',
                    description: 'session test1 updated',
                    date: new Date(2025, 5),
                    teacher_id: 1,
                    users: [],
                }]
            }
        )
        //Mock UPDATE session
        cy.intercept('PUT', '/api/session/1',
            {
                id: 1,
                name: 'session test1 updated',
                description: 'session test1 updated',
                date: new Date(2025, 5),
                teacher_id: 1,
                updatedAt: new Date(2025, 5)
            }
        )
        cy.get('button[type=submit]').click();
        cy.url().should('include', '/sessions')
        cy.contains('Session updated !').should('be.visible')
        cy.wait(3000)
        cy.contains('session test1 updated').should('be.visible')
    })

    it('should show detailSession AND should delete session', () => {
        //Mock teacher1
        cy.intercept('GET', '/api/teacher/1',
            [{
                id: 1,
                lastName: 'DELAHAYE',
                firstName: 'Margot',
                createdAt: new Date(2025, 5),
                updatedAt: new Date(2025, 5)
            }]
        )
        //Mock session1
        cy.intercept('GET', '/api/session/1',
            {
                body: {
                    id: 1,
                    name: 'session test1 updated',
                    description: 'session test1 updated',
                    date: '2025-05-12T00:00:00.000+00:00',
                    createdAt: '2025-05-12T00:00:00.000+00:00',
                    updateAd: '2025-05-12T00:00:00.000+00:00',
                    teacher_id: 1,
                    users: []
                }
            }
        )
        cy.contains('span.ml1', 'Detail').click()
        cy.contains('div.description', 'session test1 updated').should('be.visible')
        //Mock DELETE session1
        cy.intercept('DELETE', '/api/session/1', { statusCode: 200 })
        cy.contains('span.ml1', 'Delete').click()
        cy.url().should('include', '/sessions')
        cy.contains('Session deleted !').should('be.visible')
        cy.wait(3000)
    })
});
