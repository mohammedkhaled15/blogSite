document.addEventListener("DOMContentLoaded", () => {
  const searchBtns = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");
  const searchClose = document.getElementById("searchClose");

  for (let i = 0; i < searchBtns.length; i++) {
    searchBtns[i].addEventListener("click", () => {
      searchBar.style.visibility = "visible";
      searchBar.classList.add("open");
      searchBar.setAttribute("aria-expanded", true);
      searchInput.focus();
    });
  }
  searchClose.addEventListener("click", () => {
    searchBar.style.visibility = "hidden";
    searchBar.classList.remove("open");
    searchBar.setAttribute("aria-expanded", false);
  });
});
