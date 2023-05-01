import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export default function EventDateFilter({ eventsData, setFilteredEventsData }) {

    const today = new Date()

    const [date1, setDate1] = useState(dayjs(today))
    const [date2, setDate2] = useState(dayjs(today.setFullYear(today.getFullYear() + 1)))

    useMemo(() => setFilteredEventsData(
        eventsData.filter(({ date }) => {
            const time = new Date(date).getTime();
            const startTime = new Date(date1.format()).getTime()
            const endTime = new Date(date2.format()).getTime() + 1000 * 60 * 60 * 24    // + 24Hrs for inclusive filter
            return time >= startTime && time <= endTime;
        })
    ), [date1, date2])

    return (
        <Paper sx={{ p: 3, mt: 3, transition: 'background 0.2s' }}>
            <Stack direction='row' flexWrap='wrap'>
                <Stack direction='row' alignItems='center' spacing={3}>
                    <Typography variant="h5" component='p'>
                        Which dates?
                    </Typography>
                    <DatePicker
                        value={date1}
                        onChange={(value) => setDate1(value)}
                        label='Between this date' />
                    <DatePicker
                        value={date2}
                        minDate={date1}
                        onChange={(value) => setDate2(value)}
                        label='and this date' />
                </Stack>
            </Stack>
        </Paper>
    )
}
