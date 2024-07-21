import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import dayjs from 'dayjs';

export default function SearchDatePicker({onChange, value, minDate, maxDate, 'data-testid': testID}) {
    return (
        <div data-testid={testID}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker 
                        value={value} 
                        minDate={minDate} 
                        maxDate={maxDate} 
                        onChange={(newValue) => onChange(newValue)} />
                </DemoContainer>
            </LocalizationProvider>
        </div>
    )
}
