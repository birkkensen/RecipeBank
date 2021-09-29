let featuredPost = []
let posts = []


var populatePost = (post) => {
  const myDate = post.date;
  document.querySelector('.post-header').innerHTML = `
  <h6>${post._embedded["wp:term"][0][1].name}</h6>
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

  var content = post.content.rendered;
  
  document.querySelector('.post-body').innerHTML = content;
  

  let ul = document.querySelectorAll('.post-body ul')
  let ol = document.querySelectorAll('.post-body ol')


  let instruction = document.querySelector('.post-body ul')
  let allChildren = instruction.querySelectorAll('li');

  for (let i = 0; i < allChildren.length; i++) {
    if (allChildren[i].firstChild.localName === "strong" ) {
      allChildren[i].classList.add('styling');
    }
  }

  ul.forEach(item => item.classList.add('col-sm-12'))
  ul.forEach(item => item.classList.add('col-lg-5'))
  ol.forEach(item => item.classList.add('col-sm-12'));
  ol.forEach(item => item.classList.add('col-lg-6'));
}

var filterPost = () => {
  document.querySelector('.row').innerHTML = ''
  let input = document.querySelector('.filter__input');
  let txtValue;
  let articleTitle;
  let filter = input.value.toUpperCase();

  for (i = 0; i < posts.length; i++) {
    articleTitle = posts[i].title.rendered;
    txtValue = articleTitle;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      if (filter === '') {
        createFeaturedPost(featuredPost)
        for (i = 1; i < posts.length; i++) {
          createArticle(posts[i])
        } 
      } else {
        createArticle(posts[i])
      }
    }
  }
}


var findQuery = (param) => {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

var getCategories = () => {
  fetch('http://birk.josefcarlsson.com/wp-json/wp/v2/categories')
  .then(response => response.json())
  .then(data => {
    
    for (i = 0; i < data.length; i++) {
      createCategories(data[i])
      // console.log(data[i])
    }
  })
  .catch((error) => {
    console.log('Error', error);
  })
}

var createCategories = (data) => {
  container = document.querySelector('.filter__categories');
  container.innerHTML += `<a href="?id=${data.id}">${data.name}</a>`
}

var getPosts = () => {
  getCategories()
  fetch('http://birk.josefcarlsson.com/wp-json/wp/v2/posts?_embed')
  .then(response => response.json())
  .then(data => {
    featuredPost = data[0];
    posts = data
    createFeaturedPost(formatPosts(data[0]));
    for (let i = 1; i < data.length; i++) {
      createArticle(formatPosts(data[i]));
      
    }
  })
  .catch((error) => {
    console.log('Error', error);
  })
}

var getPostFromId = () => {
  var id = JSON.parse(findQuery('id'));
  fetch('http://birk.josefcarlsson.com/wp-json/wp/v2/posts?_embed')
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

var formatPosts = (post) => {
  let formated = {
    title: (post.title) ? post.title.rendered : 'No title',
    id: (post.id) ? post.id : 'No id',
    date: (post.date) ? post.date : 'No date',
    slug: (post.slug) ? post.slug : 'No slug',
    image: (post._embedded && post._embedded["wp:featuredmedia"]) ? 
    post._embedded["wp:featuredmedia"][0].source_url : '../images/donut_render.png',
    summary: (post.excerpt) ? post.excerpt.rendered : 'No excerpt',
    content: (post.content) ? post.content.rendered : 'No content has be writtten'
  }
  return formated;
}


var createFeaturedPost = (post) => {
  const myDate = post.date 
  var row = document.querySelector('.row');
  row.innerHTML = `
  <div class="col-md-6 col-lg-12">
  <div class="featured-article">
    <a href="./pages/posts.html?${post.slug}&id=${post.id}">
      <div class="row">
        <div class="col-md-12 col-lg-7">
          <div class="article-image">
            <img src="${post.image}" alt="">
          </div>
        </div>
        <div class="col-md-12 col-lg-5">
          <div class="article-body">
            <p class="article-published">${formatDate(myDate)}</p>
            <h2 class="article-title featured">${post.title}</h2>
            <div class="featured-description">${post.summary}</div>
          </div>
        </div>
      </div>
    </a>
  </div>
</div>
  `
}

var createArticle = (post) => {
  const myDate = post.date
  var row = document.querySelector('.row');
  row.innerHTML += `
  <div class="col-md-6 col-lg-4">
  <div class="article">
    <a href="./pages/posts.html?${post.slug}&id=${post.id}">
      <div class="article-image">
        <img src="${post.image}" alt="">
      </div>
      <div class="article-body">
        <p class="article-published">${formatDate(myDate)}</p>
        <h2 class="article-title">${post.title}</h2>
        <div class="article-description">${post.summary}</div>
      </div>
    </a>
  </div>
</div>
  `
}

var formatDate = (date) => {
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
