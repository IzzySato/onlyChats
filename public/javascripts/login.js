const login = (username, password) => {
  const user = {
    username,
    password
  };

  fetch('/', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(res => res.json())
    .then(({
      url
    }) => location.href = url);
};

export {
  login
}