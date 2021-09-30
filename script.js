let featuredPost = []
let posts = []

// let options = {
//   threshold: 0.2
// }

// let observer = new IntersectionObserver(function (entries) {
//   for (let i = 0; i < entries.length; i++) {
//     if (entries[i].isIntersecting) {
//       entries[i].target.classList.add('been-in-view');
//      } 
//   }
// }, options);

// function startObserver() {
//  let target = document.querySelectorAll('.article-wrapper');
//   for (let i = 0; i < target.length; i++) {
//    observer.observe(target[i]);
//   }
// }

var populatePost = (post) => {
  const myDate = post.date;
  document.querySelector('.post-header').innerHTML = `
  <p class="post-header__category">${post.category}</p>
  <h3 class="post-header__title">${post.title}</h3>
  <div class="post-header__social-media">
  <p class="published">Published: ${formatDate(myDate)}</p>
      <div>
        <i class="fas fa-link"></i>
        <i class="far fa-heart"></i>
     </div>
    </div>
  </div>
  <img class="post-header__image" src="${post.image}" alt="">
  
  <div class="post-header__summary">${post.summary}</div>
  `

  var content = post.content;
  
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

  ul.forEach(item => item.classList.add('un-ordered-list'))
  // ul.forEach(item => item.classList.add('col-lg-5'))
  ol.forEach(item => item.classList.add('ordered-list'));
  // ol.forEach(item => item.classList.add('col-lg-6'));
}

var filterPost = () => {
  document.querySelector('.flex-row').innerHTML = ''
  let input = document.querySelector('.filter__input');
  let txtValue;
  let articleTitle;
  let filter = input.value.toUpperCase();

  for (i = 0; i < posts.length; i++) {
    articleTitle = posts[i].title.rendered;
    txtValue = articleTitle;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      if (filter === '') {
        createFeaturedPost(formatPosts(featuredPost))
        for (i = 1; i < posts.length; i++) {
          createArticle(formatPosts(posts[i]))
        } 
      } else {
        createArticle(formatPosts(posts[i]))
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
    for (i = 1; i < data.length; i++) {
      createCategorieButtons(data[i])
    }
  })
  .catch((error) => {
    console.log('Error', error);
  })
}


var createCategorieButtons = (data) => {
  container = document.querySelector('.filter__categories');
  container.innerHTML += `<button class="category-btn" onclick="filterCategories('${data.id}'), myFunction(event)">${data.name}</button>`
}

var filterCategories = (filter) => {
  document.getElementById('row').innerHTML = '';
  for (i = 0; i < posts.length; i++) {
    if (filter === '1') {
      createFeaturedPost(formatPosts(posts[0]))
      for (i = 1; i < posts.length; i++) {
        createArticle(formatPosts(posts[i]))
      } 
    } else if(posts[i].categories == filter) {
      createArticle(formatPosts(posts[i]))
    } 
  }
}
function myFunction(e) {
  var elems = document.querySelectorAll(".active");
  [].forEach.call(elems, function(el) {
    el.classList.remove("active");
  });
  e.target.className = "active";
}

var getPosts = () => {
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
  .then(() => {
    getCategories()
  })
  .then(() => {
    // startObserver()
    console.log('So far so good')
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
        populatePost(formatPosts(data[i]))
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
    category: (post._embedded && post._embedded['wp:term']) ? post._embedded['wp:term'][0][0].name : 'Undefined',
    categoryId: (post.categories) ? post.categories : 'Undefined',
    image: (post._embedded && post._embedded['wp:featuredmedia']) ? 
    post._embedded["wp:featuredmedia"][0].source_url : '../images/donut_render.png',
    summary: (post.excerpt) ? post.excerpt.rendered : 'No excerpt',
    content: (post.content) ? post.content.rendered : 'No content has be writtten'
  }
  return formated;
}


var createFeaturedPost = (post) => {
  const myDate = post.date 
  var row = document.querySelector('.flex-row');
  row.innerHTML = `
  <div class="article-wrapper featured-wrapper">
  <div class="article featured-article">
    <a class="article-anchor" href="./pages/posts.html?${post.slug}&id=${post.id}">
      <div class="flex-row">
          <div class="article-image featured-image">
          <img src="${post.image}" alt="">
        </div>
          <div class="article-body featured-body">
            <p class="article-published">${formatDate(myDate)}</p>
            <h2 class="article-title featured-title">${post.title}</h2>
            <div class="featured-description">${post.summary}</div>
        </div>
      </div>
    </a>
  </div>
</div>
  `
}

var createArticle = (post) => {
  const myDate = post.date
  var row = document.querySelector('.flex-row');
  row.innerHTML += `
  <div class="article-wrapper">
  <div class="article">
    <a class="article-anchor" href="./pages/posts.html?${post.slug}&id=${post.id}">
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
