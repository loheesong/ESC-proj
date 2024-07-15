import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
import dayjs from 'dayjs';

export default function SearchDatePicker({onChange}) {
    const today = dayjs();
    const [value, setValue] = useState(null);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker value={value} minDate={today} onChange={(newValue) => {
                    setValue(newValue)
                    console.log(newValue.$d)
                    onChange(newValue.$d)
                    }} />
            </DemoContainer>
        </LocalizationProvider>
    )
}
