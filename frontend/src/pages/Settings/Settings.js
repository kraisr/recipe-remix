import React, { useState } from 'react';
import './settings.css';

const Settings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [areRemindersEnabled, setRemindersEnabled] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [reminderTime, setReminderTime] = useState('0:00');

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleReminders = () => {
        setRemindersEnabled(!areRemindersEnabled);
    };

    const handleEmailChange = (event) => {
        setEmailValue(event.target.value);
    };

    const handleReminderTimeChange = (event) => {
        setReminderTime(event.target.value);
    };

    const handleSaveSettings = () => {
        // Handle saving settings here
    };

    const handleCancelButtonClick = () => {
        // Handle the click event for the Cancel button here
    };

    const modeClass = isDarkMode ? 'dark-mode' : 'light-mode';

    return (
        <div className={`settings ${modeClass}`}>
            {/* Dark Mode Toggle */}
            <div className="toggle-container">
                <h2 style={{ fontSize: '18px' }}>Toggle between light / dark mode</h2>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Reminders Toggle */}
            <div className="toggle-container">
                <h2 style={{ fontSize: '18px' }}>Set Reminder</h2>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={areRemindersEnabled}
                        onChange={toggleReminders}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Email Input */}
            {areRemindersEnabled && (
                <div className="email-input-container">
                    <div className="input-title">
                        <h2 style={{ fontSize: '16px' }}>Email</h2>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            placeholder="Enter your email"
                            value={emailValue}
                            onChange={handleEmailChange}
                        />
                    </div>
                </div>
            )}

            {/* Everyday at [] */}
            {areRemindersEnabled && (
                <div className="everyday-at-container">
                    <div className="input-title">
                        <h2 style={{ fontSize: '16px' }}>Everyday at</h2>
                    </div>
                    <div className="input-field">
                        <select
                            value={reminderTime}
                            onChange={handleReminderTimeChange}
                        >
                            {/* Options for every 30 minutes */}
                            {Array.from({ length: 48 }, (_, index) => (
                                <option key={index} value={`${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`}>
                                    {`${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-title">
                        <h2 style={{ fontSize: '16px' }}>Or Every</h2>
                    </div>
                    <div className="input-field">
                        <select
                            value={reminderTime}
                            onChange={handleReminderTimeChange}
                        >
                            {/* Options for every 1 to 24 hours */}
                            {Array.from({ length: 24 }, (_, index) => (
                                <option key={index} value={`${index + 1}`}>
                                    {`${index + 1} hours`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Button Container */}
            {areRemindersEnabled && (
                <div className="save-button-container">
                    <button className="cancel-button" onClick={handleCancelButtonClick}>
                        Cancel
                    </button>
                    <button className="save-button" onClick={handleSaveSettings}>
                        Save
                    </button>
                </div>
            )}
        </div>
    );
};

export default Settings;
