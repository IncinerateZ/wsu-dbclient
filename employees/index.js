const domain = 'http://127.0.0.1:3001';

var showPseudo = false;

window.onload = () => {
    let eProducts = document.getElementById('products-container');
    let eProductsPseudo = document.getElementById('products-pseudo');
    let btnTogglePseudo = document.getElementById('products-addbtn');

    eProductsPseudo.className = `${showPseudo ? '' : 'none'}`;
    // document.getElementById('employee_isAdmin').value = false;

    btnTogglePseudo.onclick = () => {
        showPseudo = !showPseudo;
        eProductsPseudo.className = `${showPseudo ? '' : 'none'}`;

        if (!showPseudo) {
            let cols = [
                'firstname',
                'lastname',
                'address',
                'email',
                'password',
                'isAdmin',
            ];
            let q = '?table=employee';
            for (let c of cols) {
                let v =
                    document.getElementById(c).getAttribute('type') ===
                    'checkbox'
                        ? document.getElementById(c).checked
                        : document.getElementById(c).value;
                // if (
                //     document.getElementById(c).getAttribute('type') ===
                //     'checkbox'
                // )
                //     v = v ? 1 : 0;
                if (('' + v).length === 0) return;
                q += `&${c}=${v}`;
            }
            for (let c of cols) {
                if (
                    document.getElementById(c).getAttribute('type') ===
                    'checkbox'
                )
                    document.getElementById(c).checked = false;
                else document.getElementById(c).value = '';
            }
            axios.get(`${domain}/add${q}`).then((res) => {
                document.getElementById('add-out').innerText =
                    res.data.message || res.data.error;
                if (res.data.message)
                    setTimeout(() => {
                        window.location = window.location;
                    }, 0);
            });
        }
    };

    axios(`${domain}/auth`, {
        method: 'get',
        withCredentials: true,
        credentials: 'include',
    }).then((res) => {
        if (res.data.redirect) return (window.location = res.data.redirect);

        axios.get(`${domain}/get?table=employee`).then((res) => {
            if (res.data && res.data.length > 0) {
                for (let e of res.data)
                    eProducts.innerHTML += `<div style="padding: 5px; display: flex;${
                        (e.employee_id + 1) % 2 === 0
                            ? 'background-color: rgb(170,170,170);'
                            : ''
                    }">
                        <span style="flex:1 1 0px;">${e.employee_id}</span>
                        <span style="flex:1 1 0px;">${
                            e.employee_firstname
                        }</span>
                        <span style="flex:1 1 0px;">${
                            e.employee_lastname
                        }</span>
                        <span style="flex:2 1 0px;">${e.employee_address}</span>
                        <span style="flex:2 1 0px;">${e.employee_email}</span>
                        <span style="flex:1 1 0px;">${
                            e.employee_password
                        }</span>
                        <span style="flex:1 1 0px;">${
                            e.employee_joindate
                        }</span>
                        <span style="flex:1 1 0px; text-align:center;">${
                            e.employee_isAdmin ? 'yes' : 'no'
                        }</span>
                    </div>`;
            }
        });
    });
};
