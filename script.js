const input = document.querySelector('.input');
const moviesList = document.querySelector('.movies');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLauch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const left = document.querySelector('.btn-prev');
const right = document.querySelector('.btn-next');
const linkVideo = document.querySelector('.highlight__video-link');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');
const btnTheme = document.querySelector('.btn-theme');
const body = document.querySelector('body');

btnTheme.addEventListener('click', function () {
  btnTheme.src = btnTheme.getAttribute('src') === './assets/light-mode.svg' ? './assets/dark-mode.svg' : './assets/light-mode.svg';

  const newBgColor = body.style.getPropertyValue('--background-color') === '#242424' ? '#FFF' : '#242424';
  body.style.setProperty('--background-color', newBgColor);

  const newInputBorderColor = body.style.getPropertyValue('--input-border-color') === '#FFF' ? '#979797' : '#FFF';
  body.style.setProperty('--input-border-color', newInputBorderColor);

  const newColor = body.style.getPropertyValue('--color') === '#FFF' ? '#000' : '#FFF';
  body.style.setProperty('--color', newColor);

  const newShadowColor = body.style.getPropertyValue('--shadow-color') === '0px 4px 8px #ffffff26' ? '0px 4px 8px #00000026' : '0px 4px 8px #ffffff26';
  body.style.setProperty('--shadow-color', newShadowColor);

  const newHighlightBgColor = body.style.getPropertyValue('--highlight-background') === '#454545' ? '#FFF' : '#454545';
  body.style.setProperty('--highlight-background', newHighlightBgColor);

  const newHighlightColor = body.style.getPropertyValue('--highlight-color') === '#FFF' ? '#000000b3' : '#FFF';
  body.style.setProperty('--highlight-color', newHighlightColor);

  const newHighlightDescriptionColor = body.style.getPropertyValue('--highlight-description') === '#FFF' ? '#000' : '#FFF';
  body.style.setProperty('--highlight-description', newHighlightDescriptionColor);
});

function colocarFilmes(pagina) {
  moviesList.textContent = '';
  pagina.forEach(function (movie) {
    const posterPath = document.createElement('div');
    posterPath.classList.add('movie');

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');

    const url = 'url(' + movie.poster_path + ')';
    posterPath.style.backgroundImage = url;

    const title = document.createElement('span');
    title.classList.add('movie__title');
    title.textContent = movie.title;

    const voteAverage = document.createElement('span');
    voteAverage.classList.add('movie__rating');
    voteAverage.textContent = movie.vote_average;

    movieInfo.append(title, voteAverage);
    posterPath.append(movieInfo);
    moviesList.append(posterPath);

    posterPath.addEventListener('click', function () {
      modal.classList.remove('hidden');

      fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/' + movie.id + '?language=pt-BR').then(function (response) {
        const promiseBody = response.json();
        promiseBody.then(function (body) {
          modalTitle.textContent = body.title;
          modalImg.src = body.backdrop_path;
          modalDescription.textContent = body.overview;
          modalAverage.textContent = body.vote_average;
          body.genres.forEach(function (genre) {
            const modalGenre = document.createElement('span');
            modalGenre.classList.add('modal__genre');
            modalGenre.textContent = genre.name;
            modalGenres.append(modalGenre);
          });
        });
      });
    });
  });
}

function carrosel(body) {
  section = body.results.slice(0, 5);
  colocarFilmes(section);

  let pagina = 1;

  left.addEventListener('click', () => {
    pagina--;
    if (pagina === 0) {
      pagina = 4;
    }

    if (pagina === 1) {
      section = body.results.slice(0, 5);
    } else if (pagina === 2) {
      section = body.results.slice(5, 10);
    } else if (pagina === 3) {
      section = body.results.slice(10, 15);
    } else {
      section = body.results.slice(15, 20);
    }

    colocarFilmes(section);
  });

  right.addEventListener('click', () => {
    pagina++;
    if (pagina === 5) {
      pagina = 1;
    }

    if (pagina === 1) {
      section = body.results.slice(0, 5);
    } else if (pagina === 2) {
      section = body.results.slice(5, 10);
    } else if (pagina === 3) {
      section = body.results.slice(10, 15);
    } else {
      section = body.results.slice(15, 20);
    }

    colocarFilmes(section);
  });
}

function carrosselOriginal() {
  fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR').then(function (response) {
    const promiseBody = response.json();

    promiseBody.then(function (body) {
      carrosel(body);
    });
  });
}

modalClose.addEventListener('click', function () {
  modal.classList.add('hidden');

  if (!modal.classList.contains('.hidden')) {
    modalGenres.innerHTML = '';
  }
});

modal.addEventListener('click', function (event) {
  modal.classList.add('hidden');

  if (!modal.classList.contains('.hidden')) {
    modalGenres.innerHTML = '';
  }
});

input.addEventListener('keydown', function (event) {
  if (event.key !== 'Enter') {
    return;
  } else if (input.value === '') {
    carrosselOriginal();
    return;
  }

  fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=' + input.value.toLowerCase()).then(function (response) {
    const promiseBody = response.json();

    promiseBody.then(function (body) {
      carrosel(body);
    });
  });

  input.value = "";
});

carrosselOriginal();

function converterData(data) {
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Deembro'];
  const ano = Number(data.slice(0, 4));
  const mes = Number(data.slice(5, 7) - 1);
  const dia = Number(data.slice(8));

  return `${dia} de ${meses[mes]} de ${ano}`
}

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR').then(function (response) {
  const promiseBody = response.json();

  promiseBody.then(function (body) {
    const urlVideoImage = 'url(' + body.backdrop_path + ')';
    highlightVideo.style.backgroundImage = urlVideoImage;
    highlightVideo.style.backgroundPosition = 'center';
    highlightVideo.style.backgroundRepeat = 'no-repeat';
    highlightVideo.style.backgroundSize = 'cover';

    highlightTitle.textContent = body.title;
    highlightRating.textContent = body.vote_average;
    highlightGenres.textContent = body.genres[0].name + ", " + body.genres[1].name + ", " + body.genres[2].name;
    highlightLauch.textContent = converterData(body.release_date);
    highlightDescription.textContent = body.overview;
  });
});

fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR').then(async function (response) {
  const promiseBody = await response.json();

  linkVideo.addEventListener('click', () => {
    console.log(promiseBody.results);
    console.log(promiseBody.results[0].key);
    urlHighlight = "https://www.youtube.com/watch?v=" + promiseBody.results[0].key;
    linkVideo.href = urlHighlight;
  });
});



