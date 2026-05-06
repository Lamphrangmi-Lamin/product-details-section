const productName = document.getElementById("product-name");
const productSpiel = document.getElementById("product-spiel");
const reviewCount = document.getElementById("review-count");
const ratingVal = document.getElementById("rating-value");
const starsContainer = document.getElementById("stars-container");
const productGallery = document.getElementById("product-gallery");
const productImgMain = document.getElementById("product-img-main");
// console.log(productImgMain)

async function fetchProductDetails(productId) {
  const baseUrl =
    "https://www.greatfrontend.com/api/projects/challenges/e-commerce/products/";
  const response = await fetch(`${baseUrl}${productId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function main() {
  try {
    const data = await fetchProductDetails("elemental-sneakers");
    console.log(data);

    productName.innerText = data.name;
    productSpiel.innerText = data.description;
    reviewCount.innerText = data.reviews;
    ratingVal.innerText = Number(data.rating).toFixed(1);
    starsContainer.innerHTML = renderStars(data.rating);
    productGallery.innerHTML = renderProductImgsList(data.images);
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

// Rendering functions
function renderProductImgsList(dataImages) {
  return dataImages.map((imageData) => `
  <div class="flex-shrink-0">
    <img class="w-20 object-cover rounded-lg md:w-[188px] xl:w-40 md:h-[190px]" src="${imageData.image_url}" alt="product image">
  </div>`)
  .join("");
}
