const getWateringJar = document => document.getElementById("wateringJar");

const flickerImage = function() {
  const wateringJar = getWateringJar(document);
  wateringJar.onclick = () => {
    wateringJar.style.visibility = "hidden";
    setTimeout(() => {
      wateringJar.style.visibility = "visible";
    }, 1000);
  };
};

window.onload = flickerImage;
