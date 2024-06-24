import React, { useState, useEffect } from "react";
import { DateRangePicker, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface MyCalendarProps {
    onDateChange: (events: Event[]) => void;
}

interface Event {
    startDate: Date;
    endDate: Date;
}

const MyCalendar: React.FC<MyCalendarProps> = ({ onDateChange }) => {
    const today = new Date();
    const [tentativeRange, setTentativeRange] = useState<{ startDate: Date, endDate: Date }>({ startDate: today, endDate: today });
    const [dateRanges, setDateRanges] = useState<{ startDate: Date, endDate: Date }[]>([]);
    const [selectedRange, setSelectedRange] = useState<{ startDate: Date, endDate: Date }>({ startDate: today, endDate: today });

    const handleSelectRange = (ranges: RangeKeyDict): void => {
        const selection = ranges.selection;
        if (selection && selection.startDate && selection.endDate) {
            if (selection.startDate < today) {
                alert("Geçerli bir tarih seçin. Geçmiş tarihler seçilemez.");
                return;
            }
            if (selection.endDate < selection.startDate) {
                alert("Bitiş tarihi başlangıç tarihinden daha eski olamaz.");
                return;
            }
            const newRange = {
                startDate: new Date(selection.startDate.getFullYear(), selection.startDate.getMonth(), selection.startDate.getDate()),
                endDate: new Date(selection.endDate.getFullYear(), selection.endDate.getMonth(), selection.endDate.getDate()),
            };
            setTentativeRange(newRange); // Set the tentative range
        }
    };

    const confirmDateRange = () => {
        setDateRanges(prev => [...prev, tentativeRange]);
        onDateChange([...dateRanges, tentativeRange]); // Update the parent component with the new range
        setSelectedRange(tentativeRange); // Highlight the selected range in the calendar
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // "YYYY-MM-DD" formatında
    };

    return (
        <div className="container">
            <DateRangePicker
                ranges={[{ ...tentativeRange, key: 'selection' }]}
                onChange={handleSelectRange}
                moveRangeOnFirstSelection={false}
                retainEndDateOnFirstSelection={false}
                editableDateInputs={true}
                months={1}
                direction="vertical"
                rangeColors={["#3d91ff"]}
                color="#3d91ff"
                showMonthAndYearPickers={true}
                minDate={today} // Set minimum date to today
            />
            <div style={{ marginTop: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <h3 style={{ marginBottom: '5px', fontSize: '16px' }}>Tarih Seçme</h3>
                </div>
                <input
                    type="date"
                    value={formatDate(tentativeRange.startDate)}
                    min={formatDate(today)}
                    onChange={(e) => setTentativeRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                />
                <input
                    type="date"
                    value={formatDate(tentativeRange.endDate)}
                    min={formatDate(tentativeRange.startDate)} // Ensure end date cannot be earlier than start date
                    onChange={(e) => setTentativeRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                />
                <button onClick={confirmDateRange}>
                    Tarih Aralığını Onayla
                </button>
            </div>
            <div className="eventContainer" style={{ marginTop: '20px' }}>
                <h3 style={{ marginBottom: '5px', fontSize: '16px' }}>Seçilen Tarih Aralıkları</h3>
                <ul>
                    {dateRanges.map((range, index) => (
                        <li key={index}>
                            <strong>Başlangıç Tarihi:</strong> {formatDate(range.startDate)}, <strong>Bitiş Tarihi:</strong> {formatDate(range.endDate)}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyCalendar;
