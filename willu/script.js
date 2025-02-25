const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const heading = document.querySelector("h1");
const buttonsContainer = document.querySelector(".buttons");

let scaleFactor = 1;

noButton.addEventListener("click", () => {
    scaleFactor *= 1.5; 
    yesButton.style.transform = `scale(${scaleFactor})`;

    const offset = scaleFactor * 20;
    heading.style.transform = `translateY(-${offset}px)`;
    noButton.style.transform = `translateX(${offset}px)`;
    buttonsContainer.style.gap = `${50 + offset}px`; 
});
