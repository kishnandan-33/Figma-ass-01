// // Mobile menu

// const menuBtn = document.getElementById("menuBtn");
// const nav = document.querySelector(".navbar nav");

// menuBtn.addEventListener("click", function () {
//     if (nav.style.display === "flex") {
//         nav.style.display = "none";
//     } else {
//         nav.style.display = "flex";
//         nav.style.flexDirection = "column";
//         nav.style.position = "absolute";
//         nav.style.top = "80px";
//         nav.style.right = "5%";
//         nav.style.background = "#f7f7f4";
//         nav.style.padding = "20px";
//         nav.style.gap = "20px";
//     }
// });


// // Recommendations

// const recommendations = [
//     {
//         text: "Working with this developer was a great experience. The attention to detail and commitment to quality were impressive.",
//         name: "John Doe",
//         role: "Product Designer"
//     },
//     {
//         text: "Very professional approach and excellent understanding of modern frontend development.",
//         name: "Sarah Smith",
//         role: "UI/UX Designer"
//     },
//     {
//         text: "Clean implementation, responsive design and great communication throughout the project.",
//         name: "Alex Johnson",
//         role: "Project Manager"
//     }
// ];

// let current = 0;

// const recommendationText =
//     document.getElementById("recommendationText");

// const recommendationName =
//     document.getElementById("recommendationName");

// const recommendationRole =
//     document.getElementById("recommendationRole");


// function showRecommendation() {

//     const item = recommendations[current];

//     recommendationText.textContent = item.text;
//     recommendationName.textContent = item.name;
//     recommendationRole.textContent = item.role;
// }


// document.getElementById("next").addEventListener("click", function () {

//     current++;

//     if (current >= recommendations.length) {
//         current = 0;
//     }

//     showRecommendation();
// });


// document.getElementById("prev").addEventListener("click", function () {

//     current--;

//     if (current < 0) {
//         current = recommendations.length - 1;
//     }

//     showRecommendation();
// });


// // Contact form

// const form = document.getElementById("contactForm");
// const formMessage = document.getElementById("formMessage");

// form.addEventListener("submit", function (event) {

//     event.preventDefault();

//     const name = document.getElementById("name").value;

//     formMessage.textContent =
//         `Thanks ${name}! Your message has been received.`;

//     form.reset();
// });