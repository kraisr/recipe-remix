import React, { useState, useEffect } from 'react';
import './settings.css';
import '../../index.css';

const Settings = () => {
    const [reminder, setReminder] = useState(false);
    const [preferenceEmail, setPreferenceEmail] = useState('');
    const [reminderTime, setReminderTime] = useState('');
    const [emailError, setEmailError] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [mode, setMode] = useState(false); // Initially set to dark mode (false)

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch("http://localhost:8080/user/user", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setUserEmail(data.email);
                setMode(data.mode); // Assuming 'mode' is the key for light/dark mode in the response

                if (data.mode) {
                    const rootElement = document.getElementById('root');

                    if (!rootElement.classList.contains('dark-mode')) {
                        rootElement.classList.remove('light-mode');
                        rootElement.classList.add('dark-mode');
                      }  
                } else {
                    const rootElement = document.getElementById('root');

                    if (!rootElement.classList.contains('light-mode')) {
                        rootElement.classList.remove('dark-mode');
                        rootElement.classList.add('light-mode');
                      }     
                }

                setReminder(data.reminder); // Assuming 'reminder' is the key for the reminder setting

                setPreferenceEmail(data.reminderSetting.email); // Set preferenceEmail from the response
                if (data.reminderSetting.everydayAt.bool) {
                    // Everyday at is true, set the time for everydayAt
                    setReminderTime(data.reminderSetting.everydayAt.time);
                } else {
                    // Everyday at is false, set the time for everyHour
                    setReminderTime(data.reminderSetting.everyHour.time);
                }

                console.log('email is ', data.email);
                console.log('mode is ', data.mode);
                console.log('reminder is ', data.reminder);
                console.log('data.reminderSetting.everydayAt is ', data.reminderSetting.everydayAt);
                console.log('data.reminderSetting.everyHour is ', data.reminderSetting.everyHour);
                console.log('data.reminderSetting.everydayAt.time is ', data.reminderSetting.everydayAt.time);
                console.log('data.reminderSetting.everyHour.time is ', data.reminderSetting.everyHour.time);

            } catch (error) {
                console.error('Error fetching user settings:', error);
            }
        };

        fetchUserSettings();
    }, []);

    const toggleDarkMode = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            // Toggle the current mode (true for light mode, false for dark mode)
            const updatedMode = !mode;

            const response = await fetch("http://localhost:8080/set/mode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    mode: updatedMode,
                }),
            });

            if (response.ok) {
                setMode(updatedMode);

                if (updatedMode) {
                    const rootElement = document.getElementById('root');

                    if (!rootElement.classList.contains('dark-mode')) {
                        rootElement.classList.remove('light-mode');
                        rootElement.classList.add('dark-mode');
                      }  
                } else {
                    const rootElement = document.getElementById('root');

                    if (!rootElement.classList.contains('light-mode')) {
                        rootElement.classList.remove('dark-mode');
                        rootElement.classList.add('light-mode');
                      }     
                }
                console.log(`Updated mode successfully.`, updatedMode);
            } else {
                console.error(`Failed to update mode.`);
            }
        } catch (error) {
            console.error('Error updating mode:', error);
        }
    };

    const toggleReminder = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            // Toggle the current mode (true for light mode, false for dark mode)
            const updatedReminder = !reminder;

            const response = await fetch("http://localhost:8080/set/reminder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    reminder: updatedReminder,
                }),
            });

            if (response.ok) {
                setReminder(updatedReminder);
                console.log(`Updated reminder successfully.`, updatedReminder);
            } else {
                console.error(`Failed to update reminder.`);
            }
        } catch (error) {
            console.error('Error updating reminder:', error);
        }
    };

    const handleEmailChange = (event) => {
        setPreferenceEmail(event.target.value);
        setEmailError(''); // Clear any previous error message when the email input changes
    };

    const handleReminderTimeChange = (event) => {
        setReminderTime(event.target.value);
    };

    const validateEmail = (email) => {
        // Basic email format validation using a regular expression
        const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        return emailRegex.test(email);
    };

    const handleSaveSettings = async () => {
        if (reminder) {
            if (!validateEmail(preferenceEmail)) {
                setEmailError('Incorrect Email Format');
                return; // Do not proceed if email format is incorrect
            }

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                // Determine whether "Everyday at" or "Every [] hours" was selected
                const isEverydayAt = reminderTime.includes(':'); // Check if reminderTime contains ':'
                const isEveryHour = !isEverydayAt;

                const response = await fetch("http://localhost:8080/set/reminderSetting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        preferenceEmail: preferenceEmail, // Save preferenceEmail
                        everydayAt: isEverydayAt, // Set to true if "Everyday at" was selected
                        everyHour: isEveryHour,   // Set to true if "Every [] hours" was selected
                        everydayAtTime: isEverydayAt ? reminderTime : '', // Set time if "Everyday at" was selected, otherwise ''
                        everyHourTime: isEveryHour ? reminderTime : '',     // Set time if "Every [] hours" was selected, otherwise ''
                    }),
                });

                if (response.ok) {
                    setReminder(true); // Assuming you want to set reminder to true after saving
                    console.log(`Updated reminderSetting successfully.`);
                } else {
                    console.error(`Failed to update reminderSetting.`);
                }
            } catch (error) {
                console.error('Error updating reminderSetting:', error);
            }
        }
    };

    const handleCancelButtonClick = () => {
        // Handle the click event for the Cancel button here
    };

    const modeClass = mode ? 'light-mode' : 'dark-mode'; // Check if mode is true (light mode)

    return (
        <div className={`settings ${modeClass}`}>
        {/* Dark Mode Toggle */}
            <div className="toggle-container">
                <h2 style={{ fontSize: '18px' }}>Toggle between light / dark mode</h2>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={mode} // Use 'mode' state to determine the checkbox state
                        onChange={toggleDarkMode}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Reminder Toggle */}
            <div className="toggle-container">
                <h2 style={{ fontSize: '18px' }}>Set Reminder</h2>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={reminder}
                        onChange={toggleReminder}
                    />
                    <span className="slider"></span>
                </label>
            </div>

            {/* Email Input */}
            {reminder && (
                <div className="email-input-container">
                    <div className="input-title">
                        <h2 style={{ fontSize: '16px' }}>Email</h2>
                    </div>
                    <div className="input-field">
                        <input
                            type="text"
                            placeholder="Enter your email"
                            value={preferenceEmail}
                            onChange={handleEmailChange}
                        />
                    </div>
                </div>
            )}

            {/* Error Message */}
            {reminder && emailError && (
                <div className="error-message">
                    <p style={{ color: 'red' }}>{emailError}</p>
                </div>
            )}

            {/* Everyday at [] */}
            {reminder && (
                <div className="everyday-at-container">
                    <div className="input-title">
                        <h2 style={{ fontSize: '16px' }}>Everyday at</h2>
                    </div>
                    <div className="input-field">
                        <select
                            value={reminderTime}
                            onChange={handleReminderTimeChange}
                        >
                            {/* Add the default option */}
                            <option value="">Select an option</option>
                            {/* Options for every 30 minutes */}
                            {Array.from({ length: 48 }, (_, index) => (
                                <option key={index} value={`${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`}>
                                    {`${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 === 0 ? '00' : '30'}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-title">
                        <h2 style={{ fontSize: '16px' }}>or Every</h2> {/* Updated title */}
                    </div>
                    <div className="input-field">
                        <select
                            value={reminderTime}
                            onChange={handleReminderTimeChange}
                        >
                            {/* Add the default option */}
                            <option value="">Select an option</option>
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
            {reminder && (
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
