const links = document.getElementsByClassName('link');

for (let link of links) {
  link.addEventListener('click', () => {
    window.open(link.children[0].href, '_blank');
  });
}
