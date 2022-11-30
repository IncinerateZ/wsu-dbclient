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
            let cols = ['product_id', 'employee_id', 'supplier_id', 'kg'];
            let q = '?table=restock';
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

        let data = {};
        let done = 0;

        ['product', 'employee', 'supplier', 'restock', 'supply'].forEach(
            (e) => {
                done++;
                axios.get(`${domain}/get?table=${e}`).then((res) => {
                    data[e] = {};
                    for (let d of res.data) data[e][d[`${e}_id`]] = d;
                    done--;
                });
            },
        );

        let int = setInterval(() => {
            if (done !== 0) return;
            clearInterval(int);

            let res = ``;

            for (let k = 1; k <= Object.keys(data.restock).length; k++) {
                let e = data.restock[k];
                res += `<div style="padding: 5px; display: flex;${
                    (e.product_id + 1) % 2 === 0
                        ? 'background-color: rgb(170,170,170);'
                        : ''
                }">
                    <span style="flex:1 1 0px;">${e.restock_id}</span>
                    <span style="flex:1 1 0px;">${
                        data.product[e.product_id].product_name
                    }</span>
                    <span style="flex:1 1 0px;">${
                        data.employee[e.employee_id].employee_firstname
                    }</span>
                    <span style="flex:1 1 0px;">${
                        data.supplier[e.supplier_id].supplier_name
                    }</span>
                    <span style="flex:1 1 0px;">${e.restock_kg}</span>
                    <span style="flex:1 1 0px;">${e.restock_date}</span>
                </div>`;
            }

            for (let k = 1; k <= Object.keys(data.supply).length; k++) {
                let e = data.supply[k];
                document.getElementById(
                    'supplies-container',
                ).innerHTML += `<div style="padding: 5px; display: flex;${
                    (e.supply_id + 1) % 2 === 0
                        ? 'background-color: rgb(170,170,170);'
                        : ''
                }">
                        <span style="flex:1 1 0px;">${e.supply_id}</span>
                        <span style="flex:1 1 0px;">${
                            data.product[e.product_id].product_name
                        }</span>
                        <span style="flex:1 1 0px;">${
                            data.supplier[e.supplier_id].supplier_name
                        }</span>
                        <span style="flex:1 1 0px;">${e.supply_kg}</span>
                        <span style="flex:1 1 0px;">$${e.supply_cost}</span>
                    </div>`;
            }

            for (let k = 1; k <= Object.keys(data.supplier).length; k++) {
                let e = data.supplier[k];
                console.log(e);
                document.getElementById(
                    'supplier-container',
                ).innerHTML += `<div style="padding: 5px; display: flex;${
                    (e.supplier_id + 1) % 2 === 0
                        ? 'background-color: rgb(170,170,170);'
                        : ''
                }">
                        <span style="flex:1 1 0px;">${e.supplier_id}</span>
                        <span style="flex:1 1 0px;">${e.supplier_name}</span>
                        <span style="flex:1 1 0px;">${e.supplier_address}</span>
                        <span style="flex:1 1 0px;">${
                            e.supplier_phonenum
                        }</span>
                        <span style="flex:1 1 0px;">${
                            e.supplier_isActive ? 'yes' : 'no'
                        }</span>
                    </div>`;
            }

            eProducts.innerHTML = res;
        }, 0);
    });
};
