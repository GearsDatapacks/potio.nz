"use strict";

var START_INGREDIENTS = ['air', 'earth', 'fire', 'water'];

// Copy the starting ingredients
var discoveredIngredients = START_INGREDIENTS.slice();

var potion = [];

function chooseIngredient (ingredient) {
  var message;

  potion.push(ingredient);

  if (potion.length === 1) {
    //message = `<strong>${ingredient}</strong> + ?`;
    //message = '<strong>' + ingredient + '</strong> + ?';
    message = ingredient + ' + ?';
  }

  if (potion.length === 2) {
    var ingredient1 = potion[0];
    var ingredient2 = potion[1];
    var child = lookupResult(ingredient1, ingredient2);

    if (child) {
      updateFoundElements(child);
      //message = `<strong>${ingredient1}</strong> + <strong>${ingredient2}</strong> = <strong>${child}</strong>`;
      //message = '<strong>' + ingredient1 + '</strong> + <strong>' + ingredient2 + '</strong> = <strong>' + child + '</strong>';
      message = ingredient1 + ' + ' + ingredient2 + ' = ' + child;
    }

    else {
      //message = `<strong>${ingredient1}</strong> + <strong>${ingredient2}</strong> = nothing`;
      //message = '<strong>' + ingredient1 + '</strong> + <strong>' + ingredient2 + '</strong> = nothing';
      message = ingredient1 + ' + ' + ingredient2 + ' = nothing';
    }

    // Empty the `potion` array
    potion.splice(0, 2);

    // Refresh the displayed ingredients
    displayIngredients();
  }

  displayPotion(message);
}

function lookupResult (ingredient1, ingredient2) {
  var result;

  POTIONS.some(function (combination) {
    var test1 = combination[0];
    var test2 = combination[1];

    if (
      (ingredient1 === test1 && ingredient2 === test2) ||
      (ingredient2 === test1 && ingredient1 === test2)
    ) {
      result = combination[2];
      return true;
    }
  });

  return result || false;
}

// Write out found ingredients
function displayIngredients () {
  var list = document.getElementById('discovered');
  var listItems = '';

  discoveredIngredients.forEach(function (ingredient) {
    var hasPotential = ingredientHasPotential(ingredient);
    var className = hasPotential ? 'potential' : '';

    //listItems += `<li class="${className}">${ingredient}</li>`;
    listItems += '<li class="' + className + '">' + ingredient + '</li>';
  });
  list.innerHTML = listItems;

  displayCount();
}

function addListeners () {
  var discoveredList = document.getElementById('discovered');

  discoveredList.addEventListener('click', function (event) {
    var target = event.target;
    if (target && target.nodeName === 'LI') {
      var ingredient = event.target.textContent;
      chooseIngredient(ingredient);
      target.classList.add('chosen');
    }
  });

  // When header off-screen, enable scrollable ingredients
  // var headerElem = document.querySelector('body > header');
  // var headerHeight = headerElem.clientHeight;
  // var boardElem = document.getElementById('board');
  // var scrollingEnabled = false;

  // window.addEventListener('scroll', function (event) {
  //   var scrollY = document.body.scrollTop;
  //   var headerIsVisible;

  //   if (!scrollingEnabled) {
  //     headerIsVisible = scrollY < headerHeight;
  //   }

  //   else {
  //     headerIsVisible = scrollY === 0;
  //   }

  //   console.log('scroll', {scrollY, headerHeight, headerIsVisible});

  //   if (headerIsVisible && scrollingEnabled) {
  //     boardElem.classList.remove('scrollable');
  //     headerElem.classList.add('shiftY');
  //     scrollingEnabled = false;
  //   }

  //   else if (!headerIsVisible && !scrollingEnabled) {
  //     boardElem.classList.add('scrollable');
  //     headerElem.classList.remove('shiftY');
  //     scrollingEnabled = true;
  //   }
  // });
}

function displayPotion (message) {
  var el = document.getElementById('potion');
  el.innerHTML = message;
}

function displayMessage (message) {
  var el = document.getElementById('message');
  el.innerHTML = message;
}

function displayStartMessage () {
  //displayMessage(`You have ${discoveredIngredients.length} ingredients. Mix two together to make some more.`);
  displayMessage('You have ' + discoveredIngredients.length + ' ingredients. Mix two together to make some more.');
}

function uniqueIngredients (potions) {
  // ['air', 'earth', 'fire', 'water'];
    var ingredients = START_INGREDIENTS.slice();

    // e.g. `potion = ['fire',  'water',  'steam']`
    potions.forEach(function (potion) {
        var child = potion[2];
        if (ingredients.indexOf(child) === -1) {
             ingredients.push(child);
        }
    });
    return ingredients.sort();
}

var allIngredients = uniqueIngredients(POTIONS);

function displayCount () {
  var foundCount = discoveredIngredients.length;
  var totalCount = allIngredients.length;
  var el = document.getElementById('count');
  //el.textContent = `${foundCount} of ${totalCount}`;
  el.textContent = foundCount + ' of ' + totalCount;
}

function updateFoundElements (child) {
  if (discoveredIngredients.indexOf(child) === -1) {
    discoveredIngredients.push(child);
    discoveredIngredients.sort();
    save();
    return true;
  }
  return false;
}

function displayAll () {
  discoveredIngredients = allIngredients.slice()
  displayIngredients();
}

function ingredientHasPotential (ingredient) {
  return POTIONS.some(function (potion) {
    if (potion[0] === ingredient || potion[1] === ingredient) {
      var child = potion[2];
      if (discoveredIngredients.indexOf(child) === -1) {
        return true;
      }
    }
  });
}


var STORAGE_KEY = 'alchemy';
function save () {
  localStorage[STORAGE_KEY] = JSON.stringify(discoveredIngredients);
}

function restore () {
  if (STORAGE_KEY in localStorage) {
    discoveredIngredients = JSON.parse(localStorage[STORAGE_KEY]);
  }

  displayIngredients();
  displayStartMessage();
}


// Activate!

addListeners();
restore();



////////////////////



// ORIGINAL PROGRAM


// function attemptChild () {
//   var ingredient1 = prompt('What is the first ingredient?');
//   var ingredient2 = prompt('What is the second ingredient?');
//   var message;

//   if (!ingredient1 || !ingredient2) {
//     return;
//   }

//   var child = lookupResult(ingredient1, ingredient2);

//   if (child) {
//     var result = updateFoundElements(child);
//     if (result) {
//       displayIngredients();
//     }

//     message = `You have created ${child} with ${ingredient1} and ${ingredient2}`;
//   }

//   else {
//     message = `${ingredient1} and ${ingredient2} does not make anything`;
//   }

//   // Write out created child
//   displayMessage(message);

//   attemptChild();
// }



////////////////////


// NOTES

/*
  Display all known elements

  Allow adding 2 elements:
  - typing ingredient text

  When 2 elements are added:
  - look up the result
  - show/alert the result or no result

  If result:
  - add to `elements` array
  - update display of all known elements
*/



// start: fire water air earth

// fire water steam
// air water bubbles
// air fire campfire
// air earth  dustcloud
// fire earth lava
// earth water bog
// water water flood
// fire fire fireball
// air air pressure
// earth earth mountain
