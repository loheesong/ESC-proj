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
        const username = `u_123`
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

describe('USE CASE: Login', () => { 
    beforeEach(() => {
        cy.visit("http://localhost:3000/login")
    });
    
    it('SAD PATH: cannot login', () => {
        cy.contains('button', 'Login').should('be.visible').click()
        cy.get('div.invalid-feedback.d-block')
            .should('have.length', 2)
            .each(($e) => {
                cy.wrap($e).should('have.text','This field is required!')
            })
    });

    it('HAPPY PATH: login with username and password', () => {
        const username = `u_123`
        cy.get('#username').type(username)
        cy.get('#password').type('TestPassword123')
        cy.contains('button', 'Login').should('be.visible').click()

        cy.url().should('include', '/profile')
        cy.contains(username)
    });
})

describe('USE CASE: Update account', () => { 
    beforeEach(() => {
        cy.visit("http://localhost:3000/login")
        const username = `u_123`
        cy.get('#username').type(username)
        cy.get('#password').type('TestPassword123')
        cy.contains('button', 'Login').should('be.visible').click()
        cy.url().should('include', '/profile')
        cy.contains(username)
    });

    it('SAD PATH: cannot update account', () => {
        cy.get('#username').clear()
        cy.contains('button', 'Update').should('be.visible').click()
        cy.contains('This field is required!')
    });

    it('HAPPY PATH: update username and email', () => {
        const username = `u_1234`
        cy.get('#username').clear().type(username)
        cy.contains('button', 'Update').should('be.visible').click()
        
        // wait for page to change
        cy.wait(2000) 

        cy.url().should('include', '/login')

        cy.get('#username').type(username)
        cy.get('#password').type('TestPassword123')
        cy.contains('button', 'Login').should('be.visible').click()
        cy.url().should('include', '/profile')
        cy.contains(username)
    });
})

describe('USE CASE: Delete account', () => { 
    beforeEach(() => {
        cy.visit("http://localhost:3000/login")
        const username = `u_1234`
        cy.get('#username').type(username)
        cy.get('#password').type('TestPassword123')
        cy.contains('button', 'Login').should('be.visible').click()
        cy.url().should('include', '/profile')
        cy.contains(username)
    });

    it('HAPPY PATH: able to delete account', () => {
        cy.contains('button', 'Delete').should('be.visible').click()
    });
})

