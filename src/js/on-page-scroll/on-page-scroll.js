const headerRef = document.querySelector('header.header');

let previousPosition = 0;

export const onPageScroll = () => {
  if (previousPosition < window.scrollY - 50 && window.scrollY > 80) headerRef.classList.add('is-hidden');
  if (previousPosition > window.scrollY + 200 || window.scrollY < 80) headerRef.classList.remove('is-hidden');

  previousPosition = window.scrollY;
};
