const images = [];
let currentIndex = -1;

const imgEl = document.getElementById('image');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

async function getImage() {
  const res = await fetch('https://dog.ceo/api/breeds/image/random');
  const data = await res.json();
  console.log(data);

  return data.message;
}

async function showNext() {
  if (currentIndex < images.length - 1) {
    currentIndex++;
    imgEl.src = images[currentIndex];
  } else {
    const newImage = await getImage();
    images.push(newImage);
    currentIndex++;
    imgEl.src = newImage;
  }
}

function showPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    imgEl.src = images[currentIndex];
  }
}

// Event listeners
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// Start carousel by showing the first image
showNext();

// Auto-advance every 3 seconds
setInterval(() => {
  showNext();
}, 10000);
