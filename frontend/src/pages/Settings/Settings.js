import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button, FormControlLabel, Switch, Select, MenuItem, InputLabel, FormControl, Box, Typography } from "@mui/material";
import * as yup from "yup";
import "./settings.css";
import "../../index.css";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../../state";


const Settings = () => {
    const [reminder, setReminder] = useState(false);
    const [preferenceEmail, setPreferenceEmail] = useState("");
    const [reminderTime, setReminderTime] = useState("");
    const [emailError, setEmailError] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [mode, setMode] = useState(false); // Initially set to dark mode (false)
    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const isValidEmail = (email) => {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        return emailRegex.test(email);
    };

    /* Validation of input in the login form */
    const loginSchema = yup.object().shape({
        email: yup.string().email("Invalid email address").required("Email is required"),
    });

    const settingsSchema = yup.object().shape({
        email: yup.string().email("Invalid email address").required("Please enter a valid email"),
        reminderTime: yup.string().required("Reminder time is required"),
    });
    const [FAState, setFAState] = useState(false);

    const initialValues = {
        preferenceEmail: "",
        reminderTime: "",
    };

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch("http://localhost:8080/user/user", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setUserEmail(data.email);
                setMode(data.mode); // Assuming "mode" is the key for light/dark mode in the response

                if (data.mode) {
                    const rootElement = document.getElementById("root");

                    if (!rootElement.classList.contains("dark-mode")) {
                        rootElement.classList.remove("light-mode");
                        rootElement.classList.add("dark-mode");
                    }
                } else {
                    const rootElement = document.getElementById("root");

                    if (!rootElement.classList.contains("light-mode")) {
                        rootElement.classList.remove("dark-mode");
                        rootElement.classList.add("light-mode");
                    }
                }

                setReminder(data.reminder); // Assuming "reminder" is the key for the reminder setting

                setPreferenceEmail(data.reminderSetting.email); // Set preferenceEmail from the response


                setReminderTime(data.reminderSetting.everydayAt.time);

                //set 2FA state
                setFAState(data.set2FA);

                console.log("email is ", data.email);
                console.log("data.reminderSetting.email is ", data.reminderSetting.email);
                console.log("mode is ", data.mode);
                console.log("reminder is ", data.reminder);
                console.log("data.reminderSetting.everydayAt is ", data.reminderSetting.everydayAt);
                console.log("data.reminderSetting.everyHour is ", data.reminderSetting.everyHour);
                console.log("data.reminderSetting.everydayAt.time is ", data.reminderSetting.everydayAt.time);
                console.log("data.reminderSetting.everyHour.time is ", data.reminderSetting.everyHour.time);

            } catch (error) {
                console.error("Error fetching user settings:", error);
            }
        };

        fetchUserSettings();
    }, []);

    const toggleDarkMode = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            // Toggle the current mode (true for light mode, false for dark mode)
            const updatedMode = !mode;

            const response = await fetch("http://localhost:8080/user/mode", {
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
                    const rootElement = document.getElementById("root");

                    if (!rootElement.classList.contains("dark-mode")) {
                        rootElement.classList.remove("light-mode");
                        rootElement.classList.add("dark-mode");
                    }
                } else {
                    const rootElement = document.getElementById("root");

                    if (!rootElement.classList.contains("light-mode")) {
                        rootElement.classList.remove("dark-mode");
                        rootElement.classList.add("light-mode");
                    }
                }
                console.log(`Updated mode successfully.`, updatedMode);
            } else {
                console.error(`Failed to update mode.`);
            }
        } catch (error) {
            console.error("Error updating mode:", error);
        }
    };

    const toggleReminder = async () => {
        try {
            // Toggle the current mode (true for light mode, false for dark mode)
            const updatedReminder = !reminder;

            const response = await fetch("http://localhost:8080/user/reminder", {
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
            console.error("Error updating reminder:", error);
        }
    };
    
    //handle 2FA changes
    const toggle2FA = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const updatedFAState = !FAState;

            const userUpdateData = {
                set2FA: updatedFAState,
                // Include other fields you want to update
                // firstName: newFirstName,
                // username: newUsername,
                // bio: newBio,
                // ...
            };
    
            //GET user data from backend
            const response = await fetch("http://localhost:8080/user/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(userUpdateData),
            });

            if (!response.ok) {
                throw new Error('updating 2FA failed');
            }
            const data = await response.json();
            console.log('new 2FA is', data.set2FA);

            setFAState(updatedFAState);
            console.log('updating 2FA state was a success');
            console.log('2FA status is: ', updatedFAState);
            

        } catch (error) {
            console.error('Error updating 2FA status', error);
        }
    }

    const handleEmailChange = (event) => {
        setPreferenceEmail(event.target.value);
        console.log('email change');
        setEmailError(""); // Clear any previous error message when the email input changes
    };

    const handleReminderTimeChange = (event) => {
        setReminderTime(event.target.value);
    };

    const validateEmail = (email) => {
        // Basic email format validation using a regular expression
        const emailRegex = /^[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        return emailRegex.test(email);
    };

    const handleSaveSettings = async () => {
        if (reminder) {
            if (!validateEmail(preferenceEmail)) {
                setEmailError("Incorrect Email Format");
                return; // Do not proceed if email format is incorrect
            }

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                // Determine whether "Everyday at" or "Every [] hours" was selected
                const isEverydayAt = reminderTime.includes(":"); // Check if reminderTime contains ":"
                const isEveryHour = !isEverydayAt;

                const response = await fetch("http://localhost:8080/user/reminderSetting", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        preferenceEmail: preferenceEmail, // Save preferenceEmail
                        everydayAt: isEverydayAt, // Set to true if "Everyday at" was selected
                        everyHour: isEveryHour,   // Set to true if "Every [] hours" was selected
                        everydayAtTime: isEverydayAt ? reminderTime : "", // Set time if "Everyday at" was selected, otherwise ""
                        everyHourTime: isEveryHour ? reminderTime : "",     // Set time if "Every [] hours" was selected, otherwise ""
                    }),
                });

                if (response.ok) {
                    setReminder(true); // Assuming you want to set reminder to true after saving
                    console.log(`Updated reminderSetting successfully.`);
                } else {
                    console.error(`Failed to update reminderSetting.`);
                }
            } catch (error) {
                console.error("Error updating reminderSetting:", error);
            }
        }
    };

    const handleClearButtonClick = () => {
        // Handle the click event for the Clear button here
        console.log('cancel clicked');
        setPreferenceEmail('');
        setReminderTime('');
    };

    const handleSaveButtonClick = async () => {
        // Handle the click event for the Clear button here
        if (reminder) {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            const userInfo = await fetch("http://localhost:8080/user/user", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                method: "GET",
            });

            if (!userInfo.ok) {
                throw new Error("Network userInfo was not ok");
            }

            const data = await userInfo.json();
            setUserEmail(data.email);

            const isEverydayAt = true;

            const response = await fetch("http://localhost:8080/user/reminderSetting", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    preferenceEmail: preferenceEmail,
                    everydayAt: isEverydayAt,
                    everyHour: '',
                    everydayAtTime: isEverydayAt ? reminderTime : '',
                    everyHourTime: '',
                }),
            });

            console.log("email is ", data.email);
            console.log("mode is ", data.mode);
            console.log("reminder is ", data.reminder);
            console.log("data.reminderSetting.everydayAt is ", data.reminderSetting.everydayAt);
            console.log("data.reminderSetting.everyHour is ", data.reminderSetting.everyHour);
            console.log("data.reminderSetting.everydayAt.time is ", data.reminderSetting.everydayAt.time);
            console.log("data.reminderSetting.everyHour.time is ", data.reminderSetting.everyHour.time);

            if (!response.ok) {
                console.error(`Failed to update reminderSetting.`);
            }
        }
    };

    const handleDeleteAccount = async () => {
        const isSure = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
        if (isSure) {
            const deleteResponse = await fetch(
                "http://localhost:8080/user/delete-account",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({email: userEmail}),
                }
            );
            console.log(deleteResponse);
            const deleteSuccess = await deleteResponse.json();
      
            if (deleteSuccess && deleteResponse.ok) {
                localStorage.removeItem("token");
                localStorage.removeItem("email");
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("email");
                dispatch(setLogout());
                Navigate("/");
            } else {
                setErrorMessage(deleteSuccess.error);
            }
        }
    };
    

    const modeClass = mode ? "light-mode" : "dark-mode"; // Check if mode is true (light mode)

    const textFieldStyles = {
        bgcolor: "#fbf2cf",
        "& label.Mui-focused": {
            color: "#000",
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: "#a1c298",
            },
            "&:hover fieldset": {
                borderColor: "#88b083",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#6b9466",
            },
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "85vh", // Ensure it takes at least the full height of the viewport
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#a1c298",
                    borderRadius: "8px",
                    p: 4,
                    width: ["90%", "60%", "40%", "30%"],  // Responsive width
                    mx: "auto",
                    textAlign: "center",  // Ensure all text inside is centered
                    fontSize: ["3vw", "2vw", "1.5vw", "1vw"],  // Responsive font size
                }}
            >
                <Typography variant="h3" mb={3} fontWeight="bold">
                    Settings
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validate={values => {
                        const errors = {};
                        if (!isValidEmail(values.email)) {
                            errors.email = "Invalid email format";
                        }
                        return errors;
                    }}
                    validationSchema={loginSchema}
                >
                    {({ values, errors, touched, isSubmitting, handleChange, handleBlur, submitCount }) => (
                        <Form>
                            <FormControlLabel
                                control={<Switch checked={mode} onChange={toggleDarkMode} />}
                                label="Toggle between light / dark mode"
                            />

                            <FormControlLabel
                                control={<Switch checked={reminder} onChange={toggleReminder} />}
                                label="Set Reminder"
                            />

                            <FormControlLabel
                                control={<Switch checked={FAState} onChange={toggle2FA} />}
                                label="Enable Two Factor Authentication"
                            />

                            {reminder && (
                                <TextField
                                    label="User Email"
                                    onBlur={handleBlur}
                                    onChange={handleEmailChange}
                                    value={preferenceEmail}
                                    name="email"
                                    error={Boolean(touched.email) && Boolean(errors.email) && submitCount > 0}
                                    helperText={(touched.email && errors.email && submitCount > 0) ? errors.email : ""}
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    sx={textFieldStyles}
                                />
                            )}

                            {reminder && (
                                <FormControl fullWidth variant="outlined" margin="normal" sx={textFieldStyles}>
                                    <InputLabel>Everyday at</InputLabel>
                                    <Field
                                        as={Select}
                                        name="reminderTime"
                                        label="Everyday at"
                                        error={touched.reminderTime && Boolean(errors.reminderTime)}
                                        onBlur={handleBlur}
                                        onChange={handleReminderTimeChange}
                                        value={reminderTime}
                                    >
                                        {Array.from({ length: 24 * 60 }, (_, index) => {
                                            const hours = Math.floor(index / 60);
                                            const minutes = index % 60;
                                            return (
                                                <MenuItem
                                                    key={index}
                                                    value={`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`}>
                                                    {`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`}
                                                </MenuItem>
                                            );
                                        })}
                                    </Field>
                                </FormControl>
                            )}

                            {reminder && (
                                <Box mt={2} display="flex" justifyContent="space-between" width="100%">
                                    <Button
                                        type="button"
                                        variant="contained"
                                        onClick={handleClearButtonClick}
                                        sx={{
                                            mt: 4,
                                            backgroundColor: "#455A64",
                                            color: "#FFFFFF",
                                            "&:hover": {
                                                backgroundColor: "#607D8B",
                                            },
                                            width: "48%",
                                        }}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        onClick={handleSaveButtonClick}

                                        disabled={isSubmitting}
                                        sx={{
                                            mt: 4,
                                            backgroundColor: "#fa7070",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#e64a4a",
                                            },
                                            width: "48%",
                                        }}
                                    >
                                        Save
                                    </Button>
                                </Box>
                            )}
                        </Form>
                    )}
                </Formik>
                {/* Error Message on invalid credentials or unsuccessfull login attempt */}
                {errorMessage && (
                    <Typography variant="body2" sx={{ color: "red", fontWeight: "bold", mt: 3, mb: 0 }}>
                        {errorMessage}
                    </Typography>
                )}
                {!reminder && (
                    <Button
                        type="button"
                        variant="contained"
                        onClick={handleDeleteAccount}
                        sx={{
                            mt: 1,
                            backgroundColor: "#e57373", // Choose a color that indicates danger/caution
                            color: "#FFFFFF",
                            "&:hover": {
                                backgroundColor: "#e53935", // Darken the color on hover
                            },
                            width: "100%", // Use full width if you like
                        }}
                    >
                        Delete Account
                    </Button>
                )}

            </Box>
        </Box>
    );
};

export default Settings;
