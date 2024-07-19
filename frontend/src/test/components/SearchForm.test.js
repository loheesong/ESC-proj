import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import SearchDestForm from '../../components/SearchForm/SearchDestForm';
import { BrowserRouter as Router } from 'react-router-dom';

// mock useNavigate to prevent errors while testing 
const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUsedNavigate,
}));

// mock axios 
jest.mock('axios')

// define test id for testing 
const SEARCH_BAR_ID = "searchbar"
const LOCATION_ERROR_ID = "locationError"
const START_DATE_ID = "startDatePicker"
const END_DATE_ID = "endDatePicker"
const DATE_ERROR_ID = "dateError"
const NUM_GUESTS_ID = "numGuests"
const NUM_ROOMS_ID = "numRooms"

describe('tests for searchbar', () => { 
    test('should first', () => { 
        render(<SearchDestForm/>)

        // find all components 
        const searchbar = screen.getByTestId(SEARCH_BAR_ID)
        
        // error elements 
        // const locationError = screen.getByTestId('locationError')
        // const dateError = screen.getByTestId('dateError')

        // fireEvent.change(searchbar, { target: { value: 'New York' } });
    })
})

// describe('tests for startDate endDate pickers', () => { 
//     beforeEach(() => {
        
//     });

//     test('should first', async () => { 
//         render(<SearchDestForm/>)

//         const startDatePicker = screen.getByTestId(START_DATE_ID).querySelector('input')
//         const endDatePicker = screen.getByTestId(END_DATE_ID).querySelector('input')
        
//         // this shit dont work 
//         fireEvent.mouseDown(startDatePicker);

//         await waitFor(() => screen.getByRole('dialog'));

//         const dateToSelect = screen.getByRole('option', { name: '25' });
//         fireEvent.click(dateToSelect);

//         // fireEvent.change(startDatePicker, { target: { value: '2024-07-20' } });
//         // expect(startDatePicker.value).toBe('2024-07-20');
//         // const a = startDatePicker.value
//         // console.log("aaaa"+a);
//     })  
// })

describe('tests for numGuests and numRooms number input', () => { 
    let numGuests
    let numGuestsInput
    let incrementButton
    let decrementButton
    
    beforeEach(() => {
        render(<SearchDestForm/>)

        // find numGuests component and inputs and buttons 
        numGuests = screen.getByTestId(NUM_GUESTS_ID)
        numGuestsInput = numGuests.querySelector('input')
        incrementButton = numGuests.querySelector('.increment')
        decrementButton = numGuests.querySelector('.decrement')
    });

    test('no input, default value should be 1', () => { 
        expect(numGuestsInput.value).toBe("1");
    })  

    test('click + when number is 1, number increments to 2', () => { 
        fireEvent.click(incrementButton)
        expect(numGuestsInput.value).toBe("2");
    })  

    test('click - when number is 2, number decrements to 1', () => { 
        fireEvent.click(incrementButton)
        fireEvent.click(decrementButton)
        expect(numGuestsInput.value).toBe("1");
    }) 

    test('spam click +, number remains at 9', () => { 
        for (let i = 1; i <= 10; i++) {
            fireEvent.click(incrementButton)
        }
        expect(numGuestsInput.value).toBe("9")
    })  

    test('spam click -, number remains at 1', () => { 
        for (let i = 1; i <= 10; i++) {
            fireEvent.click(decrementButton)
        }
        expect(numGuestsInput.value).toBe("1")
    })  
})