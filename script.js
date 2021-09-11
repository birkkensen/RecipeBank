var populatePost = (post) => {
  document.querySelector('.post-header').innerHTML = `
  <h6><a href="../index.html">Blog</a></h6>
  <h3>${post.title}</h3>
  <div class="spacer-16"></div>
  <p class="paragraph-4 margin-b-2x">${post.shortSummary}</p>
  <div class="spacer-16"></div>
  <!-- Social-media -->
  <div class="social-media">
    <p>September 7, 2021 - 5 min. read</p>
    <div class="spacer-16 hide-desktop"></div>
    <div class="social-media__icons">
      <i class="fab fa-instagram"></i>
      <i class="fab fa-github"></i>
      <i class="fab fa-linkedin"></i>
    </div>
  </div>
  <div class="spacer-32"></div>
  <img src="${post.previewImage}" alt="Random">
  <div class="spacer-72"></div>`

  var content = post.content;

  for (i = 0; i < content.length; i++) {
    document.querySelector('.post-body').innerHTML += content[i];
  }
}


var findQuery = (param) => {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

var getPosts = () => {
  fetch('https://raw.githubusercontent.com/birkkensen/blog-json/main/blog-posts')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      createArticle(data[i]);
      console.log(data[i]);
    }
  });
}

var getPostFromId = () => {
  var id = JSON.parse(findQuery('id'));

  fetch('https://raw.githubusercontent.com/birkkensen/blog-json/main/blog-posts')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        populatePost(data[i])
      }
    }
  });
}

var createArticle = (post) => {
  var articleWrapper = document.querySelector('.articles-wrapper');
  articleWrapper.innerHTML += `<a href="./posts/posts.html?id=${post.id}" class="articles-wrapper__article">
  <div class="articles-wrapper__article__body">
    <h4>${post.title}</h4>
    <br>
    <p class="paragraph-6">${post.timeStamp} - ${post.readTime}</p>
  </div>
  <div class="spacer-16 hide-desktop"></div>
  <img class="articles-wrapper__article__image" src="${post.previewImage}"
    alt="Random">
</a>`;
}