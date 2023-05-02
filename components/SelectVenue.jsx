import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

export default function SelectVenue({ options, label, setVenue, venue }) {
    return (
        <Autocomplete
            sx={{ width: '100%' }}
            noOptionsText='You own no venues'
            options={options}
            getOptionLabel={(option) => option[label]}
            renderInput={(params) => (
                <TextField {...params} label="Search venue" />
            )}
            onChange={(event, value) => {
                setVenue(value)
            }}
            value={venue}
            renderOption={(props, option, { inputValue }) => {
                const matches = match(option[label], inputValue, { insideWords: true });
                const parts = parse(option[label], matches);

                return (
                    <li {...props}>
                        <div>
                            {parts.map((part, index) => (
                                <span
                                    key={index}
                                    style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                    }}
                                >
                                    {part.text}
                                </span>
                            ))}
                        </div>
                    </li>
                );
            }}
        />
    );
}