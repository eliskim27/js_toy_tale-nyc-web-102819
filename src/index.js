const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyFormActual = document.querySelector('.add-toy-form')
const toyCollection = document.getElementById('toy-collection')

let addToy = false

getToys()

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

function getToys(){
  return fetch(`http://localhost:3000/toys`)
  .then(function(response) {
    return response.json() 
  })
  .then(function(toys) {
    toys.forEach(function(toy){
      let newToy = document.createElement('div')
      newToy.class = "card"
      newToy.dataset.id = `${toy.id}`
        newToy.innerHTML = `
        <h2>${toy.name}</h2>
        <img src=${toy.image}></img>
        <p>${toy.likes}</p>
        <button class="like-btn">Like ❤️</button>
        `
      toyCollection.append(newToy)
    })
  })
}

toyFormActual.addEventListener('submit', function(e){
  e.preventDefault()
  let input = toyForm.querySelectorAll('input')
  addNewToy(input)
  toyFormActual.reset()
  addToy = false
  toyForm.style.display = 'none'
})


function addNewToy(input){
  let newToy = document.createElement('div')
  newToy.class = "card"
  newToy.innerHTML = `
  <h2>${input[0].value}</h2>
  <img src=${input[1].value}></img>
  <p>0</p>
  <button class="like-btn">Like ❤️</button>
  `
  toyCollection.append(newToy)
  newToy.name = `${input[0].value}`
  newToy.image = `${input[1].value}`
  newToy.likes = 0
  addNewToyToDB(newToy)
}

function addNewToyToDB(newToy){
  fetch(`http://localhost:3000/toys`,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(newToy)
  })
}

toyCollection.addEventListener('click', function(e){
  e.target.parentNode.querySelector('p').innerText = parseInt(e.target.parentNode.querySelector('p').innerText) + 1
  updateLikesInDB(e.target.parentNode.dataset.id, e.target.parentNode.querySelector('p').innerText)
})

function updateLikesInDB(id, likes){
  fetch (`http://localhost:3000/toys/${id}`,{
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      accepts: "application/json"
    },
    body:
      JSON.stringify({likes})
  })
}
