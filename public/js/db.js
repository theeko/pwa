//ofline data
db.enablePersistence().catch(e => {
  if (e.code === "failed-precondition") {
    //probably multiple tabs opened at once
    console.log("persistance failed");
  } else if (e.code === "unimplemented") {
    // lack of browser support
    console.log("persistance is not available");
  }
});

db.collection("recipes").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    // change.doc.data(); change.doc.id
    if (change.type === "added") {
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector("form");
form.addEventListener("submit", event => {
  event.preventDefault();

  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };

  db.collection("recipes")
    .add(recipe)
    .catch(e => console.log(e));

  form.title.value = "";
  form.ingredients.value = "";
});

const recipeContainer = document.querySelector(".recipes");
recipeContainer.addEventListener("click", e => {
  if (e.target.matches("i[data-id]")) {
    const id = e.target.getAttribute("data-id");
    db.collection("recipes")
      .doc(id)
      .delete();
  }
});

// remove recipe from dom
function removeRecipe(id) {
  let recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
}
