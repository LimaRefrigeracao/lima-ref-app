<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import ptLocale from '@fullcalendar/core/locales/pt-br';

const handleDateClick = () => {
    var dateStr = prompt('Enter a date in YYYY-MM-DD format');
    var date = new Date(dateStr + 'T00:00:00'); // will be in local time

    if (!isNaN(date.valueOf())) {
        // valid?
        calendarOptions.addEvent({
            title: 'dynamic event',
            start: date,
            allDay: true
        });
        alert('Great. Now, update your database...');
    } else {
        alert('Invalid date.');
    }
};

const calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridDay',
    dateClick: handleDateClick,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridDay'
    },
    locale: ptLocale,
    editable: true,
    droppable: true,
    events: [
        {
            title: 'Conference',
            start: '2024-01-12T10:00:00',
            end: '2024-01-12T11:00:00'
        }
    ]
};
</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <FullCalendar :options="calendarOptions" />
            </div>
        </div>
    </div>
</template>
