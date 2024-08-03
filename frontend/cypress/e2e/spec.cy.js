import dayjs from 'dayjs';

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
        const today_MMMM_YYYY = dayjs().format('MMMM YYYY')
        cy.get('.MuiPaper-root').should('exist').should('contain', today_MMMM_YYYY)

        cy.get('.MuiPickersArrowSwitcher-root').should('exist').within(() => {
            cy.get('button[aria-label="Previous month"]').should('exist').should('be.disabled')
            cy.get('button[aria-label="Next month"]').should('exist').should('not.be.disabled').click()
        });

        const next_month_MMMM_YYYY = dayjs().add(1, 'month').format('MMMM YYYY');
        cy.get('.MuiPaper-root').should('exist').should('contain', next_month_MMMM_YYYY)

        cy.get('div[aria-rowindex="1"][role="row"]').first().within(() => {
            cy.get('button').first().should('not.be.disabled').click()
        })

        // need to escape the colon so cy treat it as part of ID rather than pseudo class 
        const start_date = dayjs().add(1, 'month').startOf('month').format('MM/DD/YYYY');
        cy.get('#\\:r1\\:').should('exist').should('have.value', start_date)
    });

    it('HAPPY PATH: number of guests and rooms', () => {
        cy.contains('Number of guests')
        cy.get('#\\:r9\\:').should('exist').should('have.value', '1')

        cy.get('button[aria-controls="\\:r9\\:"]').first().should('exist').should('be.disabled')
        cy.get('button[aria-controls="\\:r9\\:"]').last().should('exist').then(($button) => {
            for (let i = 0; i < 8; i++) {
                cy.wrap($button).click();

                if (i === 0) {
                    cy.get('#\\:r9\\:').should('exist').should('have.value', '2')
                }
            }
        })
        cy.get('button[aria-controls="\\:r9\\:"]').last().should('exist').should('be.disabled')
        cy.get('#\\:r9\\:').should('exist').should('have.value', '9')
    });

    it('HAPPY PATH: nummber of rooms', () => {
        cy.contains('Number of rooms')
        cy.get('#\\:rb\\:').should('exist').should('have.value', '1')

        cy.get('button[aria-controls="\\:rb\\:"]').first().should('exist').should('be.disabled')
        cy.get('button[aria-controls="\\:rb\\:"]').last().should('exist').then(($button) => {
            for (let i = 0; i < 8; i++) {
                cy.wrap($button).click();

                if (i === 0) {
                    cy.get('#\\:rb\\:').should('exist').should('have.value', '2')
                }
            }
        })
        cy.get('button[aria-controls="\\:rb\\:"]').last().should('exist').should('be.disabled')
        cy.get('#\\:rb\\:').should('exist').should('have.value', '9')
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

        const start_date = dayjs().add(1, 'month').startOf('month').format('MM/DD/YYYY');
        cy.get('#\\:r1\\:').should('exist').should('have.value', start_date)

        // fill end date 
        cy.get('[data-testid="endDatePicker"]').within(() => {
            cy.get('[aria-label="Choose date"]').should('exist').click()
        })
        cy.get('div[aria-rowindex="1"][role="row"]').first().within(() => {
            // end date = start date + 2 days 
            cy.get('button').eq(2).should('not.be.disabled').click()
        })

        const end_date = dayjs().add(1, 'month').startOf('month').add(2, 'days').format('MM/DD/YYYY')
        cy.get('#\\:r5\\:').should('exist').should('have.value', end_date)

        // take num guest and num rooms default value 

        cy.get('[data-testid="submitButtonID"]').click()

        // check successful navigation
        cy.url().should('include', '/searchhotel/RsBU')
        cy.contains('Hotel Search')
    });
})

describe('USE CASE: View hotel room detail', () => { 
    beforeEach(() => {
        complete_search_form()
    });
    
    
    it('HAPPY PATH: able to view hotel room', () => {
        const hotel_name = 'Wangz Hotel'
        select_first_hotel(hotel_name)
    });
})

