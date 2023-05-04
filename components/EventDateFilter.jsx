import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export default function EventDateFilter({ eventsData, setFilteredEventsData, minDateNow = false }) {

    const today = new Date()

    const [date1, setDate1] = useState(dayjs(today))
    const [date2, setDate2] = useState(dayjs(today.setFullYear(today.getFullYear() + 1)))

    useMemo(() => setFilteredEventsData(
        eventsData.filter(({ date, endDate }) => {
            const currentTime = dayjs(today)
            const startTime = dayjs(date)
            const endTime = dayjs(endDate)
            const startRange = date1.set('hour', currentTime.hour()).set('minute', currentTime.minute())
            const endRange = date2.set('hour', 23).set('minute', 59)
            return endTime > startRange && startTime <= endRange
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
                        minDate={minDateNow ? dayjs(new Date()) : undefined}
                        onChange={(value) => {
                            setDate1(value)
                            if (value > date2) setDate2(value)
                        }}
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
