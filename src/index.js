document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollectionDiv = document.getElementById("toy-collection");

  let addToy = false;

  addBtn.addEventListener("click", () => {
    // Hide & seek with the form
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch toys on page load
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        createToyCard(toy);
      });
    });

  // Handle form submission to add a new toy
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;
    const likes = 0;

    const newToy = {
      name,
      image,
      likes
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        createToyCard(toy);
        toyForm.reset(); // Clear the form
      });
  });

  function createToyCard(toy) {
    const toyCollectionDiv = document.getElementById("toy-collection");

    const toyCardDiv = document.createElement("div");
    toyCardDiv.className = "card";

    const toyNameH2 = document.createElement("h2");
    toyNameH2.textContent = toy.name;

    const toyImage = document.createElement("img");
    toyImage.src = toy.image;
    toyImage.className = "toy-avatar";

    const toyLikesP = document.createElement("p");
    toyLikesP.textContent = `${toy.likes} Likes`;

    const likeButton = document.createElement("button");
    likeButton.className = "like-btn";
    likeButton.id = toy.id;
    likeButton.textContent = "Like ❤️";

    toyCardDiv.append(toyNameH2, toyImage, toyLikesP, likeButton);
    toyCollectionDiv.append(toyCardDiv);

    // Add event listener to the like button
    likeButton.addEventListener("click", () => {
      increaseLikes(toy.id, toyLikesP);
    });
  }

  function increaseLikes(toyId, toyLikesP) {
    const newLikes = parseInt(toyLikesP.textContent) + 1;

    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
      .then(response => response.json())
      .then(() => {
        toyLikesP.textContent = `${newLikes} Likes`;
      });
  }
});