describe('USE CASE: Book hotel room', () => { 
    const username = 'bbb'
    const password = 'bbbbbb'
    const hotel_name = 'Wangz Hotel'

    beforeEach(() => {
        login_user(username, password)
        complete_search_form()
        select_first_hotel(hotel_name)
    });
    
    it('HAPPY PATH: able to book hotel room', () => {
        // start test at hotel page eg page will show Wangz Hotel

        cy.get('.room-card').first().within(() => {
            cy.get('button').should('have.text', 'Book').click()
        })

        cy.url().should('include', '/booking')

        // fill booking form 
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Name is required')

        // name is required 
        cy.get('#name').should('exist').clear().type('aaa')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Card number is required')

        // card number required 
        cy.get('#cardNumber').should('exist').clear().type('1')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Card number must be 16 digits')

        cy.get('#cardNumber').should('exist').clear().type('123412341234123a')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Card number must be numeric')

        cy.get('#cardNumber').should('exist').clear().type('1234123412341234')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Expiry date is required')
        
        // expiry date required
        cy.get('#expiryDate').should('exist').clear().type('a')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Expiry date must be in MM/YY format')

        cy.get('#expiryDate').should('exist').clear().type('12/23')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Expiry date must be valid numbers in MM/YY format')

        cy.get('#expiryDate').should('exist').clear().type('12/24')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('Expiry date must be valid numbers in MM/YY format').should('not.exist');

        // CVV required 
        cy.get('#cvv').should('exist').clear().type('aaa')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('CVV must be numeric')
        
        cy.get('#cvv').should('exist').clear().type('0000')
        cy.contains('button.submit', 'Create Booking').should('exist').click()
        cy.contains('CVV number must be 3 digits')

        cy.get('#cvv').should('exist').clear().type('123')
        cy.contains('button.submit', 'Create Booking').should('exist').click()

        // check booking successful
        cy.url().should('include', '/displaybooking')
        cy.contains('My Bookings')
        cy.contains(hotel_name)
    });

    // it('SAD PATH: not logged in users cannot book', () => {
    //     cy.get('.room-card').first().within(() => {
    //         cy.get('button').should('have.text', 'Book').click()
    //     })

    //     cy.url().should('include', '/booking')

    //     // prevent booking when user not logged in 

    // });
})

describe('USE CASE: Delete booking', () => { 
    it('HAPPY PATH: able to delete booking', () => {
        
    });

    it('SAD PATH: cannot delete booking', () => {
        
    });
})

////////////////////////////////////////// Helper Functions //////////////////////////////////////////

// automated actions to complete location search form, meant to put in beforeEach 
function complete_search_form() {
    cy.visit("http://localhost:3000")

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

    const start_date = dayjs().add(1, 'month').startOf('month').format('MM/DD/YYYY');
    cy.get('#\\:r1\\:').should('exist').should('have.value', start_date)

    // fill end date 
    cy.get('[data-testid="endDatePicker"]').within(() => {
        cy.get('[aria-label="Choose date"]').should('exist').click()
    })
    cy.get('div[aria-rowindex="1"][role="row"]').first().within(() => {
        // end date = start date + 2 days 
        cy.get('button').eq(2).should('not.be.disabled').click()
    })

    const end_date = dayjs().add(1, 'month').startOf('month').add(2, 'days').format('MM/DD/YYYY')
    cy.get('#\\:r5\\:').should('exist').should('have.value', end_date)

    // take num guest and num rooms default value 

    cy.get('[data-testid="submitButtonID"]').click()

    // check successful navigation
    cy.url().should('include', '/searchhotel/RsBU')
    cy.contains('Hotel Search')

    cy.wait(2000) 
}

function select_first_hotel(hotel_name) {
    cy.get('.hotel-card').first().should('exist').within(() => {
        // click on calendar icon button 
        cy.contains(hotel_name)
        cy.get('button').should('have.text', 'Select').click()
    })

    // in hotel url 
    cy.contains(hotel_name)
    cy.wait(2000) 
}

function login_user(username, password) {
    cy.visit("http://localhost:3000/login")
    cy.get('#username').type(username)
    cy.get('#password').type(password)
    cy.contains('button', 'Login').should('be.visible').click()
    cy.url().should('include', '/profile')
    cy.contains(username)
    cy.visit("http://localhost:3000")
}