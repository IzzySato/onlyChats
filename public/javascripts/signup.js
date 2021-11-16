//signup a new user
const signup = (name, email, password) => {
  const newUser = {
    name,
    email,
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

