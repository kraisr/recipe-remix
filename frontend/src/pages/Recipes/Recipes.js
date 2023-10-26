import "./recipes.css";
import React, { useEffect, useState, useRef } from "react";
import RecipeWindow from '../../components/RecipeWindow/RecipeWindow'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { deleteRecipe } from "./DeleteRecipe.js";



//ingredientLines
//id
//totalTiimie
//name
//numberOfServings
//source
//mainImage
//instructions
const Recipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // for the search filter
    const [isRecipesOpen, setIsRecipesOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [selectedRecipes, setSelectedRecipes] = useState(null);

   
    const openRecipes = () => {
        setIsRecipesOpen(true);
    };

    const closePanels = () => {
        setIsRecipesOpen(false);
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        // Cleanup event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    

    useEffect(() => {
        // This assumes you have an endpoint to fetch saved recipes for a user
        const fetchSavedRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await fetch("http://localhost:8080/user/get-recipes", {
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
                setSavedRecipes(data);
                 // Log the saved recipes here
                console.log("Saved Recipes:", data);
            } catch (error) {
                console.error("Failed to fetch saved recipes:", error);
            }
        };

        fetchSavedRecipes();
    }, []);

    const handleRecipesClick = (recipe) => {
        setSelectedRecipes(recipe);
    }

    // Handle delete logic similarly to the Pantry one. This is a placeholder.
    const handleDelete = async (recipe) => {
        // Display a confirmation prompt to the user
         const userConfirmed = window.confirm(`Are you sure you want to delete ${recipe.name} from your pantry?`);
    
         // If the user confirms the deletion, proceed with the deletion logic
         if (userConfirmed) {
             await deleteRecipe(recipe);
             setSavedRecipes(prevRecipes => prevRecipes.filter(r => r.name !== recipe.name));
         }
    }

    Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
      });

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#FBF2CF',
            padding: 20,
        },
        recipeContent: {
            backgroundColor: '#FBF2CF',
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 10,
            marginRight: 10,
            fontFamily: 'Oswald'
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
        },
        imageContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            height: 200
        },
        image: {
            width: 200,
            height: 200,
            borderRadius: 10
        },
        imagePlaceholder: {
            width: 200,
            height: 50,
        },
        infoContainer: {
            marginVertical: 8,
        },
        ingredients: {
            marginBottom: 10,
            breakAfter: true
        },
        ingredientTitle: {
            fontWeight: 'bold',
            fontSize: 15,
            marginBottom: 6,
        },
        ingredientItem: {
            fontSize: 12,
            fontWeight: 'normal'
        },
        instructions: {
            marginBottom: 10,
        },
        instructionTitle: {
            fontWeight: 'bold',
            fontSize: 15,
            marginBottom: 6,
        },
        instructionItem: {
            fontSize: 12,
            fontWeight: 'normal'
        },
        source: {
            marginTop: 8,
        }
    });
    
    
     // ZA PDF ITSELF 
     const PdfGen = ({ recipe }) => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.recipeContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{recipe.name}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        {
                            recipe.mainImage !== "https://sg-data.storage.googleapis.com/images_bucket/Empty.png" 
                            ? (<View style={styles.imageContainer}>
                                <Image src={recipe.mainImage} style={styles.image} />
                            </View>)
                            : <View style={styles.imagePlaceholder} />
                        }
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.instructions}>Total Time: {recipe.totalTime}</Text>
                        <Text>Number of Servings: {recipe.numberOfServings}</Text>
                    </View>
                    <View style={styles.ingredients}>
                        <Text style={styles.ingredientTitle}>Ingredients:</Text>
                        {recipe.ingredientLines.map((line, index) => (
                            <Text key={index} style={styles.ingredientItem}>- {line}</Text>
                        ))}
                    </View>
                    <View style={styles.instructions} breakAfter={true}>
                    <Text style={styles.instructionTitle}>Instructions:</Text>
                    {recipe.instructions && recipe.instructions.length > 0 ? (
                        recipe.instructions.map((instr, index) => (
                            <Text key={index} style={styles.instructionItem}>{index + 1}. {instr}</Text>
                        ))
                    ) : (
                        <Text style={styles.instructionItem}>Adjust to your preferences.</Text>
                    )}
                    </View>
                    <View style={styles.source}>
                        <Text>Source: {recipe.source}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
    

    const isSmallScreen = windowWidth < 769; // You can adjust this value as needed


    return (
        <div className="recipes-container">
            {isSmallScreen && !isRecipesOpen && <button className="recipe-toggle-button" onClick={openRecipes} style={{display: 'block', zIndex: 500}}>My Recipes</button>}

            <div className={`recipes-box ${isRecipesOpen ? 'slide-in' : ''}`}>
                {isRecipesOpen && <button onClick={closePanels} className="close-panel-button" style={{display: 'block'}}>X</button>} 
                <div className="recipes-title">My Recipes</div>
                <input 
                    type="text" 
                    placeholder="Search My Recipes..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="search-input"
                />
                <div className="recipes-grid">
                    {savedRecipes.filter(recipe => recipe.name && recipe.name.toLowerCase().includes(searchTerm.toLowerCase())).map(recipe => (
                        <div key={recipe._id} className="recipe-bubble">
                            <div className="recipe-name" onClick={() => handleRecipesClick(recipe)}>{recipe.name}</div>
                            <div className="recipe-buttons">
                                <PDFDownloadLink
                                    document={<PdfGen recipe={recipe} />}
                                    fileName={`${recipe.name}.pdf`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {({ blob, url, loading, error }) => 
                                        loading ? "Loading..." : <button className="download-button">Download</button>
                                    }
                                </PDFDownloadLink>
                                <button 
                                    className="recipe-delete-button" 
                                    onClick={() => handleDelete(recipe)}
                                >
                                    Delete
                                </button>
                            </div> 
                        </div>
                    ))}
                </div>
            </div>
            {
                selectedRecipes && 
                <RecipeWindow 
                    recipe={selectedRecipes} 
                    onClose={() => setSelectedRecipes(null)} 
                    onSave={(updatedRecipe) => {
                    // Logic to save updatedRecipe to backend and update savedRecipes state
                 }}
                />
            }

        </div>
    );
}

export default Recipes;