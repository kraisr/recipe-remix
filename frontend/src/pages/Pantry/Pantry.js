import "./pantry.css";
import logoImg from "../../images/Vector.png";
import React, { useEffect, useState } from "react";

const Pantry = () => {
    const [pantryIngredients, setPantryIngredients] = useState([]);

    useEffect(() => {
        const fetchPantryIngredients = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await fetch("http://localhost:8080/user/get-pantry", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setPantryIngredients(data);
            } catch (error) {
                console.error("Failed to fetch pantry ingredients:", error);
            }
        };

        fetchPantryIngredients();
    }, []);
    
        return (
            <div className="pantry-container">
                <div className="pantry-left-container">
                    <div className="pantry-title">My Pantry</div> {/* Replaced <h2> to match our new styles */}
                    <div className="ingredients-grid">
                    {pantryIngredients.map(ingredient => (
                        <div key={ingredient._id} className="ingredient-bubble">
                            {ingredient.ingredientName}
                            <button className="delete-button">Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pantry-center-container">
                <img alt="remix" src={logoImg} height="325px" width="270px" />  
                <button type="button" className="pantry-button">
                    REMIX
                </button>          
            </div>

            <div className="pantry-right-container">
                Matched Recipes
            </div>
        </div>
    );
}

export default Pantry;


       // Cleanup: remove the event listener when the component unmounts
    //     return () => {
    //         document.removeEventListener('click', handleDocumentClick);
    //     };
    // }, [isRecipeOpen]);
    // return ( 
    //         <div className="pantry-container">
    //             <div 
    //             className="pantry-tag" 
    //             style={{ display: isPantryOpen ? 'none' : 'flex' }} 
    //             onClick={(e) => {
    //                 e.stopPropagation();  // Stop the click event from bubbling up
    //                 setIsPantryOpen(!isPantryOpen);
    //             }}
    //             >
    //                 My Pantry
    //             </div>

    //             const data = await response.json();
    //             setPantryIngredients(data);
    //         } catch (error) {
    //             console.error("Failed to fetch pantry ingredients:", error);
    //         }
    //     };

    //     fetchPantryIngredients();
    // }, []);