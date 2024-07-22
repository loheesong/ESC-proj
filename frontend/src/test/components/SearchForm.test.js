import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'
import SearchDestForm from '../../components/SearchForm/SearchDestForm';
import { BrowserRouter as Router } from 'react-router-dom';
import dayjs from 'dayjs';
import { act } from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// mock useNavigate to prevent errors while testing 
const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUsedNavigate,
}));

// mock axios 
const mock = new MockAdapter(axios);

// define test id for testing 
const SEARCH_BAR_ID = "searchbar"
const LOCATION_ERROR_ID = "locationError"
const START_DATE_ID = "startDatePicker"
const END_DATE_ID = "endDatePicker"
const DATE_ERROR_ID = "dateError"
const NUM_GUESTS_ID = "numGuests"
const NUM_ROOMS_ID = "numRooms"
const SUBMIT_BTN_ID = "submitButtonID"
const RESULTS_LIST = "results-list"

describe('tests for searchbar', () => { 
    let searchBar 

    beforeEach(() => {
        mock.resetHandlers();
        mock.onGet(/api\/autocomplete\?q=.*/).reply(config => {
            const query = new URLSearchParams(config.url.split('?')[1]).get('q');
            console.log("asdasdasdasd"+query);
            if (query === 'singapore') {
                return [200, [
                    {"term":"Singapore, Singapore","uid":"RsBU"},
                    {"term":"Sentosa, Singapore","uid":"3W9U"},
                    {"term":"Kallang, Singapore, Singapore","uid":"YD2Z"},
                    {"term":"Outram, Singapore, Singapore","uid":"LF74"},
                    {"term":"Colonial District, Singapore, Singapore","uid":"8V8Y"}
                ]];
            } else if (query === 'adsfasdfasdfadsfasdfads') {
                return [200, []];
            } else {
                return [200, []]; // Return empty array for other queries
            }
        });

        render(<SearchDestForm />);
        searchBar = screen.getByTestId(SEARCH_BAR_ID);
    });

    test('search bar on page', () => {         
        expect(searchBar).toBeInTheDocument()
    })

    test('autocomplete shows suggestions', async () => { 
        fireEvent.change(screen.getByTestId(SEARCH_BAR_ID), { target: { value: 'singapore' }})

        await waitFor(() => {
            expect(screen.getByText('Singapore, Singapore')).toBeInTheDocument();
            expect(screen.getByText('Sentosa, Singapore')).toBeInTheDocument();
            expect(screen.getByText("Kallang, Singapore, Singapore")).toBeInTheDocument();
            expect(screen.getByText("Outram, Singapore, Singapore")).toBeInTheDocument();
            expect(screen.getByText("Colonial District, Singapore, Singapore")).toBeInTheDocument();
        });
    })

    test('autocomplete doenst show sugestions when enter rubbish', async () => { 
        fireEvent.change(screen.getByTestId(SEARCH_BAR_ID), { target: { value: 'adsfasdfasdfadsfasdfads' }})

        await waitFor(() => {
            const resultsList = screen.getByTestId(RESULTS_LIST);
            expect(resultsList).toBeInTheDocument();
            expect(resultsList.children.length).toBe(0); // Check that it has no children
        });
    })
})

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