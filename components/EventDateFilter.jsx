import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

export default function EventDateFilter({ eventsData, setFilteredEventsData, minDateNow = false }) {

    const [date1, setDate1] = useState(dayjs())
    const [date2, setDate2] = useState(dayjs().add(1, 'year'))

    useMemo(() => setFilteredEventsData(eventsData.filter(({ date, endDate }) => {
        const startTime = dayjs(date)
        const endTime = dayjs(endDate)

        const startRange = (minDateNow && (date1.startOf('day').format() === dayjs().startOf('day').format())) ? date1 : date1.startOf('day')
        const endRange = date2.endOf('day')

        return endTime > startRange && startTime <= endRange
    })), [date1, date2])

    return (
        <Paper sx={{ p: 3, mt: 3, transition: 'background 0.2s' }}>
            <Stack direction='row' flexWrap='wrap'>
                <Stack direction='row' alignItems='center' spacing={3}>
                    <Typography variant="h5" component='p'>
                        Which dates?
                    </Typography>
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={date1}
                        minDate={minDateNow ? dayjs(new Date()) : undefined}
                        onChange={(value) => {
                            setDate1(value)
                            if (value > date2) setDate2(value)
                        }}
                        label='Between this date' />
                    <DatePicker
                        format="DD/MM/YYYY"
                        value={date2}
                        minDate={date1}
                        onChange={(value) => setDate2(value)}
                        label='and this date' />
                </Stack>
            </Stack>
        </Paper>
    )
}
