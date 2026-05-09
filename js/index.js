const productName = document.getElementById("product-name");
const productSpiel = document.getElementById("product-spiel");
const reviewCount = document.getElementById("review-count");
const ratingVal = document.getElementById("rating-value");
const starsContainer = document.getElementById("stars-container");
const productGallery = document.getElementById("product-gallery");
const productImgMain = document.getElementById("product-img-main");
const colorSwatches = document.getElementById("color-swatches");
const colorOption = document.getElementById("color-option");
// console.log(colorSwatches)

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
    const data = await fetchProductDetails("voyager-hoodie");
    console.log(data);

    productName.innerText = data.name;
    productSpiel.innerText = data.description;
    reviewCount.innerText = data.reviews;
    ratingVal.innerText = Number(data.rating).toFixed(1);
    starsContainer.innerHTML = renderStars(data.rating);
    productGallery.innerHTML = renderProductImgsList(data.images);
    productImgMain.src = data.images[0].image_url;

    colorSwatches.innerHTML = renderColorSwatches(data.colors);
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
  return dataImages
    .map(
      (imageData, index) => `
  <div class="flex-shrink-0">
    <img tabindex="0" data-index="${index}" data-img-url="${imageData.image_url}" class="w-20 object-cover rounded-lg md:w-[188px] xl:w-40 md:h-[190px] focus:border-indigo-600 focus:border-[3px]" src="${imageData.image_url}" alt="product image">
  </div>`,
    )
    .join("");
}

function renderColorSwatches(colorOptions) {
  return colorOptions
    .map(
      (color, index) => `
    <label for="${color}" class="relative">
        <input
        ${index === 0 ? "checked" : ""}
        class="peer sr-only"
        type="radio"
        name="color"
        id="${color}"
        value="${color}"
        data-color-index="${index}"
        />
        <i
        class="ri-check-fill text-[38px] text-[${color}] bg-[${color}] rounded-full p-[2.33px] hover:outline hover:outline-indigo-200 hover:outline-[2.33px]
        peer-active:outline peer-active:outline-indigo-50 peer-active:outline-[9px] peer-checked:text-white peer-checked:outline-1 peer-checked:outline-indigo-600 peer-checked:outline-none"
        ></i>
        
        <div
        class="peer-disabled:absolute peer-disabled:inset-0 peer-disabled:flex peer-disabled:items-center peer-disabled:justify-center"
        >
        <span
        class="peer-disabled:block w-11 h-0.5 bg-neutral-600 rotate-[135deg]"
        ></span>
        </div>
    </label>
    `,
    )
    .join("");
}

// Event listeners
productGallery.addEventListener("click", (e) => {
  if (e.target.matches("img")) {
    productImgMain.src = e.target.src;
  }
});