describe('USE CASE: Search hotel', () =>  {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    });
    
    it('SAD PATH: no hotels shown', () => {
        cy.get('[data-testid="submitButtonID"]').click()
        cy.get('[data-testid="locationError"]').should('contain', 'Please input location')

        cy.get('[data-testid="searchbar"]').clear().type('asdasdasd')
        cy.get('[data-testid="searchbar"]').should('have.value', 'asdasdasd');

        cy.get('[data-testid="results-list"]').children().should('have.length', 0);
    });

    it('HAPPY PATH: able to search hotel', () => {
        cy.get('[data-testid="searchbar"]').clear().type('singa')
        cy.get('[data-testid="searchbar"]').should('have.value', 'singa');

        const expected_res = [{"term":"Singapore, Singapore","uid":"RsBU"},{"term":"Sentosa, Singapore","uid":"3W9U"},{"term":"Kallang, Singapore, Singapore","uid":"YD2Z"},{"term":"Outram, Singapore, Singapore","uid":"LF74"},{"term":"Colonial District, Singapore, Singapore","uid":"8V8Y"}]

        cy.get('[data-testid="results-list"]').children().each(($element, index) => {
            cy.wrap($element).should('contain',expected_res[index].term)
        })

        cy.get('[data-testid="results-list"]').children().first().click()

        cy.get('[data-testid="searchbar"]').should('have.value', 'Singapore, Singapore');
        cy.get('[data-testid="locationError"]').should('not.exist');
    });

    it('SAD PATH: date picker not filled, will produce error', () => {
        // get past the search bar error checking 
        cy.get('[data-testid="searchbar"]').clear().type('singa')
        cy.get('[data-testid="results-list"]').children().first().click()

        // start and end not filled, should error 
        cy.get('[data-testid="submitButtonID"]').click()
        cy.get('[data-testid="dateError"]').should('exist');
        cy.get('[data-testid="dateError"]').should('contain', 'Both start and end dates are required.');
    });

    it('HAPPY PATH: date picker', () => {
        // put tests for datepicker inside within block 
        cy.get('[data-testid="startDatePicker"]').within(() => {
            // click on calendar icon button 
            cy.get('[aria-label="Choose date"]').should('exist').click()
        })

        // calendar pop up exists
        cy.get('.MuiPaper-root').should('exist').should('contain', 'July 2024')

        cy.get('div[aria-rowindex="5"]').within(() => {
            cy.get('button').first().should('be.disabled')
        })

        cy.get('.MuiPickersArrowSwitcher-root').should('exist').within(() => {
            cy.get('button[aria-label="Previous month"]').should('exist').should('be.disabled')
            cy.get('button[aria-label="Next month"]').should('exist').should('not.be.disabled').click()
        });

        cy.get('.MuiPaper-root').should('exist').should('contain', 'August 2024')

        cy.get('div[aria-rowindex="1"][role="row"]').first().within(() => {
            cy.get('button').first().should('not.be.disabled').click()
        })

        // need to escape the colon so cy treat it as part of ID rather than pseudo class 
        cy.get('#\\:r1\\:').should('exist').should('have.value', '08/01/2024')
    });

    it('HAPPY PATH: number of guests', () => {
        
    });

    it('HAPPY PATH: nummber of rooms', () => {
        
    });

    it('HAPPY PATH: can search hotel with Singapore, Singapore', () => {
        // fill the search bar 
        cy.get('[data-testid="searchbar"]').clear().type('singa')
        cy.get('[data-testid="results-list"]').children().first().click()

        // fill start date 
        cy.get('[data-testid="startDatePicker"]').within(() => {
            cy.get('[aria-label="Choose date"]').should('exist').click()
        })
        cy.get('.MuiPickersArrowSwitcher-root').should('exist').within(() => {
            cy.get('button[aria-label="Previous month"]').should('exist').should('be.disabled')
            cy.get('button[aria-label="Next month"]').should('exist').should('not.be.disabled').click()
        });
        cy.get('div[aria-rowindex="1"][role="row"]').first().within(() => {
            cy.get('button').first().should('not.be.disabled').click()
        })
        cy.get('#\\:r1\\:').should('exist').should('have.value', '08/01/2024')

        // fill end date 
        cy.get('[data-testid="endDatePicker"]').within(() => {
            cy.get('[aria-label="Choose date"]').should('exist').click()
        })
        cy.get('div[aria-rowindex="1"][role="row"]').first().within(() => {
            cy.get('button').last().should('not.be.disabled').click()
        })
        cy.get('#\\:r5\\:').should('exist').should('have.value', '08/03/2024')

        // take num guest and num rooms default value 

        cy.get('[data-testid="submitButtonID"]').click()

        // check successful navigation
        cy.url().should('include', '/searchhotel/RsBU')
        cy.contains('Hotel Search')
    });
})

describe('USE CASE: View hotel room detail', () => { 
    it('HAPPY PATH: able to view hotel room', () => {
        
    });
    it('SAD PATH: hotel room dont exist', () => {
        
    });
})

describe('USE CASE: Book hotel room', () => { 
    it('HAPPY PATH: able to view hotel room', () => {
        
    });
    it('SAD PATH: hotel room dont exist', () => {
        
    });
})

describe('USE CASE: Delete booking', () => { 
    it('HAPPY PATH: able to delete booking', () => {
        
    });
    it('SAD PATH: cannot delete booking', () => {
        
    });
})