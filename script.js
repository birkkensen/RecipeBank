let featuredPost = []

var populatePost = (post) => {
  const myDate = post.date = new Date()
  myDate.toISOString().split('T')[0]
  document.querySelector('.post-header').innerHTML = `
  <h6>${post._embedded["wp:term"][0][0].name}</h6>
  <h3>${post.title.rendered}</h3>
  <div class="spacer-16"></div>
  <div class="social-media">
  <p>${formatDate(myDate)}</p>
  <div>
  <i class="fas fa-link"></i>
  <i class="far fa-heart"></i>
  </div>
</div>
<div class="spacer-16"></div>
  <img src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="">
  <p class="paragraph-4 margin-b-2x">${post.excerpt.rendered}</p>
  <div class="spacer-32"></div>
  <div class="spacer-16"></div>
  `

  var content = post.blocks;
  // console.log(post.featured_media);

  for (i = 0; i < content.length; i++) {
    document.querySelector('.post-body').innerHTML += content[i].innerHTML;
    
  }

  let ul = document.querySelectorAll('.post-body ul')
  let ol = document.querySelectorAll('.post-body ol')
  let instruction = document.querySelector('.post-body ul')
  let allChildren = instruction.querySelectorAll('li');

  for (let i = 0; i < allChildren.length; i++) {
    if (allChildren[i].childElementCount >= 1) {
      allChildren[i].classList.add('styling');
    }
  }

  ul.forEach(item => item.classList.add('col-sm-12'))
  ul.forEach(item => item.classList.add('col-lg-5'))
  ol.forEach(item => item.classList.add('col-sm-12'));
  ol.forEach(item => item.classList.add('col-lg-6'));
}

// var populateFirstPost = (firstPost) => {
//   const myDate = firstPost.date = new Date()
//   myDate.toISOString().split('T')[0]

//   document.querySelector('.post-header').innerHTML = `
//   <h6>${firstPost._embedded["wp:term"][0][0].name}</h6>
//   <h3>${firstPost.title.rendered}</h3>
//   <div class="spacer-16"></div>
//   <div class="social-media">
//   <p>${formatDate(myDate)}</p>
//   <div>
//   <i class="fas fa-link"></i>
//   <i class="far fa-heart"></i>
//   </div>
// </div>
// <div class="spacer-16"></div>
//   <img src="${firstPost._embedded["wp:featuredmedia"][0].source_url}" alt="">
//   <p class="paragraph-4 margin-b-2x">${firstPost.excerpt.rendered}</p>
//   <div class="spacer-32"></div>
//   <div class="spacer-16"></div>
//   `
//   document.getElementById('post-title').innerText = firstPost.title.rendered;

//   var content = firstPost.blocks;
//   // console.log(post.featured_media);

//   for (i = 0; i < content.length; i++) {
//     document.querySelector('.post-body').innerHTML += content[i].innerHTML;
//   }
// }


var findQuery = (param) => {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

var getPosts = () => {
  fetch('http://printerspage.local/wp-json/wp/v2/posts?_embed')
  // fetch('https://raw.githubusercontent.com/birkkensen/blog-json/main/blog-posts')
  .then(response => response.json())
  .then(data => {
    featuredPost = data[0];
    createFeaturedPost(featuredPost);
    for (let i = 1; i < data.length; i++) {
      createArticle(data[i]);
    }
  })
  .catch((error) => {
    console.log('Error', error);
  })
}

var getPostFromId = () => {
  var id = JSON.parse(findQuery('id'));
  fetch('http://printerspage.local/wp-json/wp/v2/posts?_embed')
  // fetch('https://raw.githubusercontent.com/birkkensen/blog-json/main/blog-posts')
  .then(response => response.json())
  .then(data => {
    featuredPost = data[0]
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        populatePost(data[i])
      } 
       
    }
  })
  .catch((error) => {
    console.log('Error', error);
  })
}

var createFeaturedPost = (post) => {
  const myDate = post.date = new Date()
  myDate.toISOString().split('T')[0]
  var row = document.querySelector('.row');

  row.innerHTML = `
  <div class="col-md-6 col-lg-12">
  <div class="featured-article">
    <a href="./pages/posts.html?${featuredPost.slug}&id=${post.id}">
      <div class="row">
        <div class="col-md-12 col-lg-7">
          <div class="article-image">
            <img src="${featuredPost._embedded["wp:featuredmedia"][0].source_url}" alt="">
          </div>
        </div>
        <div class="col-md-12 col-lg-5">
          <div class="article-body">
            <div class="article-published">${formatDate(myDate)}</div>
            <div class="featured-title">${featuredPost.title.rendered}</div>
            <div class="featured-description">${featuredPost.excerpt.rendered}</div>
          </div>
        </div>
      </div>
    </a>
  </div>
</div>
  `
}

var createArticle = (post) => {
  const myDate = post.date = new Date()
  myDate.toISOString().split('T')[0]

  var row = document.querySelector('.row');

  row.innerHTML += `
  <div class="col-md-6 col-lg-4">
  <div class="article">
    <a href="./pages/posts.html?${post.slug}&id=${post.id}">
      <div class="article-image">
        <img src="${post._embedded["wp:featuredmedia"][0].source_url}" alt="">
      </div>
      <div class="article-body">
        <div class="article-published">${formatDate(myDate)}</div>
        <div class="article-title">${post.title.rendered}</div>
        <div class="article-description">${post.excerpt.rendered}</div>
      </div>
    </a>
  </div>
</div>
  `
//   articleWrapper.innerHTML += `
//   <a href="./pages/posts.html?${post.slug}&id=${post.id}" class="articles-wrapper__article">
//   <div class="articles-wrapper__article__body">
//   <img class="articles-wrapper__article__image" src="${post._embedded["wp:featuredmedia"][0].source_url}"
//     alt="Random">
//     <div class="test">
//     <h6>${formatDate(myDate)}</h6>
//     <br>
//     <h5>${post.title.rendered}</h5>
//     <br>
//     <p>${post.excerpt.rendered}</p>
//     <br>
//     </div>
//   </div>
// </a>`;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
