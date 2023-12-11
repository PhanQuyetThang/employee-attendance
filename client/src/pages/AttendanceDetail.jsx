import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment-timezone';

export default function AttendanceDetail() {
    const { currentUser } = useSelector(state => state.user);
    const [user, setUser] = useState([]);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const navigate = useNavigate();
    const userId = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/user/attendance-detail/${userId.id}`);
                const data = await response.json();

                if (!response.ok || data.success === false) {
                    console.error(data.message || 'User not found');
                    setError(data.message || 'User not found');
                    return;
                }

                setUser(data);
            } catch (error) {
                console.error(error);
                setError('Error fetching user data');
            }
        };

        const convertAttendanceToEvent = (attendanceItem) => {
            // Chuyển đổi thời gian sang múi giờ +7 (Asia/Ho_Chi_Minh)
            const convertedTime = moment.tz(attendanceItem.TimeIn, 'Asia/Ho_Chi_Minh').format();

            return {
                title: attendanceItem.status,
                start: convertedTime,
                // Các thuộc tính khác của sự kiện
            };
        };

        const fetchAttendanceData = async () => {
            try {
                const response = await fetch(`/api/user/get-attendance-info/${userId.id}`);
                const data = await response.json();

                if (response.ok) {
                    if (data.success !== false) {
                        // Chuyển đổi thời gian trong dữ liệu chấm công sang múi giờ +7
                        const attendanceDataWithTimeZone = data.map((item) => ({
                            ...item,
                            TimeIn: moment.tz(item.TimeIn, 'Asia/Ho_Chi_Minh').format(),
                        }));

                        setAttendanceData(attendanceDataWithTimeZone);

                        // Chuyển đổi dữ liệu chấm công thành sự kiện và cập nhật mảng sự kiện
                        const attendanceEvents = attendanceDataWithTimeZone.map(convertAttendanceToEvent);
                        setEvents(attendanceEvents);
                    } else {
                        console.error(data.message || 'Error fetching attendance data');
                        setError(data.message || 'Error fetching attendance data');
                    }
                } else {
                    console.error('Error fetching attendance data');
                    setError('Error fetching attendance data');
                }
            } catch (error) {
                console.error(error);
                setError('Error fetching attendance data');
            }
        };

        fetchUserData();
        fetchAttendanceData();
    }, [userId]);

    useEffect(() => {
        console.log(attendanceData);
    }, [attendanceData]);

    // Chuyển đổi thời gian trong mảng sự kiện
    const eventsWithTimeZone = events.map((event) => ({
        ...event,
        start: moment.tz(event.start, 'Asia/Ho_Chi_Minh').format(),
    }));

    // const dayHeaderContent = (arg) => {
    //     // Hiển thị thời gian trực tiếp trên ô lịch ngày
    //     const date = new Date(arg.date);
    //     const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    //     return `<span>${timeString}</span>`;
    // };

    const handleEventClick = (info) => {
        // Xử lý khi người dùng nhấp vào một sự kiện
        console.log('Event click', info.event);
        // Hiển thị thông tin chi tiết sự kiện (ví dụ: modal)
    };

    return (
        <Fragment>
            <div className="max-w-sm mx-auto mt-32 z-50"></div>
            <div className='w-1/6 float-left mt-2 ml-2 flex' >
                <button className="bg-gray-700 w-1/2 py-2 ml-20 shadow-xl rounded-lg text-white hover:bg-black duration-500" onClick={() => navigate('/manage')}>
                    Go Back
                </button>
            </div>
            <div className='w-2/3 float-left ml-2 mr-2'>
                <div className="flex flex-col">
                    <span>{attendanceData.status}</span>
                    <span>{attendanceData.TimeIn}</span>
                    <span>{attendanceData.BiometricMethod}</span>
                </div>

                <div className="max-w-screen-lg mx-auto mt-8">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={eventsWithTimeZone} // Sử dụng mảng đã chuyển đổi
                        eventClick={handleEventClick}
                        headerToolbar={{
                            start: 'today prev,next',
                            center: 'title',
                            end: 'dayGridMonth,timeGridWeek,timeGridDay',
                        }}
                        themeSystem="bootstrap"
                        buttonText={{
                            today: 'Today',
                            month: 'Month',
                            week: 'Week',
                            day: 'Day',
                            listWeek: 'List Week',
                            listMonth: 'List Month',
                            listYear: 'List Year',
                        }}
                        dayMaxEvents={true}
                        eventColor="#4caf50"
                        eventTextColor="#fff"
                        height="auto"
                        className="bg-white rounded-lg shadow-md p-4"
                    // dayHeaderContent={dayHeaderContent}
                    />
                </div>
            </div>
        </Fragment>
    );
}
