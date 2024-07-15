import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom'

// import component instead of defining it here 
function Todo() {
    return (
        <div data-testid='hello'><p>hello</p></div>
    )
}

/**
describe breaks test suite into components 
it or test is where you perform individual tests 
*/

describe('Unit test for SearchForm components', () => { 
    test('should first', () => { 
        render(<Todo/>)
        const a = screen.getByTestId('hello')
        expect(a).toBeInTheDocument()
    })

    it('should second', () => { 
        expect(true).toBe(true)
    })
})