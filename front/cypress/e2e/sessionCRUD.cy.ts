import '../support/commands.ts'

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
