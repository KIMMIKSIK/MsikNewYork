let apiHTML = "";
let names = "sport";
let articles = [];
let totalPages = 0;
let page = 1;
let pageNation = document.getElementById("page-nation");
let search = document.getElementById("search");
let input = document.querySelector(".input-tag");
let category = document.querySelectorAll("#menu-list button");
let goButton = document.getElementById("go-button");
let sideMenu = document.getElementById("side-menu");
let sideButton = document.querySelectorAll(".side-menus button");
let sideBar = document.querySelector(".side-background");
let underLine = document.querySelector(".under-line");
let mainNewsBox = document.querySelector(".all-contents");
let allPages = document.querySelector(".pagination");

let url = new URL(
  `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${names}&page_size=10`
);

let getNews = async () => {
  try {
    url.searchParams.set("page", page);
    let header = { "x-api-key": "rSC6PY_thvl0cPhKltHVKxFmvW3qt6zwpWZTw3RVlSc" };
    let response = await fetch(url, { headers: header });
    data = await response.json();
    articles = data.articles;
    totalPages = data.total_pages;
    page = data.page;
    console.log(page, totalPages);
    console.log("response는", response);
    console.log("data는", data);
    console.log("articles는", articles);

    render();
  } catch (error) {
    mainNewsBox.innerHTML = `<div class="alert alert-danger" role="alert">
    검색결과가 존재하지 않습니다.  Msik올림
  </div>`;
  }
};

getNews();

//이벤트 리스너에 의해 작동되는 함수들 모음

let goGetSearch = async () => {
  names = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${names}&page_size=10`
  );
  getNews();
};

function holderOption() {
  input.placeholder = "";
}
function valueOption() {
  input.value = "";
}

function addOption() {
  let hiddenOption = document.getElementById("hidden-option");

  if (hiddenOption.style.display == "none") {
    hiddenOption.style.display = "inline";
  } else {
    hiddenOption.style.display = "none";
  }
}
async function searchGo() {
  category.forEach((item) => {
    item.style.background = "none";
  });
  let query = input.value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?&countries=KR&page_size=10`
  );
  url.searchParams.set("q", query);
  getNews();
}
let checkCondition = function () {
  category.forEach((item) => {
    item.style.background = "none";
  });

  event.target.style.background = "beige";
};

let openSide = function () {
  sideBar.style.width = "300px";
};

let menuClear = function () {
  sideBar.style.width = "0px";
};

let underLineSetting = function () {
  underLine.style.width = event.currentTarget.offsetWidth + "px";
  underLine.style.top =
    event.currentTarget.offsetHeight + event.currentTarget.offsetTop + "px";
  underLine.style.left = event.currentTarget.offsetX + "px";
};

//이벤트 리스너 모음
//1. header의 카테고리들 이벤트
category.forEach((item) => {
  item.addEventListener("click", goGetSearch);
  item.addEventListener("click", checkCondition);
});
sideButton.forEach((item) => {
  item.addEventListener("click", goGetSearch);
  item.addEventListener("click", underLineSetting);
});
goButton.addEventListener("click", searchGo);

//2. header돋보기 선택 이벤트
search.addEventListener("click", addOption);
input.addEventListener("click", valueOption);
//3. header에 input 태그 placeholder =""를 위한 이벤트
input.addEventListener("click", holderOption);
//4. sideMenu bar를 작동시키는 이벤트
sideMenu.addEventListener("click", openSide);

let render = () => {
  let art = articles;
  let newsList = [];

  newsList = art
    .map((news) => {
      if (news.media == "" || news.media == null) {
        news.media =
          "https://3.bp.blogspot.com/-ZKBbW7TmQD4/U6P_DTbE2MI/AAAAAAAADjg/wdhBRyLv5e8/s1600/noimg.gif";
      }
      return `<section class="main-contents row">
        <div class="content col-4">
          <img
            src="${news.media}"
          />
        </div>
        <div class="col-8">
          <h2>${news.title}</h2>
          <p>
          ${
            news.summary.length >= 200
              ? news.summary.substring(0, 200) + "..."
              : news.summary.length == 0
              ? "내용없음"
              : news.summary
          }
          </p>
          <div class="man">${moment(news.published_date)
            .startOf("hour")
            .fromNow()} ${news.rights}</div>
        </div>
      </section>`;
    })
    .join("");

  mainNewsBox.innerHTML = newsList;

  renderPageNation();
};

function renderPageNation() {
  let pageHTML = "";
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;

  if (pageGroup != 1) {
    pageHTML += `<li class="page-item">
  <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
    <span aria-hidden="true">&laquo;</span>
  </a>
 </li><li class="page-item">
 <a class="page-link" href="#" aria-label="Previous"  onclick="moveToPage(${
   page - 1
 })">
   <span aria-hidden="true">&lt;</span>
 </a>
 </li>`;
  }

  for (let i = first; i <= last; i++) {
    pageHTML += `<li class="page-item ${
      i == page ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  if (last < totalPages) {
    pageHTML += `<li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
      page + 1
    })">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li><li class="page-item">
  <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${totalPages})">
    <span aria-hidden="true">&raquo;</span>
  </a>
</li>`;
  }

  allPages.innerHTML = pageHTML;
}

let moveToPage = (i) => {
  page = i;

  getNews();
};
