function hide(element) {
  element.style = "display:none;";
}

function show(element) {
  element.style = "";
}

function showFirstPage() {
  show(firstpage);
  hide(secondpage);
}

function showSecondPage() {
  show(secondpage);
  hide(firstpage);
}

function switchPage() {
  if (isFirstPage) {
    showSecondPage();
    isFirstPage = !isFirstPage;
  } else {
    showFirstPage();
    isFirstPage = !isFirstPage;
  }
}

var secondpage = document.querySelector("#secondPageCv");
var firstpage = document.querySelector("#firstPageCv");
var forwardButton = document.querySelector("#forwardCv");
var backButton = document.querySelector("#backCv");

var isFirstPage = true;
hide(secondpage);

firstpage.addEventListener("click", switchPage);
forwardButton.addEventListener("click", switchPage);
backButton.addEventListener("click", switchPage);
secondpage.addEventListener("click", switchPage);
