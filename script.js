
// toggle menu
$('.menu-ham').click(toggleMenu);
$('.menu-close').click(toggleMenu);
console.log("aa");
console.log("bb");
document.addEventListener('click', async function(e) {
    try {
        // filter category button
        if(e.target.classList.contains('btn-filter')){
            const filterButtons = $('.buttons > .btn-filter');
            filterButtons.each((index, filterButton) => {
                if($(filterButton).hasClass('active')){
                    $(filterButton).removeClass('active');
                }
            });
            e.target.classList.add('active');

            if($('.category-btn').hasClass('active')) {
                showFilter("c=",e.target.innerHTML);
            } else if ($('.area-btn').hasClass('active')){
                showFilter("a=",e.target.innerHTML);
            } else {
                showFilter("i=",e.target.innerHTML);
            }
        }

        if(e.target.classList.contains('card')){
            await getMealDetail(e.target.dataset.idmeal);
            document.body.style.position = 'fixed';
            document.body.style.top = `-${window.scrollY}px`;
            $('.modal-wrapper').addClass('active');

        }

        if(e.target.classList.contains('modal-close')) {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
            $('.modal-wrapper').removeClass('active');
        }

    } catch(err) {
        console.log(err);
    }
});

// home button
$('.home-btn').click( (e) => {
    $('.buttons').html('');
    $('.filter-result').html('');
    toggleActive(e);
});

// get category filter button
$('.category-btn').click( (e) => {
    toggleActive(e);
    getButtons("c=list");
});

// get area filter button
$('.area-btn').click( (e) => {
    toggleActive(e);
    getButtons("a=list");
});

// get ingredient filter button
$('.ingredient-btn').click( (e) => {
    toggleActive(e);
    getButtons("i=list");
});

// request post API search by name
$('form').submit( (e) => {
    e.preventDefault();
    const formElements = document.querySelector('form').elements;
    const inputValue = formElements[0].value;
    searchMeal(inputValue);
});

// random button
$('.random-btn').click( () => {
    try {
        $('.buttons').removeClass('active');
        randomMeal();
    } catch(err) {
        console.log(err);
    }
});

function toggleActive(e) {
    $('.menu').each((index, menu) => {
        if($(menu).hasClass('active')){
            $(menu).removeClass('active');
        }
    });
    e.target.classList.add('active');
    $('.filter-result').html('');
    $('.buttons').addClass('active');
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
        if(meal[0][`strIngredient`+i] === "" || meal[0][`strIngredient`+i] === null) {
            i = 21;
        } else {
            ingredients.push([meal[0][`strIngredient`+i], meal[0][`strMeasure`+i]])
        }
        i++;
    }

    ingredients.forEach((ingredient) => {
        list += `<li>${ingredient[1]} ${ingredient[0]}</li>`
    });

    return `<div class="modal">
                <div class="image-wrapper" style="background: url(${meal[0].strMealThumb}) no-repeat; background-size: cover;"></div>
                <h3 class="menu-name">${meal[0].strMeal}</h3>
                <span class="separator line-top"></span>
                <div class="modal-content">
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
                </div>
                <span class="separator line-bottom"></span>
                <button class="modal-close">Close</button>
            </div>`;
}

function toggleMenu() {
    $('.menu-close').toggleClass('active');
    $('.nav-fluid').toggleClass('active');
    $('nav').toggleClass('active');
    $('.menu-ham').toggleClass('active');
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
                console.log(meals);
                meals.forEach(meal => {
                    cards += showCards(meal);
                });

                //clear buttons filter
                $('.buttons').html('');
                

                breakpointColumn(meals.length);
                return $('.filter-result').html(cards);
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

                //clean the filter results and buttons
                $('.buttons').html('');
                $('.filter-result').html('');

                breakpointColumn(1);
                return $('.filter-result').html(cards);
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

                $('.filter-result').html('');
                return $('.buttons').html(buttons);
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

                breakpointColumn(meals.length);
                $('.filter-result').html(cards);
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
                $('.modal-wrapper').html(showMealDetail(meal));
            })
}

function breakpointColumn(count) {
    if(window.screen.width <= 520 || $(window).width() <= 520 || $(document).width() <= 520 || count <= 1) {
        $('.filter-result').css('grid-template-areas', '"column1"');
        $('.filter-result').css('gap', '40px 0');
    } else if( (window.screen.width > 520 && window.screen.width <= 730) || ($(window).width() > 520 && $(window).width() <= 730) || ($(document).width() > 520 && $(document).width() <= 730) || count == 2) {
        $('.filter-result').css('grid-template-areas', '"column1 column2"');
        $('.filter-result').css('gap', '40px');
    } else if( (window.screen.width > 730 && window.screen.width <= 950) || ($(window).width() > 730 && $(window).width() <= 950 ) || ($(document).width() > 730 && $(document).width() <= 950) || count == 3) {
        $('.filter-result').css('grid-template-areas', '"column1 column2 column3"');
        $('.filter-result').css('gap', '50px');
    } else {
        $('.filter-result').css('grid-template-areas', '"column1 column2 column3 column4"');
        $('.filter-result').css('gap', '70px');
    }
}
