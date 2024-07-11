import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function SearchDatePicker() {
    let value;
    let newValue;
    let setValue;
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker value={value} onChange={(newValue) => setValue(newValue)} />
            </DemoContainer>
        </LocalizationProvider>
    )
}

export default SearchDatePicker