const darkModeToggle = document.getElementById('darkModeToggle');
const recipeContainer = document.getElementById('recipeContainer');
const favoritesContainer = document.getElementById('favoritesContainer');
const recipeForm = document.getElementById('recipeForm');
const searchRecipe = document.getElementById('searchRecipe');
const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');
const favoritesSection = document.getElementById('favoritesSection');

const modalImage = document.getElementById('modalImage');
const modalRecipeName = document.getElementById('modalRecipeName');
const modalIngredients = document.getElementById('modalIngredients');
const modalDescription = document.getElementById('modalDescription');
const modalReviews = document.getElementById('modalReviews');
const reviewInput = document.getElementById('reviewInput');
const submitReview = document.getElementById('submitReview');
const editRecipeButton = document.getElementById('editRecipeButton');

let recipes = [
    {
        name: "Dal Bhat",
        image: "https://cdn.shopify.com/s/files/1/0223/0981/files/Dal_Bhat_from_Nepal_curry_dhal_lentils_spinach_rice_yogurt.jpg?v=1618366911",
        description: "Traditional Nepali lentil soup served with steamed rice and side dishes.",
        ingredients: ["Rice", "Lentils", "Vegetables", "Pickles"],
        reviews: []
    },
    {
        name: "Momo",
        image: "https://www.aljazeera.com/wp-content/uploads/2024/07/GettyImages-1227591852-1721487293.jpg?resize=1920%2C1440",
        description: "Steamed dumplings filled with meat or vegetables, served with chutney.",
        ingredients: ["Flour", "Meat/Veggies", "Onion", "Garlic", "Ginger"],
        reviews: []
    },
    {
        name: "Thukpa",
        image: "https://wfg32p.s3.amazonaws.com/media/dishes/thukpa_1790-reg.jpg",
        description: "Hot and spicy noodle soup with meat or vegetables, perfect for cold days.",
        ingredients: ["Noodles", "Meat/Veggies", "Broth", "Spices"],
        reviews: []
    }
];

let favorites = [];
let currentRecipeIndex = null;

const renderRecipes = (filter = "") => {
    recipeContainer.innerHTML = "";
    recipes
        .filter(recipe => recipe.name.toLowerCase().includes(filter.toLowerCase()))
        .forEach((recipe, index) => {
            recipeContainer.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
                        <div class="card-body">
                            <h5 class="card-title">${recipe.name}</h5>
                            <p class="card-text">${recipe.description}</p>
                            <button class="btn btn-primary w-100 mb-2" onclick="openRecipeModal(${index})">
                                📜 View Recipe
                            </button>
                            <button class="btn btn-outline-success w-100" onclick="addToFavorites(${index})">
                                ❤️ Add to Favorites
                            </button>
                            <button class="btn btn-outline-warning w-100 mt-2" onclick="editRecipe(${index})">
                                ✏️ Edit Recipe
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
};

const openRecipeModal = (index) => {
    currentRecipeIndex = index;
    const recipe = recipes[index];

    modalImage.src = recipe.image;
    modalRecipeName.textContent = recipe.name;
    modalDescription.textContent = recipe.description;

    modalIngredients.innerHTML = "";
    recipe.ingredients.forEach(ingredient => {
        modalIngredients.innerHTML += `<li class="list-group-item">${ingredient}</li>`;
    });

    modalReviews.innerHTML = recipe.reviews.length 
        ? recipe.reviews.map(review => `<p>⭐ ${review}</p>`).join("")
        : `<p>No reviews yet. Be the first to add one!</p>`;

    new bootstrap.Modal(document.getElementById('recipeModal')).show();
};

submitReview.addEventListener('click', () => {
    const reviewText = reviewInput.value;
    if (reviewText && currentRecipeIndex !== null) {
        recipes[currentRecipeIndex].reviews.push(reviewText);
        reviewInput.value = "";
        openRecipeModal(currentRecipeIndex); 
    }
});

const addToFavorites = (index) => {
    const selectedRecipe = recipes[index];
    if (!favorites.some(fav => fav.name === selectedRecipe.name)) {
        favorites.push(selectedRecipe);
        renderFavorites();
    } else {
        alert("Recipe already in favorites!");
    }
};

const removeFromFavorites = (index) => {
    favorites.splice(index, 1);
    renderFavorites();
};

const renderFavorites = () => {
    favoritesContainer.innerHTML = "";
    favorites.forEach((recipe, index) => {
        favoritesContainer.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${recipe.image}" class="card-img-top" alt="${recipe.name}">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.name}</h5>
                        <button class="btn btn-danger w-100" onclick="removeFromFavorites(${index})">
                            ❌ Remove from Favorites
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
};

recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('recipeName').value;
    const image = document.getElementById('recipeImage').value || "https://example.com/default.jpg";
    const description = document.getElementById('recipeDescription').value;
    const ingredients = document.getElementById('recipeIngredients').value.split(',');

    if (currentRecipeIndex !== null) {
        recipes[currentRecipeIndex] = { name, image, description, ingredients, reviews: [] };
        alert("Recipe updated successfully!");
    } else {
        recipes.push({ name, image, description, ingredients, reviews: [] });
        alert("Recipe added successfully!");
    }

    renderRecipes();
    recipeForm.reset();
    currentRecipeIndex = null;  
});

const editRecipe = (index) => {
    currentRecipeIndex = index;
    const recipe = recipes[index];

    document.getElementById('recipeName').value = recipe.name;
    document.getElementById('recipeImage').value = recipe.image;
    document.getElementById('recipeDescription').value = recipe.description;
    document.getElementById('recipeIngredients').value = recipe.ingredients.join(',');

    document.getElementById('submitRecipeBtn').textContent = "Update Recipe";
};

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

searchRecipe.addEventListener('input', (e) => {
    renderRecipes(e.target.value);
});

viewFavoritesBtn.addEventListener('click', () => {
    favoritesSection.style.display = favoritesSection.style.display === "none" ? "block" : "none";
});

renderRecipes();
renderFavorites();
