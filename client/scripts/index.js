// index.js

import '../styles/index.css';

window.onload = () => {
  const handleSubmit = async function (e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const url = `/${formData.get('action')}`;
    if (formData.get('email').trim() === '' || formData.get('password').trim() === '') {
      alert('please fill in all fields');
      return;
    }

    fetch(url, {
      method: 'post',
      redirect: 'follow',
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => {
      if (resp.redirected) window.location.href = resp.url;
    });
  };

  const multiAuthForm = document.querySelector('#multiAuth form');

  multiAuthForm.addEventListener('submit', handleSubmit);
};
