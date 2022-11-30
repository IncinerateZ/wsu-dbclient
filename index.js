const domain = 'http://127.0.0.1:3001';

var showPseudo = false;

let allProducts = {};

window.onload = () => {
    let eProducts = document.getElementById('products-container');
    let eProductsPseudo = document.getElementById('products-pseudo');
    let btnTogglePseudo = document.getElementById('products-addbtn');

    eProductsPseudo.className = `${showPseudo ? '' : 'none'}`;

    btnTogglePseudo.onclick = () => {
        showPseudo = !showPseudo;
        eProductsPseudo.className = `${showPseudo ? '' : 'none'}`;

        if (!showPseudo) {
            let cols = ['name', 'description', 'price', 'stock'];
            let q = '?table=product';
            for (let c of cols) {
                let v = document.getElementById(c).value;
                if (('' + v).length === 0) return;
                q += `&${c}=${v}`;
            }
            for (let c of cols) {
                document.getElementById(c).value = '';
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

    document.getElementById('search').onkeyup = (e) => {
        let q = e.target.value;

        if (q === '') return showAllProducts();

        axios.get(`${domain}/get?table=product&name=${q}`).then((res) => {
            showProducts(res.data);
        });
    };

    function showProducts(d) {
        eProducts.innerHTML = '';
        for (let e of d)
            eProducts.innerHTML += `<div style="padding: 5px; display: flex;${
                (e.product_id + 1) % 2 === 0
                    ? 'background-color: rgb(170,170,170);'
                    : ''
            }">
                        <span style="flex:1 1 0px;">${e.product_id}</span>
                        <span style="flex:3 1 0px;">${e.product_name}</span>
                        <span style="flex:5 1 0px;">${
                            e.product_description
                        }</span>
                        <span style="flex:2 1 0px;">$${e.product_price}</span>
                        <span style="flex:1 1 0px;">${e.product_stock}</span>
                    </div>`;
    }

    function showAllProducts() {
        showProducts(allProducts);
    }

    axios(`${domain}/auth`, {
        method: 'get',
        withCredentials: true,
        credentials: 'include',
    }).then((res) => {
        if (res.data.redirect) return (window.location = res.data.redirect);

        axios.get(`${domain}/get?table=product`).then((res) => {
            if (res.data && res.data.length > 0) {
                allProducts = res.data;
                showAllProducts();
            }
        });
    });
};
