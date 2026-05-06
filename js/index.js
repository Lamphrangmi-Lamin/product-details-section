const productName = document.getElementById("product-name");
const productSpiel = document.getElementById("product-spiel");
const reviewCount = document.getElementById("review-count");
const ratingVal = document.getElementById("rating-value");
const starsContainer = document.getElementById("stars-container");

async function fetchProductDetails(productId) {
  const baseUrl =
    "https://www.greatfrontend.com/api/projects/challenges/e-commerce/products/";
  const response = await fetch(`${baseUrl}${productId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// console.log(fetchData(url));
async function main() {
  try {
    const data = await fetchProductDetails("elemental-sneakers");
    console.log(data);

    productName.innerText = data.name;
    productSpiel.innerText = data.description;
    reviewCount.innerText = data.reviews;
    ratingVal.innerText = Number(data.rating).toFixed(1);
    starsContainer.innerHTML = renderStars(data.rating);
  } catch (error) {
    console.log(error);
  }
}

main();

// Helper functions
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = "";

  //Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<i class="ri-star-fill text-yellow-400"></i>`;
  }

  //Half star if needed
  if (hasHalfStar) {
    starsHTML += `<i class="ri-star-half-fill text-yellow-400"></i>`;
  }

  //Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<i class="ri-star-fill text-gray-200"></i>`;
  }

  return starsHTML;
}
