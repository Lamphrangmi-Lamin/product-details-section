const url = "https://www.greatfrontend.com/api/projects/challenges/e-commerce/products/voyager-hoodie";

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// console.log(fetchData(url));
async function main() {
  try {
    const data = await fetchData(url);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

main();
