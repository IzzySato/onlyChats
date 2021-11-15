const displayToggle = (htmlID) => {
  if (htmlID.classList.contains('show')) htmlID.classList.remove('show');
  else htmlID.classList.add('show');
};

export {
  displayToggle
};