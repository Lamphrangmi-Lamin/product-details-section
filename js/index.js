const productName = document.getElementById("product-name");
const productSpiel = document.getElementById("product-spiel");
const reviewCount = document.getElementById("review-count");
const ratingVal = document.getElementById("rating-value");
const starsContainer = document.getElementById("stars-container");
const productGallery = document.getElementById("product-gallery");
const productImgMain = document.getElementById("product-img-main");
const colorSwatches = document.getElementById("color-swatches");
const colorOption = document.getElementById("color-option");
const accordionContainer = document.getElementById("accordion-container");
const sizesSelection = document.getElementById("sizes-selection");

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

    productName.innerText = data.name;
    productSpiel.innerText = data.description;
    reviewCount.innerText = data.reviews;
    ratingVal.innerText = Number(data.rating).toFixed(1);
    starsContainer.innerHTML = renderStars(data.rating);

    const defaultColor = data.images[0]?.color;
    const defaultFilteredImages = filterProductImgs(data.images, defaultColor);
    productGallery.innerHTML = renderProductImgsList(defaultFilteredImages);
    productImgMain.src = defaultFilteredImages[0]?.image_url;

    colorSwatches.innerHTML = renderColorSwatches(data.colors);
    accordionContainer.innerHTML = renderInfo(data.info);

    sizesSelection.innerHTML = renderSizeOptions(data.sizes);

    // Event listeners
    const accordionHeaders =
      accordionContainer.querySelectorAll("[aria-controls]");
    accordionHeaders.forEach((header) =>
      header.addEventListener("click", () => toggleAccordion(header)),
    );

    colorSwatches.addEventListener("change", (e) => {
      const clickedElem = e.target.matches('input[type="radio"]');
      if (clickedElem) {
        const color = e.target.value;
        const filteredImgs = filterProductImgs(data.images, color);
        productImgMain.src = filteredImgs[0].image_url;
        productGallery.innerHTML = renderProductImgsList(filteredImgs);
      }
    });
    // Error handling
  } catch (error) {
    console.log(error);
  }
}

main();

// Rendering functions
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
    <img tabindex="0" data-index="${index}" class="w-20 object-cover rounded-lg md:w-[188px] xl:w-40 md:h-[190px] focus:border-indigo-600 focus:border-[3px]" src="${imageData.image_url}" alt="product image">
  </div>`,
    )
    .join("");
}

function renderColorSwatches(colorOptions) {
  return colorOptions
    .map(
      (color, index) => `
    <label for="${color}" class="color-option relative">
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

function renderInfo(infoData) {
  return infoData
    .map(
      (info, index, arr) => `
      <div class="mb-8">
        <button
        id="header${index}"
        type="button"
        aria-expanded="false"
        aria-controls="panel${index}"
        class="flex justify-between w-full mb-2"
        >
        <span class="text-lg font-medium text-neutral-900">${info.title}</span>
        <i
        class="ri-add-circle-line text-xl text-neutral-400"
        ></i>
        </button>
        <div id="panel${index}" class="hidden" aria-labelledby="header${index}" role="region">
        <ul class="text-neutral-600 list-disc ml-5 max-w-64 md:max-w-[95%]">
        ${info.description
          .map(
            (item) => `
            <li>${item}</li>
        `,
          )
          .join("")}
        </ul>
        </div>
        ${index !== arr.length - 1 ? '<hr class="mt-8" />' : ""}
        </div>`,
    )
    .join("");
}

function renderSizeOptions(sizesArr) {
  return sizesArr
    .map(
      (size) => `
    <div class="flex justify-center items-center">
    <input
    class="sr-only peer"
    id="size-${size}"
    type="radio"
    name="size"
    value="${size}"
    />
    <label
    class="px-5 py-3 rounded ring-1 ring-neutral-200 peer-checked:ring-indigo-600 hover:bg-neutral-50 hover:text-neutral-950 peer-focus:bg-neutral-50 peer-focus:text-neutral-950 peer-disabled:bg-neutral-100 peer-disabled:text-neutral-400 peer-disabled:drop-shadow-none peer-disabled:ring-0 uppercase"
    for="size-${size}"
    >${size[0].toLowerCase() == "x" ? size : size[0]}</label
    >
    </div>
    `,
    )
    .join("");
}

// Helper functions
function toggleAccordion(header) {
  const panelId = header.getAttribute("aria-controls");
  const activePanel = document.getElementById(panelId);
  const activeIcon = header.querySelector("i");
  const isExpanded = header.getAttribute("aria-expanded") === "true";

  header.setAttribute("aria-expanded", !isExpanded);
  activePanel.classList.toggle("hidden");
  activeIcon.classList.toggle("ri-indeterminate-circle-line");
  activeIcon.classList.toggle("ri-add-circle-line");
}

function filterProductImgs(imagesArr, color) {
  return imagesArr.filter((img) => img.color === color);
}

// Event listeners
productGallery.addEventListener("click", (e) => {
  if (e.target.matches("img")) {
    productImgMain.src = e.target.src;
  }
});
