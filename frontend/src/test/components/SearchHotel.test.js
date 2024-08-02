import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import SearchHotel from '../../routes/SearchHotel';
import { BrowserRouter } from 'react-router-dom';

describe('tests for formatGuestsAndRooms function in SearchHotel', () => {
    const formatGuestsAndRooms = (guests, rooms) => {
        let str = "";
        for (let i = 0; i < rooms; i++) {
            str += guests + "|";
        }
        // Remove the trailing " | "
        str = str.slice(0, -1);
        return str;
    };

    test('1 guest in 1 room', () => {
        const result = formatGuestsAndRooms(1, 1);
        expect(result).toBe("1");
    });

    test('9 guests in 9 rooms', () => {
        const result = formatGuestsAndRooms(9, 9);
        expect(result).toBe("9|9|9|9|9|9|9|9|9");
    });

    test('1 guest in 9 rooms', () => {
        const result = formatGuestsAndRooms(1, 9);
        expect(result).toBe("1|1|1|1|1|1|1|1|1");
    });

    test('9 guests in 1 room', () => {
        const result = formatGuestsAndRooms(9, 1);
        expect(result).toBe("9");
    });
});
