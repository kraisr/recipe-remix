import React, { useState } from 'react';
import './recipewindow.css';
import { TextField, Button, Box } from '@mui/material';

const RecipeWindow = ({ recipe, onClose, onSave, edit }) => {
    const [editField, setEditField] = useState(null);
    const [editedData, setEditedData] = useState({ ...recipe });

    const handleEdit = (field) => {
        setEditField(field);
    };

    const handleCancel = () => {
        setEditedData({ ...recipe });
        setEditField(null);
    };

    
    

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in local storage.');
                return;
            }

            const response = await fetch("http://localhost:8080/user/edit-recipe", { // Assuming the endpoint for editing is /edit-recipe
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editedData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.message);
            // alert(`${editedData.name} saved successfully!`); // Display confirmation message

            onSave(editedData); // Update the local state
            setEditField(null);

        } catch (error) {
            console.error("Failed to save edited recipe:", error);
        }
    };

    const handleFieldChange = (e, field) => {
        if (field === "ingredientLines" || field === "instructions") {
            setEditedData({ ...editedData, [field]: e.target.value.split('\n') });
        } else {
            setEditedData({ ...editedData, [field]: e.target.value });
        }
    };

    const textFieldStyles = {
        bgcolor: "#ffffff",
        // width: '88%',
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
        <div className="recipe-window">
            <button className="close-button" onClick={onClose}>X</button>
            <div className="recipe-content">

                <div className="name-container">
                    <h1>
                        {editField === "name" ? (
                            <>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={editedData.name}
                                    onChange={(e) => handleFieldChange(e, 'name')}
                                    sx={textFieldStyles}
                                />
                                <Button sx={{color: '#4CAF50'}} onClick={handleSave}>Save</Button>
                                <Button sx={{color: '#FA7070'}} onClick={handleCancel}>Cancel</Button>  
                            </>
                        ) : (
                            <>
                                 {editedData.name} 
                                 {/* {edit && <button className="editButtons" onClick={() => handleEdit('name')}>Edit</button>} */}
                                 {edit && <Button
                                    variant="contained"
                                    className="editButtons"
                                    onClick={() => handleEdit('name')}
                                    sx={{
                                    bgcolor: 'grey.500', // Use the grey palette from the theme
                                    ml: 1.5,
                                    '&:hover': {
                                        bgcolor: 'grey.700', // Darker shade for hover state
                                    },
                                    }}
                                >
                                    Edit
                                </Button>}
                            </>
                        )}
                    </h1>
                </div>

                <div className="image-container">
                {editField === "mainImage" ? (
                        <>
                            {/* <input value={editedData.mainImage} onChange={(e) => handleFieldChange(e, 'mainImage')} /> */}
                            <TextField
                                variant="outlined"
                                value={editedData.mainImage}
                                // fullWidth
                                onChange={(e) => handleFieldChange(e, 'mainImage')}
                                sx={{...textFieldStyles, width: '45%'}}
                            />
                            <Button sx={{color: '#4CAF50'}} onClick={handleSave}>Save</Button>
                            <Button sx={{color: '#FA7070'}} onClick={handleCancel}>Cancel</Button> 
                        </>
                    ) : (
                        <>
                            <img src={editedData.mainImage} alt={editedData.name} className="recipe-image" />
                            {/* {edit && <button className="editButtons" onClick={() => handleEdit('mainImage')}>Edit</button>} */}
                            {edit && <Button
                                    variant="contained"
                                    className="editButtons"
                                    onClick={() => handleEdit('mainImage')}
                                    sx={{
                                    bgcolor: 'grey.500', // Use the grey palette from the theme
                                    ml: 1.5,
                                    '&:hover': {
                                        bgcolor: 'grey.700', // Darker shade for hover state
                                    },
                                    }}
                                >
                                    Edit
                                </Button>}
                        </>
                    )}
                </div>

                <div className="time-container">
                {editField === "totalTime" ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* <input value={editedData.totalTime} onChange={(e) => handleFieldChange(e, 'totalTime')} /> */}
                            <TextField
                                variant="outlined"
                                value={editedData.totalTime}
                                fullWidth
                                onChange={(e) => handleFieldChange(e, 'totalTime')}
                                sx={{...textFieldStyles, width: '30%'}}
                            />
                            <Button sx={{color: '#4CAF50'}} onClick={handleSave}>Save</Button>
                            <Button sx={{color: '#FA7070'}} onClick={handleCancel}>Cancel</Button> 
                        </div>
                    ) : (
                        <>
                            <div>
                                <span style={{ fontWeight: 'bold', marginRight: '0.5em' }}>Total Time:</span>
                                {editedData.totalTime}
                            </div>
                            {/* {edit && <button className="editButtons" onClick={() => handleEdit('totalTime')}>Edit</button>} */}

                            {edit && <Button
                                    variant="contained"
                                    className="editButtons"
                                    // size="small"
                                    onClick={() => handleEdit('totalTime')}
                                    sx={{
                                    bgcolor: 'grey.500', // Use the grey palette from the theme
                                    mb: 1,
                                    padding: '1px 1px', // Smaller padding
                                    fontSize: '0.75rem',
                                    height: 0.1,
                                    '&:hover': {
                                        bgcolor: 'grey.700', // Darker shade for hover state
                                    },
                                    }}
                                >
                                    Edit
                                </Button>}
                        </>
                    )}
                </div>

                <div className="servings-container">
                {editField === "numberOfServings" ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* <input value={editedData.numberOfServings} onChange={(e) => handleFieldChange(e, 'numberOfServings')} /> */}

                            <TextField
                                variant="outlined"
                                value={editedData.numberOfServings}
                                fullWidth
                                onChange={(e) => handleFieldChange(e, 'numberOfServings')}
                                sx={{...textFieldStyles, width: '20%'}}
                            />
                            <Button sx={{color: '#4CAF50'}} onClick={handleSave}>Save</Button>
                            <Button sx={{color: '#FA7070'}} onClick={handleCancel}>Cancel</Button> 
                        </div>
                    ) : (
                        <>
                            {/* <div>Number of Servings: {editedData.numberOfServings}</div> */}
                            <div>
                                <span style={{ fontWeight: 'bold', marginRight: '0.5em' }}>Number of Servings:</span>
                                {editedData.numberOfServings}
                            </div>
                            {/* {edit && <button className="editButtons" onClick={() => handleEdit('numberOfServings')}>Edit</button>} */}
                            {edit && <Button
                                    variant="contained"
                                    className="editButtons"
                                    // size="small"
                                    onClick={() => handleEdit('numberOfServings')}
                                    sx={{
                                    bgcolor: 'grey.500', // Use the grey palette from the theme
                                    mb: 1,
                                    padding: '1px 1px', // Smaller padding
                                    fontSize: '0.75rem',
                                    height: 0.1,
                                    '&:hover': {
                                        bgcolor: 'grey.700', // Darker shade for hover state
                                    },
                                    }}
                                >
                                    Edit
                                </Button>}
                        </>
                    )}
                </div>

                <div className="ingredientLines-container">
                {editField === "ingredientLines" ? (
                        <>
                            <TextField
                                multiline
                                rows={8} // Adjust the number of rows as needed
                                variant="outlined"
                                fullWidth
                                value={editedData.ingredientLines.join('\n')}
                                onChange={(e) => handleFieldChange(e, 'ingredientLines')}
                            />
                            <Button sx={{color: '#4CAF50'}} onClick={handleSave}>Save</Button>
                            <Button sx={{color: '#FA7070'}} onClick={handleCancel}>Cancel</Button> 
                        </>
                    ) : (
                        <>
                            <div className="window-title">Ingredients:</div>
                            <ul>
                                {editedData.ingredientLines.map((line, index) => (
                                    <li key={index}>{line}</li>
                                ))}
                            </ul>
                            {/* {edit && <button className="editButtons" onClick={() => handleEdit('ingredientLines')}>Edit</button>} */}
                            {edit && <Button
                                    variant="contained"
                                    className="editButtons"
                                    // size="small"
                                    onClick={() => handleEdit('ingredientLines')}
                                    sx={{
                                    bgcolor: 'grey.500', // Use the grey palette from the theme
                                    mb: 1,
                                    padding: '1px 1px', // Smaller padding
                                    fontSize: '0.75rem',
                                    height: 0.1,
                                    '&:hover': {
                                        bgcolor: 'grey.700', // Darker shade for hover state
                                    },
                                    }}
                                >
                                    Edit
                                </Button>}
                        </>
                    )}
                </div>

                 <div className="instructions-container">
                 {editField === "instructions" ? (
                        <>
                            {/* <textarea 
                                value={editedData.instructions.join('\n')} 
                                onChange={(e) => handleFieldChange(e, 'instructions')} 
                            /> */}
                            <TextField
                                multiline
                                rows={8} // Adjust the number of rows as needed
                                variant="outlined"
                                fullWidth
                                value={editedData.instructions.join('\n')} 
                                onChange={(e) => handleFieldChange(e, 'instructions')} 
                            />
                            <Button sx={{color: '#4CAF50'}} onClick={handleSave}>Save</Button>
                            <Button sx={{color: '#FA7070'}} onClick={handleCancel}>Cancel</Button> 
                        </>
                    ) : (
                        <>
                            <div className="window-title">Instructions:</div>
                            <ol className="instructions-list">
                                {editedData.instructions.map((instr, index) => (
                                    <li key={index} className="instruction-line">{instr}</li>
                                ))}
                            </ol>
                            {/* {edit && <button className="editButtons" onClick={() => handleEdit('instructions')}>Edit</button>} */}
                            {edit && <Button
                                    variant="contained"
                                    className="editButtons"
                                    // size="small"
                                    onClick={() => handleEdit('instructions')}
                                    sx={{
                                    bgcolor: 'grey.500', // Use the grey palette from the theme
                                    mb: 1,
                                    padding: '1px 1px', // Smaller padding
                                    fontSize: '0.75rem',
                                    height: 0.1,
                                    '&:hover': {
                                        bgcolor: 'grey.700', // Darker shade for hover state
                                    },
                                    }}
                                >
                                    Edit
                                </Button>}
                        </>
                    )}
                </div>


                {/* SOURCE FIELD IN RECIPE OBJECT IS NULL */}
                {/* <div className="source-container">
                {editField === "source" ? (
                        <>
                            <input value={editedData.source} onChange={(e) => handleFieldChange(e, 'source')} />
                            <Button sx={{color: '#4CAF50'}} onClick={handleSave}>Save</Button>
                            <Button sx={{color: '#FA7070'}} onClick={handleCancel}>Cancel</Button> 
                        </>
                    ) : (
                        <>
                            <div>Source: {editedData.source}</div>
                            {edit && <button className="editButtons" onClick={() => handleEdit('source')}>Edit</button>}
                        </>
                    )}
                </div> */}

            </div>
        </div>
    );
}

export default RecipeWindow;
