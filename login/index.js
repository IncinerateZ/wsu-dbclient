let states = {};

function setState(key, value) {
    states[key] = value;
}

function getState(key) {
    return states[key];
}

window.onload = () => {
    axios('http://127.0.0.1:3001/auth', {
        method: 'get',
        withCredentials: true,
        credentials: 'include',
    }).then((res) => {
        if (res.data.message) window.location = '/';
    });

    document.getElementById('email').onkeyup = (e) => {
        setState('email', e.target.value);
    };

    document.getElementById('password').onkeyup = (e) => {
        setState('password', e.target.value);
    };

    let error_out = document.getElementById('error_out');

    document.getElementById('submitbtn').onclick = () => {
        error_out.innerText = '';
        axios(
            `http://127.0.0.1:3001/auth?email=${getState(
                'email',
            )}&password=${getState('password')}`,
            {
                method: 'get',
                withCredentials: true,
                credentials: 'include',
            },
        ).then((res) => {
            if (res.data.redirect) window.location = res.data.redirect;
            if (res.data.error) error_out.innerText = res.data.error;
        });
    };
};
