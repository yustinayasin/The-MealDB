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


// toggle menu
menuHam.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', toggleMenu);


document.addEventListener('click', function(e) {
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
    return `<div class="card">
                <div class="image-wrapper" style="background: url(${meal.strMealThumb}) no-repeat; background-size: cover;"></div>
                <div class="menu-name">${meal.strMeal}</div>
            </div>`;
}

function showButtons(name) {
    return `<button class="btn-filter">${name}</button>`;
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
            }).then(response => response.json())
            .then(response => {
                const meals = response.meals;
                //console.log(meals);
                let cards = '';
                meals.forEach(meal => {
                    cards += showCards(meal);
                });
                filterResults.innerHTML = cards;
            });
}

function randomMeal() {
    return fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
            .then(response => response.json())
            .then(response => {
                const meals = response.meals;
                //console.log(meals);
                let cards = '';
                meals.forEach(meal => {
                    cards += showCards(meal);
                });
                filterResults.innerHTML = cards;
            });
}

function getButtons(link) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${link}`)
            .then(response => response.json())
            .then(response => {
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

                buttonsWrapper.innerHTML = buttons;
            });
}


function showFilter(link, filter) {
    return fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${link}${filter}`)
            .then(response => response.json())
            .then(response => {
                let meals = response.meals;
                let cards = '';
                meals.forEach((meal) => {
                    cards += showCards(meal);
                });

                filterResults.innerHTML = cards;
            });
}