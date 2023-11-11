import "./landing.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from 'react-multi-carousel';
import { Formik, Form, Field } from "formik";
import { TextField, Button, Box, Typography } from "@mui/material";
import 'react-multi-carousel/lib/styles.css';


import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


import image1 from "../../images/recipe1.jpg";
import image2 from "../../images/recipe2.jpg";
import image3 from "../../images/recipe3.jpg";
import image4 from "../../images/recipe4.jpg";
import image5 from "../../images/recipe5.jpg";
import image6 from "../../images/recipe6.jpg";
import image7 from "../../images/recipe7.jpg";

import aboutImage from "../../images/about-image.jpg";

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

  const Landing = ({ setLoggedIn }) => {
    const navigate = useNavigate();
  
    const handleRegisterClick = () => {
      navigate("/Register");
    };
  
    const handleLoginClick = () => {
      navigate("/Login");
    };
    const [isMenuOpen, setMenuOpen] = useState(false);
  
    const navRef = useRef(null);
    
    const [openAbout, setOpenAbout] = useState(false);
    const [openContact, setOpenContact] = useState(false);

    const openAboutHandler = () => {
      setOpenAbout(true);
    };

    const openContactHandler = () => {
      setOpenContact(true);
    };
   
    useEffect(() => {
      function handleClickOutside(event) {
        if (navRef.current && !navRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [navRef]);
  
    return (
      <div className="landing-container">
        <div className="landing-nav" ref={navRef} >
          <h2>Recipe Remix</h2>
          <div
            className="hamburger-menu"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            ☰
          </div>
          <div className={`nav-content ${isMenuOpen ? "show" : ""}`}>
            <span
              className="close-menu"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </span>

            <h2 onClick={openAboutHandler} style={{ cursor: "pointer" }} className="nav-about">
              About
            </h2>

            <h2 onClick={openContactHandler} style={{ cursor: "pointer" }} className="nav-contact">
              Contact
            </h2>
            
            <div className="landing-nav-button">
              <button
                type="button"
                className="landing-login"
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button
                type="button"
                className="landing-signup"
                onClick={handleRegisterClick}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <div className="main-content">
          <div className="landing-center-container">
            <h2>
              Find Recipes you can make, Fast and Simple
            </h2>
          </div>
    
          <div className="landing-bottom-container">
          <Carousel
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlay={true} 
            autoPlaySpeed={10000} 
            keyBoardControl={true}
            customTransition="transform 500ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            deviceType="desktop"
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            additionalTransfrom={80}
          >
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image1}
                alt=""
                style={{ width: "400px", height: "400px", borderRadius: "10%" }}
              />
            </div>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image2}
                alt=""
                style={{ width: "400px", height: "400px", borderRadius: "10%" }}
              />
            </div>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image3}
                alt=""
                style={{ width: "400px", height: "400px", borderRadius: "10%" }}
              />
            </div>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image4}
                alt=""
                style={{ width: "400px", height: "400px", borderRadius: "10%" }}
              />
            </div>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image5}
                alt=""
                style={{ width: "400px", height: "400px", borderRadius: "10%" }}
              />
            </div>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image6}
                alt=""
                style={{ width: "400px", height: "400px", borderRadius: "10%" }}
              />
            </div>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={image7}
                alt=""
                style={{ width: "400px", height: "400px", borderRadius: "10%" }}
              />
            </div>
          </Carousel>
            
          </div>
        </div>
        


        

        <Popup
          class="about"
          open={openAbout}
          onClose={() => setOpenAbout(false)}
          contentStyle={{ borderRadius: '10%', background: '#C6EBC5'}}
          
        >
          <div class="about">
            
            <div class="text">
            
              <h2>About Us</h2>
              
              <h5>Developers & <span>Hungry Students</span></h5>
              <img src={aboutImage} class="pic" />
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita natus ad sed harum itaque ullam enim quas, veniam accusantium, quia animi id eos adipisci iusto molestias asperiores explicabo cum vero atque amet corporis! Soluta illum facere consequuntur magni. Ullam dolorem repudiandae cumque voluptate consequatur consectetur, eos provident necessitatibus reiciendis corrupti!</p>
            </div>
          </div>
        </Popup>

        <Popup
          class="about"
          open={openContact}
          onClose={() => setOpenContact(false)}
          contentStyle={{ borderRadius: '10%', background: '#C6EBC5'}}
          
        >
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
              initialValues={{ subject: '', body: '' }}
                // initialValues={initialValues}
                // // validationSchema={contactSchema}
                // onSubmit={handleSubmit}
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
                            // sx={textFieldStyles}
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
                            // sx={textFieldStyles}
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
        </Popup>
      </div>
    );
  };
  
  export default Landing;