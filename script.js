document.addEventListener('DOMContentLoaded', () => {
  fetch('https://chess-online.onrender.com');

  const links = document.getElementsByClassName('my-link');

  for (let link of links) {
    const path = link.getAttribute('data-href');

    link.addEventListener('click', () => window.open(`/${path}/index.html`));
  }
});
