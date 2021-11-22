
const addFriend = ( friendName, friendEmail ) => {
  const friend = {
    friendName,
    friendEmail
  };

  fetch('/addFriend', {
      method: 'POST',
      body: JSON.stringify(friend),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(res => res.json())
    .then(({url}) => location.href = url);
};


export {
  addFriend
}