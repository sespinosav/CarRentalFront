document.addEventListener('DOMContentLoaded', function() {
    const brand = document.getElementById('brand');
    const model = document.getElementById('model');
    const comercialValue = document.getElementById('comercialValue');
    const dialyValue = document.getElementById('dialyValue');
    const allow = document.getElementById('allow');
    const table = document.getElementById('table');
    const alert = document.getElementById('alert');
    const btn = document.getElementById('add');

    const modalBrand = document.getElementById('modal-brand');
    const modalModel = document.getElementById('modal-model');
    const modalComercialValue = document.getElementById('modal-comercialValue');
    const modalDialyValue = document.getElementById('modal-dialyValue');
    const modalAllow = document.getElementById('modal-allow');
    const modalAlert = document.getElementById('modal-alert');

    let idModal = 0;
    let pkModal = 0;

    const modalBtn = document.getElementById('modal-btn');

    let pk = 0;

    const url = 'http://35.173.238.210/api/carRental/';
    const token = "Token  YourToken";

    function httpPost(theUrl, data) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("POST", theUrl, false); // false for synchronous request
        xmlHttp.setRequestHeader("Authorization", token)
        xmlHttp.send(data);
        return xmlHttp.responseText;
    }

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.setRequestHeader("Authorization", token)
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    function httpPut(theUrl, data, pk) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("PUT", theUrl + pk, false); // false for synchronous request
        xmlHttp.setRequestHeader("Authorization", token)
        xmlHttp.send(data);
        return xmlHttp.responseText;
    }

    function httpDelete(theUrl, pk) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("DELETE", theUrl + pk, false); // false for synchronous request
        xmlHttp.setRequestHeader("Authorization", token)
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }


    function getCars() {
        const cars = eval(httpGet(url));
        for (const car in cars) {
            data = cars[car];

            if (data.allow) contentAllow = "YES"
            else contentAllow = "NO"

            const row = table.insertRow();
            row.setAttribute('id', pk++);
            const id = data.id
            row.innerHTML = `
            <td>${id}</td>
            <td>${data.brand}</td>
            <td>${data.model}</td>
            <td>${data.comercialValue}</td>
            <td>${data.dialyValue}</td>
            <td>${contentAllow}</td>
            <td class="text-right">
            </td>
            `;

            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-primary', 'mb-1', 'mr-2');
            editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
            editBtn.setAttribute('data-toggle', 'modal');
            editBtn.setAttribute('data-target', '#modal');
            editBtn.onclick = function() {
                idModal = row.getAttribute('id');
                pkModal = id
                $('#modal').modal('toggle');
            }
            row.children[6].appendChild(editBtn);

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
            removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
            removeBtn.onclick = function() {
                httpDelete(url, id);
                removeTodo(row.getAttribute('id'));
            }
            row.children[6].appendChild(removeBtn);
        }
    }

    getCars();

    function adToDoc() {

        if (allow.checked) contentAllow = "YES";
        else contentAllow = "NO";

        if (brand.value === '' || model.value === '' || comercialValue.value === '' || dialyValue.value === '') {
            alert.classList.remove('d-none');
            alert.innerText = 'Brand, model, comercial value and dialy value is required';
            return;
        }
        alert.classList.add('d-none');

        var formData = new FormData();

        formData.append("brand", brand.value);
        formData.append("model", model.value);
        formData.append("comercialValue", comercialValue.value);
        formData.append("dialyValue", dialyValue.value);
        formData.append("allow", allow.checked);


        var data = httpPost(url, formData);
        const id = data.split(":")[1].split(",")[0];

        const row = table.insertRow();
        row.setAttribute('id', pk++);
        row.innerHTML = `
        <td>${id}</td>
        <td>${brand.value}</td>
        <td>${model.value}</td>
        <td>${comercialValue.value}</td>
        <td>${dialyValue.value}</td>
        <td>${contentAllow}</td>
        <td class="text-right">
        </td>
        `;

        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-primary', 'mb-1', 'mr-2');
        editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
        editBtn.setAttribute('data-toggle', 'modal');
        editBtn.setAttribute('data-target', '#modal');
        editBtn.onclick = function() {
            idModal = row.getAttribute('id');
            pkModal = id
            $('#modal').modal('toggle');
        }
        row.children[6].appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
        removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
        removeBtn.onclick = function() {
            httpDelete(url, id);
            removeTodo(row.getAttribute('id'));
        }
        row.children[6].appendChild(removeBtn);
    }

    function removeTodo(id) {
        document.getElementById(id).remove();
    }

    btn.onclick = adToDoc;

    modalBtn.onclick = function() {
        if (modalBrand.value === '' || modalModel.value === '' ||
            modalComercialValue.value === '' || modalDialyValue.value === '') {
            modalAlert.classList.remove('d-none');
            modalAlert.innerText = 'Brand, model, comercial value and dialy value is required';
            return;
        }
        modalAlert.classList.add('d-none');

        var formData = new FormData();

        formData.append("brand", modalBrand.value);
        formData.append("model", modalModel.value);
        formData.append("comercialValue", modalComercialValue.value);
        formData.append("dialyValue", modalDialyValue.value);
        formData.append("allow", modalAllow.checked);

        httpPut(url, formData, pkModal);

        if (modalAllow.checked) modalContentAllow = "YES";
        else modalContentAllow = "NO";

        document.getElementById(idModal).innerHTML = `
        <td>${pkModal}</td>
        <td>${modalBrand.value}</td>
        <td>${modalModel.value}</td>
        <td>${modalComercialValue.value}</td>
        <td>${modalDialyValue.value}</td>
        <td>${modalContentAllow}</td>
        <td class="text-right">
        </td>
        `;

        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-primary', 'mb-1', 'mr-2');
        editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
        editBtn.setAttribute('data-toggle', 'modal');
        editBtn.setAttribute('data-target', '#modal');
        editBtn.onclick = function() {
            idModal = row.getAttribute('id');
            pkModal = id
            $('#modal').modal('toggle');
        }
        document.getElementById(idModal).children[6].appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('btn', 'btn-danger', 'mb-1', 'ml-1');
        removeBtn.innerHTML = '<i class="fa fa-trash"></i>';
        removeBtn.onclick = function() {
            httpDelete(url, id);
            removeTodo(row.getAttribute('id'));
        }
        document.getElementById(idModal).children[6].appendChild(removeBtn);
        $('#modal').modal('toggle');
    }
});
