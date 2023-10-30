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
    const [expandedFolder, setExpandedFolder] = useState(null);
    const [activeFolder, setActiveFolder] = useState(null);
   
    const openRecipes = () => {
        setIsRecipesOpen(true);
    };

    const closePanels = () => {
        setIsRecipesOpen(false);
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    const [folders, setFolders] = useState([]);
    const [isFolderCreationOpen, setIsFolderCreationOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    const openFolderCreation = () => {
        setIsFolderCreationOpen(true);
    };
    
    const closeFolderCreation = () => {
        setIsFolderCreationOpen(false);
    };

    const [selectedRecipeForFolder, setSelectedRecipeForFolder] = useState(null);
    const [isFolderSelectorOpen, setIsFolderSelectorOpen] = useState(false);

     // Function to open the folder selector modal for a particular recipe
     const openFolderSelector = (recipe) => {
        if(folders.length === 0) {
            alert("Please create a collection first!");
            openFolderCreation();
            return;
        }
        setSelectedRecipeForFolder(recipe);
        setIsFolderSelectorOpen(true);
    }

    // Function to close the folder selector modal
    const closeFolderSelector = () => {
        setSelectedRecipeForFolder(null);
        setIsFolderSelectorOpen(false);
    }

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
            } catch (error) {
                console.error("Failed to fetch saved recipes:", error);
            }
        };

        fetchSavedRecipes();
    }, []);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:8080/user/get-folders", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setFolders(data);
            } catch (error) {
                console.error("Failed to fetch folders:", error);
            }
        };

        fetchFolders();
    }, []);

    // Create a folder
    const createFolder = async () => {
        if (folders.some(folder => folder.name && folder.name.toLowerCase() === newFolderName.toLowerCase())) {
            alert("A folder with this name already exists!");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:8080/user/create-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newFolderName })
            });

            if (response.ok) {
                const responseData = await response.json();
                setFolders(prevFolders => [...prevFolders, responseData.folder]);
                setNewFolderName('');
                closeFolderCreation();
            } else {
                throw new Error('Failed to create folder');
            }
            
        } catch (error) {
            console.error("Failed to create folder:", error);
        }
    };

    // Add a recipe to a folder
    const addRecipeToFolder = async (folderName) => {
        try {
            const targetFolder = folders.find(f => f.name === folderName);
            if (!targetFolder || (targetFolder.recipes && targetFolder.recipes.some(r => r._id === selectedRecipeForFolder._id))) {
                window.alert("Either folder not found or recipe already exists in the folder");
                return;
            }
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:8080/user/add-recipe-to-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ folderName, recipe: selectedRecipeForFolder })
            });

            if (response.ok) {
                const updatedFolder = await response.json();
                setFolders(prevFolders => prevFolders.map(folder => {
                    if (folder.name === folderName) {
                        return {
                            ...folder,
                            recipes: [...folder.recipes, selectedRecipeForFolder]
                        };
                    }
                    return folder;
                }));
                closeFolderSelector();
            } else {
                throw new Error('Failed to add recipe to folder');
            }
        } catch (error) {
            console.error("Failed to add recipe to folder:", error);
        }
    };

    const removeRecipeFromFolder = async (folderName, recipeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:8080/user/remove-recipe-from-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ folderName, recipeId })
            });
    
            if (response.ok) {
                let updatedActiveFolder = null;
                setFolders(prevFolders => prevFolders.map(folder => {
                    if (folder.name === folderName) {
                        updatedActiveFolder = {
                            ...folder,
                            recipes: folder.recipes.filter(recipe => recipe._id !== recipeId)
                        };
                        return updatedActiveFolder;
                    }
                    return folder;
                }));
                setActiveFolder(updatedActiveFolder);
            } else {
                throw new Error('Failed to remove recipe from folder');
            }
        } catch (error) {
            console.error("Failed to remove recipe from folder:", error);
        }
    };
    

    // Delete a folder
    const deleteFolder = async (folderName) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:8080/user/delete-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ folderName })
            });

            if (response.ok) {
                setFolders(prevFolders => prevFolders.filter(folder => folder.name !== folderName));
            } else {
                throw new Error('Failed to delete folder');
            }
        } catch (error) {
            console.error("Failed to delete folder:", error);
        }
    };

    const handleRecipesClick = (recipe) => {
        setSelectedRecipes(recipe);
    }

    const handleDelete = async (recipe) => {
         const userConfirmed = window.confirm(`Are you sure you want to delete ${recipe.name} from your pantry?`);
         if (userConfirmed) {
             await deleteRecipe(recipe);
             setSavedRecipes(prevRecipes => prevRecipes.filter(r => r.name !== recipe.name));
         }
    }
    
    const toggleFolder = (folderName) => {
        if (expandedFolder === folderName) {
            setExpandedFolder(null);
        } else {
            setExpandedFolder(folderName);
        }
    };

    const handleFolderClick = (folder) => {
        setActiveFolder({
            name: folder.name,
            recipes: folder.recipes
        });
    };

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
    const filteredRecipes = savedRecipes.filter(recipe => recipe.name && recipe.name.toLowerCase().includes(searchTerm.toLowerCase()));



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
                    {
                        filteredRecipes.length > 0 
                        ? filteredRecipes.map(recipe => (
                            <div key={recipe._id} className="recipe-bubble">
                                <button onClick={() => openFolderSelector(recipe)}>+</button>
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
                        ))
                        : <div className="no-recipes-message">
                            No recipes found. Please check for typos or try a different keyword.
                        </div>
                    }
                </div>
            </div>
            {
                isFolderSelectorOpen && (
                    <div className="modal-shadow">
                    <div className="folder-selector-modal">
                        <center><b><p>Select a folder for {selectedRecipeForFolder && selectedRecipeForFolder.name}</p></b></center>
                        {folders.map(folder => (
                            <center><button className="folder-select" key={folder.name} onClick={() => addRecipeToFolder(folder.name)}>
                                {folder.name}
                            </button> </center>
                        ))}
                        <center> <button className="folder-cancel" onClick={closeFolderSelector}>Cancel</button> </center>
                    </div>
                    </div>
                )
            }
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
            <div className="folders-section">
                <button className="folder-create" onClick={openFolderCreation}>Create a Folder</button>

                {folders.map(folder => (
            <div 
                key={folder.name} 
                className="folder" 
                onClick={() => handleFolderClick(folder)}
            >
                <div className="folder-header">
                    <div className="folder-name">{folder.name}</div>
                    <button className="recipe-delete-button" onClick={e => { e.stopPropagation(); deleteFolder(folder.name); }}>Delete</button>
                </div>
            </div>
        ))}

        {/* Modal to display the active folder's recipes */}
        {activeFolder && (
            <div className="modal-shadow">
                <div className="active-folder-modal">
                <center><h2>{activeFolder.name}</h2></center> {/* Displaying the folder's name in the modal */}
                    {activeFolder.recipes && activeFolder.recipes.length > 0 ? (
                        <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                            {activeFolder.recipes.map(recipe => (
                                <li className="modal-container" key={recipe._id} onClick={() => handleRecipesClick(recipe)}>
                                    <span className="modal-recipe" onClick={() => handleRecipesClick(recipe)}>{recipe.name}</span>
                                    <button className="recipe-delete-button" onClick={e => { e.stopPropagation(); removeRecipeFromFolder(activeFolder.name, recipe._id); }}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>Collection Empty</div>
                    )}
                    <center><button className="folder-cancel" onClick={() => setActiveFolder(null)}>Close</button></center>
                </div>
            </div>
        )}
                {isFolderCreationOpen && (
                    <div className="modal-shadow">
                         <div className="folder-creation-popup">
                            <center><input 
                                value={newFolderName} 
                                onChange={e => setNewFolderName(e.target.value)} 
                                className="folder-bar"
                                placeholder="Folder Name" 
                            /></center>
                            <center><button className="folder-select" onClick={createFolder}>Create Folder</button></center>
                            <center><button className="folder-cancel" onClick={closeFolderCreation}>Cancel</button></center>
                        </div>
                    </div>
                   
                )}

            </div>

        </div>
    );
}

export default Recipes;