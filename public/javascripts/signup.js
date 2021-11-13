//signup a new user
const signup = (userFirstName, userLastName, username, password) => {
  console.log('signup');
  const newUser = {
    userFirstName,
    userLastName,
    username,
    password
  };

  fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(newUser),
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
  signup
}

