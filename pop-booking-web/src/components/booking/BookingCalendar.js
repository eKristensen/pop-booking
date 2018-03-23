import React from 'react';
//misc
//components
//controllers
import BookingController from '../../controllers/BookingController';
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {extendObservable, transaction} from 'mobx';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CreateBooking from "./CreateBooking";
import StoreRegistry from "../../controllers/StoreRegistry";
import EditBooking from "./EditBooking";
import LanguageStore, {D} from "../../controllers/LanguageStore";
import SecurityStore from "../../controllers/SecurityStore";
import {toast} from 'react-toastify';
import {Glyphicon} from "react-bootstrap";
import FloatingBtn from "../shared/FloatingBtn";


BigCalendar.momentLocalizer(moment);


class BookingCalendar extends React.Component {

    views = {
        MONTH: 'month',
        WEEK: 'week',
        DAY: 'day'
    }
    modals = {
        EDIT_BOOKING: 'editBooking',
        CREATE_BOOKING: 'createBooking'
    }
    currentDate;
    selectedStartDate;
    selectedEndDate;

    currentModal;
    currentBooking;

    currentView;

    constructor(myProps) {
        super();
        extendObservable(this, {
            currentDate: new Date(),
            selectedStartDate: new Date(),
            selectedEndDate: new Date(),
            currentModal: null,
            currentBooking: null,
            currentView: this.views.MONTH
        })
    }

    onNavigate = (date, view, action) => {
        this.currentDate = date;
    }

    onView = (view) => {
        this.currentView = view;
    }

    onSelectSlot = (selection) => {
        if(selection.action === 'click' && this.currentView !== this.views.DAY){
            transaction(() => {
                this.currentDate = selection.start;
                this.currentView = this.views.DAY;
            });
            return;
        }
        if (!SecurityStore.isLoggedIn) {
            toast.info(LanguageStore.INFO_BOOKING_CREATE_LOGIN_REQUIRED);
            return;
        }
        //action, start, end, slots(array of dates)
        transaction(() => {
            this.selectedStartDate = selection.start;
            this.selectedEndDate = selection.end;
            this.currentModal = this.modals.CREATE_BOOKING;
        });
    }

    onSelectEvent = (booking, evt) => {
        if (!SecurityStore.isLoggedIn) {
            toast.info(LanguageStore.INFO_BOOKING_UPDATE_LOGIN_REQUIRED);
            return;
        }
        if (SecurityStore.user.id !== booking.booker.id) {
            toast.info(LanguageStore.INFO_BOOKING_OWNED_BY_OTHER_USER);
            return;
        }
        this.currentBooking = booking;
        this.currentModal = this.modals.EDIT_BOOKING;
    }

    onSelecting = ({start, end}) => {
        console.log(start + " - " + end);
        /*
        if(!SecurityStore.isLoggedIn)
        transaction(() => {
            this.selectedStartDate = start;
            this.selectedEndDate = end;
            this.currentModal = this.modals.CREATE_BOOKING;
        });*/
        return true;
    }

    timeFormat = (date, culture, localizer) => {
        return localizer.format(date, 'HH:mm');
    }

    timeRangeFormat = ({start, end}, culture, localizer) => {
        return this.timeFormat(start, culture, localizer) + ' - ' + this.timeFormat(end, culture, localizer);
    }

    dateFormat = (date, culture, localizer) => {
        return localizer.format(date, "DD. MMMM YYYY");
    }

    dateRangeFormat = ({start, end}, culture, localizer) => {
        return this.dateFormat(start, culture, localizer) + ' - ' + this.dateFormat(end, culture, localizer);
    }

    dayFormat = (date, culture, localizer) => {
        return '';
        //return localizer.format(date, 'DDD', culture);
    }

    eventPropGetter = (event, start, end, isSelected) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: '0px',
                /* opacity: 0.8,*/
                color: 'black',
                border: '1px solid black',
                borderColor: 'rgba(0,0,0,0.2)',
                display: 'block'
            }
        };

    }

    render() {
        const {bookings} = this.props.bookingStore;
        const {isLoggedIn} = SecurityStore;
        const { language} = LanguageStore;
        const messages = {
            allDay: D('All day'),
            previous: <Glyphicon glyph='chevron-left' />,
            next: <Glyphicon glyph='chevron-right' />,
            today: <Glyphicon glyph='screenshot'/>,
            month: D('Month'),
            week: D('Week'),
            day: D('Day'),
            agenda: D('Agenda'),
            date: D('Date'),
            time: D('Time'),
            event: D('Event'),
            showMore: (num) => {
                return D('Show more') + " +" + num;
            }
        }
        return (

            <div style={{height: 'calc(100vh - 100px)'}}>
                {(this.currentModal === this.modals.CREATE_BOOKING) &&
                <CreateBooking bookableItemStore={StoreRegistry.getBookableItemStore()}
                               defaultFrom={this.selectedStartDate} defaultTo={this.selectedEndDate}
                               onExit={() => this.currentModal = null}/>}
                {(this.currentModal === this.modals.EDIT_BOOKING) &&
                <EditBooking bookableItemStore={StoreRegistry.getBookableItemStore()}
                             booking={this.currentBooking}
                             onExit={() => this.currentModal = null}/>}

                <BigCalendar
                    onView={this.onView}
                    view={this.currentView}
                    messages={messages}
                    date={this.currentDate}
                    formats={{
                        dateFormat: 'DD',
                        timeGutterFormat: this.timeFormat,
                        selectRangeFormat: this.timeRangeFormat,
                        dayFormat: this.dayFormat,
                        dayRangeHeaderFormat: this.dateRangeFormat,
                        eventTimeRangeFormat: this.timeRangeFormat,
                        eventTimeRangeStartFormat: this.timeFormat,
                        eventTimeRangeEndFormat: this.timeFormat

                    }}
                    culture={language}
                    popup={true}
                    events={bookings.toJSON()}
                    onNavigate={this.onNavigate}
                    onSelectSlot={this.onSelectSlot}
                    onSelectEvent={this.onSelectEvent}
                    onSelecting={this.onSelecting}
                    views={['month', 'day']}
                    selectable={true}
                    step={30}
                    min={new Date(0, 1, 1, 10)}
                    max={new Date(0, 1, 1, 22)}

                    eventPropGetter={this.eventPropGetter}
                />
                {isLoggedIn && <FloatingBtn onClick={() => this.currentModal = this.modals.CREATE_BOOKING}/>}
            </div>

        );
    }
}

/*startAccessor='startDate'
endAccessor='endDate'*/
export default observer(BookingCalendar);

BookingCalendar.propTypes = {
    bookingStore: PropTypes.instanceOf(BookingController)
}

const Event = ({event}) => {
    //debugger;
    return (
        <span style={{backgroundColor: 'red'}}>
      <strong>{event.title}</strong>
            {event.desc && ':  ' + event.desc}
    </span>
    )
}

/*
view: 'month',
  events: [],
  selectable: true,
  header: {
    left: 'agendaDay,basicWeek,month',
    center: 'title',
    right: 'today prev,next',
  },
  customButtons: {},
  defaultDate: null,
  nowIndicator: true,
  locale: 'en-gb',
  eventStartEditable: true,
  eventDurationEditable: true,
 */

// Data Types: 	event - {title, id, start, (end), whatever } 	location - {
// start, (end), allDay } 	rawEventRange - { start, end } 	eventRange - { start,
// end, isStart, isEnd } 	eventSpan - { start, end, isStart, isEnd, whatever }
// 	eventSeg - { event, whatever } 	seg - { whatever }