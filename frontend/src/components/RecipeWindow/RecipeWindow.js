import React, { useState } from 'react';
import './recipewindow.css';

const RecipeWindow = ({ recipe, onClose, onSave }) => {
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
            alert(`${editedData.name} saved successfully!`); // Display confirmation message

            onSave(editedData); // Update the local state
            setEditField(null);

        } catch (error) {
            console.error("Failed to save edited recipe:", error);
        }
    };

    const handleFieldChange = (e, field) => {
        setEditedData({ ...editedData, [field]: e.target.value });
    };

    return (
        <div className="recipe-window">
            <button className="close-button" onClick={onClose}>X</button>
            <div className="recipe-content">

                <div className="name-container">
                    <h1>
                        {editField === "name" ? (
                            <>
                                <input value={editedData.name} onChange={(e) => handleFieldChange(e, 'name')} />
                                <button onClick={handleSave}>Save</button>
                                <button onClick={handleCancel}>Cancel</button> 
                            </>
                        ) : (
                            <>
                                 {editedData.name} 
                                <button className="editButtons" onClick={() => handleEdit('name')}>Edit</button>
                            </>
                        )}
                    </h1>
                </div>

                <div className="image-container">
                {editField === "mainImage" ? (
                        <>
                            <input value={editedData.mainImage} onChange={(e) => handleFieldChange(e, 'mainImage')} />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button> 
                        </>
                    ) : (
                        <>
                            <img src={editedData.mainImage} alt={editedData.name} className="recipe-image" />
                            <button className="editButtons" onClick={() => handleEdit('mainImage')}>Edit</button>
                        </>
                    )}
                </div>

                <div className="time-container">
                {editField === "totalTime" ? (
                        <>
                            <input value={editedData.totalTime} onChange={(e) => handleFieldChange(e, 'totalTime')} />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button> 
                        </>
                    ) : (
                        <>
                            <div>Total Time: {editedData.totalTime}</div>
                            <button className="editButtons" onClick={() => handleEdit('totalTime')}>Edit</button>
                        </>
                    )}
                </div>

                <div className="servings-container">
                {editField === "numberOfServings" ? (
                        <>
                            <input value={editedData.numberOfServings} onChange={(e) => handleFieldChange(e, 'numberOfServings')} />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button> 
                        </>
                    ) : (
                        <>
                            <div>Number of Servings: {editedData.numberOfServings}</div>
                            <button className="editButtons" onClick={() => handleEdit('numberOfServings')}>Edit</button>
                        </>
                    )}
                </div>

                <div className="ingredientLines-container">
                {editField === "ingredientLines" ? (
                        <>
                            <textarea 
                                value={editedData.ingredientLines.join('\n')} 
                                onChange={(e) => handleFieldChange(e, 'ingredientLines')} 
                            />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button> 
                        </>
                    ) : (
                        <>
                            <div className="window-title">Ingredients:</div>
                            <ul>
                                {editedData.ingredientLines.map((line, index) => (
                                    <li key={index}>{line}</li>
                                ))}
                            </ul>
                            <button className="editButtons" onClick={() => handleEdit('ingredientLines')}>Edit</button>
                        </>
                    )}
                </div>

                 <div className="instructions-container">
                 {editField === "instructions" ? (
                        <>
                            <textarea 
                                value={editedData.instructions.join('\n')} 
                                onChange={(e) => handleFieldChange(e, 'instructions')} 
                            />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button> 
                        </>
                    ) : (
                        <>
                            <div className="window-title">Instructions:</div>
                            <ol className="instructions-list">
                                {editedData.instructions.map((instr, index) => (
                                    <li key={index} className="instruction-line">{instr}</li>
                                ))}
                            </ol>
                            <button className="editButtons" onClick={() => handleEdit('instructions')}>Edit</button>
                        </>
                    )}
                </div>



                <div className="source-container">
                {editField === "source" ? (
                        <>
                            <input value={editedData.source} onChange={(e) => handleFieldChange(e, 'source')} />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button> 
                        </>
                    ) : (
                        <>
                            <div>Source: {editedData.source}</div>
                            <button className="editButtons" onClick={() => handleEdit('source')}>Edit</button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default RecipeWindow;
