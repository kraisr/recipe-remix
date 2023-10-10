import "./pantry.css";
import logoImg from "../../images/Vector.png";
import React, { useEffect, useRef, useState } from "react";

const Pantry = () => {
    const [isPantryOpen, setIsPantryOpen] = useState(false);
    const [isRecipeOpen, setIsRecipeOpen] = useState(false);
    const handleDocumentClick = () => {
        if (isPantryOpen) {
            setIsPantryOpen(false);
        }
        if (isRecipeOpen) {
            setIsRecipeOpen(false);
        }
    };
    useEffect(() => {
        // Add the click event listener when the component mounts
        document.addEventListener('click', handleDocumentClick);

        // Cleanup: remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [isPantryOpen]);

    useEffect(() => {
        // Add the click event listener when the component mounts
        document.addEventListener('click', handleDocumentClick);

        // Cleanup: remove the event listener when the component unmounts
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [isRecipeOpen]);
    return ( 
            <div className="pantry-container">
                <div 
                className="pantry-tag" 
                style={{ display: isPantryOpen ? 'none' : 'flex' }} 
                onClick={(e) => {
                    e.stopPropagation();  // Stop the click event from bubbling up
                    setIsPantryOpen(!isPantryOpen);
                }}
                >
                    My Pantry
                </div>

                <div className={`pantry-left-container ${isPantryOpen ? 'open' : ''}`}>
                     <h2>
                        My Pantry
                    </h2>
                </div>

                <div className="pantry-center-container">
                    <img alt="remix" src={logoImg} height="325px" width="270px" />                        
                        <button type="button" class="pantry-button">
                               REMIX
                        </button>
                 </div>
                 
                 <div 
                className="recipe-tag" 
                style={{ display: isRecipeOpen ? 'none' : 'flex' }} 
                onClick={(e) => {
                    e.stopPropagation();  // Stop the click event from bubbling up
                    setIsRecipeOpen(!isRecipeOpen);
                }}
                >
                    Matched Recipes
                </div>
                 
                 <div className={`pantry-right-container ${isRecipeOpen ? 'open' : ''}`}>
                    <h2>
                        Matched Recipes
                    </h2>
                </div>
            </div>

    );
}

export default Pantry;



