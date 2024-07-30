describe('Basic test: can load the page', () => { 
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    });

    it('should load the homepage', () => {
        cy.get('.navbar-brand').should('have.text', 'Destination EZ')
    });

    it('should have the correct url', () => {
        cy.url().should('include', '/')
    });
})

describe('USE CASE: register', () => { 
    beforeEach(() => {
        cy.visit("http://localhost:3000")
        cy.get('a.nav-link[href="/register"]').click();
        cy.url().should('include', '/register')
    });

    it('HAPPY PATH: visitor enters username, email details, password', () => {
        // fill form 
        const username = `u_${Date.now()}`
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="email"]').type(`${username}@example.com`);
        cy.get('input[name="password"]').type('TestPassword123');

        // submit form
        cy.get('form').submit();

        // check alert div 
        cy.get('.alert').should('be.visible').and('contain', 'User registered successfully!')
    });

    it('SAD PATH: username, email, password not valid', () => {
        const username = `a`
        cy.get('input[name="username"]').type(username);
        cy.get('input[name="email"]').type(`${username}gmail`);
        cy.get('input[name="password"]').type(`${username}`);
        cy.get('form').submit();

        cy.contains('The username must be between 3 and 20 characters.')
        cy.contains('This is not a valid email.')
        cy.contains('The password must be between 6 and 40 characters.')
    });
})

describe('USE CASE: Search hotel', () => { 
    
})

describe('USE CASE: View hotel room detail', () => { 
    
})

describe('USE CASE: Book hotel room', () => { 
    
})

describe('USE CASE: Delete  booking', () => { 
    
})

describe('USE CASE: Update account', () => { 
    
})

describe('USE CASE: Delete account', () => { 
    
})