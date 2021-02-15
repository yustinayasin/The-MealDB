const form = document.querySelector('form');
const main = document.querySelector('main');
const filterResults = document.querySelector('.filter-result');
const randomBtn = document.querySelector('.random-btn');
const menuHam = document.querySelector('.menu-ham');
const menuClose = document.querySelector('.menu-close');
const navFluid = document.querySelector('.nav-fluid');
const navbar = document.querySelector('nav');
const buttonsWrapper = document.querySelector('.buttons');
const homeBtn = document.querySelector('.home-btn');
const categoryBtn = document.querySelector('.category-btn');
const areaBtn = document.querySelector('.area-btn');
const ingredientBtn = document.querySelector('.ingredient-btn');
const menus = document.querySelectorAll('.menu');
const body = document.querySelector('body');
const modalWrapper = document.querySelector('.modal-wrapper');


// toggle menu
menuHam.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', toggleMenu);


document.addEventListener('click', async function(e) {
    try {
        // filter category button
        if(e.target.classList.contains('btn-filter')){
            const filterButtons = buttonsWrapper.querySelectorAll('.btn-filter');
            filterButtons.forEach(filterButton => {
                if(filterButton.classList.contains('active')){
                    filterButton.classList.remove('active');
                }
            });
            e.target.classList.add('active');

            if(categoryBtn.classList.contains('active')) {
                showFilter("c=",e.target.innerHTML);
            } else if (areaBtn.classList.contains('active')){
                showFilter("a=",e.target.innerHTML);
            } else {
                showFilter("i=",e.target.innerHTML);
            }
        }

        if(e.target.classList.contains('card')){
            await getMealDetail(e.target.dataset.idmeal);
            modalWrapper.classList.add('active');
        }

        if(e.target.classList.contains('modal-close')) {
            modalWrapper.classList.remove('active');
        }

    } catch(err) {
        console.log(err);
    }
});

// home button
homeBtn.addEventListener('click', () => {
    buttonsWrapper.innerHTML = '';
    filterResults.innerHTML = '';
});

// get category filter button
categoryBtn.addEventListener('click', (e) => {
    toggleActive(e);
    getButtons("c=list");
});

// get area filter button
areaBtn.addEventListener('click', (e) => {
    toggleActive(e);
    getButtons("a=list");
});

// get ingredient filter button
ingredientBtn.addEventListener('click', (e) => {
    toggleActive(e);
    getButtons("i=list");
});

// request post API search by name
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formElements = document.querySelector('form').elements;
    const inputValue = formElements[0].value;
    searchMeal(inputValue);
});

// random button
randomBtn.addEventListener('click', () => {
    try {
        buttonsWrapper.classList.remove('active');
        randomMeal();
    } catch(err) {
        console.log(err);
    }
});

function toggleActive(e) {
    menus.forEach(menu => {
        if(menu.classList.contains('active')){
            menu.classList.remove('active');
        }
    });
    e.target.classList.add('active');
    filterResults.innerHTML = '';
    buttonsWrapper.classList.add('active');
}

function showCards(meal) {
    return `<div class="card" data-idMeal="${meal.idMeal}">
                <div class="image-wrapper" style="background: url(${meal.strMealThumb}) no-repeat; background-size: cover;"></div>
                <div class="menu-name">${meal.strMeal}</div>
            </div>`;
}

function showButtons(name) {
    return `<button class="btn-filter">${name}</button>`;
}

function showMealDetail(meal) {
    // console.log(meal);
    let ingredients = [];
    let list = '';
    let i = 1;

    while(i<=20){
        if(meal[0][`strIngredient`+i] === "") {
            i = 21;
        } else {
            ingredients.push([meal[0][`strIngredient`+i], meal[0][`strMeasure`+i]])
        }
        i++;
    }

    console.log(ingredients);

    ingredients.forEach((ingredient) => {
        list += `<li>${ingredient[1]} ${ingredient[0]}</li>`
    });

    console.log(list);

    return `<div class="modal">
                <div class="image-wrapper" style="background: url(${meal[0].strMealThumb}) no-repeat; background-size: cover;"></div>
                <h3 class="menu-name">${meal[0].strMeal}</h3>
                <div class="ingredients">
                    <h4>Ingredients:</h4>
                    <ol start="1">`
                        +list+
                    `</ol>
                </div>
                <div class="steps">
                    <h4>Step by step:</h4>
                    <p>${meal[0].strInstructions}</p>
                </div>
                <button class="modal-close">Close</button>
            </div>`;
}

function toggleMenu() {
    menuClose.classList.toggle('active');
    navFluid.classList.toggle('active');
    navbar.classList.toggle('active');
    menuHam.classList.toggle('active');
}

function searchMeal(inputValue) {
    return  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`, {
                method: 'POST'
            }).then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(response => {
                if(response.Response === 'False') {
                    throw new Error(response.Error);
                }
                const meals = response.meals;
                //console.log(meals);
                let cards = '';
                meals.forEach(meal => {
                    cards += showCards(meal);
                });
                return filterResults.innerHTML = cards;
            });
}

function randomMeal() {
    return fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(response => {
                if(response.Response === 'False') {
                    throw new Error(response.Error);
                }
                const meals = response.meals;
                //console.log(meals);
                let cards = '';
                meals.forEach(meal => {
                    cards += showCards(meal);
                });
                return filterResults.innerHTML = cards;
            });
}

function getButtons(link) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${link}`)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(response => {
                if(response.Response === 'False') {
                    throw new Error(response.Error);
                }
                let filters = [];
                let buttons = '';
                const lists = response.meals;
                lists.forEach((list) => {
                    if(link === "c=list") {
                        filters.push(list.strCategory);
                    } else if (link === "a=list") {
                        filters.push(list.strArea);
                    } else {
                        filters.push(list.strIngredient);
                    }
                });

                filters.forEach((ctg) => {
                    buttons += showButtons(ctg);
                });

                return buttonsWrapper.innerHTML = buttons;
            });
}


function showFilter(link, filter) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${link}${filter}`)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(response => {
                if(response.Response === 'False') {
                    throw new Error(response.Error);
                }
                let meals = response.meals;
                let cards = '';
                meals.forEach((meal) => {
                    cards += showCards(meal);
                });

                filterResults.innerHTML = cards;
            });
}

function getMealDetail(id) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(response => {
                if(response.Response === 'False') {
                    throw new Error(response.Error);
                }
                const meal = response.meals;
                modalWrapper.innerHTML = showMealDetail(meal);
            })
}