import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button, Box, Typography } from "@mui/material";
import * as yup from "yup";

const Contact = ({ userEmail, onEmailSent }) => {

    const initialValues = {
        userContactEmail: userEmail, 
        subject: "", 
        body: ""
    };

    const contactSchema = yup.object().shape({
        userContactEmail: yup.string().email("Invalid email format").required("Email is required"),
        subject: yup.string().required("Subject is required"),
        body: yup.string().max(300, "Body must be at most 300 words").required("Body is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            // Send form data to your server
            const response = await fetch("http://localhost:8080/user/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                // alert("Email sent successfully");
                onEmailSent();
            } else {
                alert("Failed to send email");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const textFieldStyles = {
        bgcolor: "#e7ede6",
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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh" }}>
            <Typography variant="h3" mb={3} fontWeight="bold">
                Contact Us
            </Typography>
            <Typography variant="h6" mb={3}>
                <strong>Phone:</strong> +1 (234) 567-8901
            </Typography>
            <Typography variant="h6" mb={3}>
                <strong>Email:</strong> support@example.com
            </Typography>
            <Formik
                initialValues={initialValues}
                // validationSchema={contactSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting,
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm,
                    submitCount,
                }) => (
                    <Form>
                        <TextField
                            name="userContactEmail"
                            label="Your Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            sx={textFieldStyles}
                            disabled
                            defaultValue={userEmail}
                        />
                        <TextField
                            label="Subject"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.subject}
                            variant="outlined"
                            margin="normal"
                            name="subject"
                            error={Boolean(touched.subject) && Boolean(errors.subject) && submitCount > 0}
                            helperText={(touched.subject && errors.subject && submitCount > 0) ? errors.subject : ""}
                            required
                            fullWidth
                            autoFocus
                            sx={textFieldStyles}
                        />
                        <TextField
                            label="Body"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.body}
                            variant="outlined"
                            margin="normal"
                            name="body"
                            error={Boolean(touched.body) && Boolean(errors.body) && submitCount > 0}
                            helperText={(touched.body && errors.subject && submitCount > 0) ? errors.body : ""}
                            required
                            fullWidth
                            multiline
                            rows={4}
                            sx={textFieldStyles}
                        />
                        <Button 
                            type="submit" 
                            variant="contained" 
                            disabled={isSubmitting}
                            sx={{ mt: 4, backgroundColor: "#fa7070", color: "#fff", "&:hover": { backgroundColor: "#e64a4a" }}}
                        >
                            Send
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default Contact;
