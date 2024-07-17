import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import dayjs from 'dayjs';

// one part of date picker 
export default function SearchDatePicker({onChange, value, minDate, maxDate}) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker value={value} minDate={minDate} maxDate={maxDate} onChange={(newValue) => onChange(newValue)}/>
            </DemoContainer>
        </LocalizationProvider>
    )
}
