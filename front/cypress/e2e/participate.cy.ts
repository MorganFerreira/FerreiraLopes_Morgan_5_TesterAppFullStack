import '../support/commands.ts'

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
