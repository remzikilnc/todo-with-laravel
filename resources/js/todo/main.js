document.addEventListener("DOMContentLoaded", function () {
    const listTodoBlockDOM = document.getElementById("list-todo-block");
    const createTodoBlockDOM = document.getElementById("cr-todo-block");
    const updateTodoBlockDOM = document.getElementById("modify-todo-block");
    const statusBag = document.getElementById('status-bag')

    //if click to the create button (during the listing)
    const todoAddButton = document.querySelector('.todo-add-btn');
    todoAddButton.addEventListener("click", (clickEvent) => toggleOpacity(listTodoBlockDOM, createTodoBlockDOM, clickEvent, 0.2));

    //if click to close button (during the creating)
    const todoCreateCloseBtnDOM = document.querySelector('.todo-cr-close');
    todoCreateCloseBtnDOM.addEventListener("click", (clickEvent) => toggleOpacity(createTodoBlockDOM, listTodoBlockDOM, clickEvent));

    //if click to create button (in the list.)
    document.querySelector('.todo-cr-button').addEventListener("click", function () {
        toggleCreate()
    });

    //if click to delete button (in the list)
    document.querySelectorAll(".del-todo").forEach(delTodoBtnDOM => delTodoBtnDOM.addEventListener('click', () => {
        deleteTodo(delTodoBtnDOM)
    }));

    //if click to modify button (in the list)
    document.querySelectorAll(".modify-todo").forEach((updtTodoBtnDOM) => updtTodoBtnDOM.addEventListener('click', (clickEvent) => {
        toggleModify(updtTodoBtnDOM,clickEvent)
    }));

    function toggleCreate(){
        const todoText = document.getElementsByName('todo-cr-text')[0].value;
        const todoStatus = document.getElementsByName('todo-cr-status')[0].value;

        fetch(todoAddButton.getAttribute('data-url'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                "_token": document.getElementById("csrf-token-field").getAttribute('value'),
                "todoText": todoText,
                "todoStatus": todoStatus,
            })
        })
            .then(response => response.json())
            .then(response => {
                if (response['status'] === 201) {
                    createTodo(response['updateUrl'], response['deleteUrl'], todoStatus, todoText);
                    updateStatusBag(0, response['message'])
                } else updateStatusBag(1, response['message'])
            })
    }

    function createTodo(updateURL, deleteURL, todoStatus, todoText) {
        const newTodo = document.createElement('tr')
        newTodo.classList.add('table-content')
        //new TO-DO text value
        const newTodoText = document.createElement('td');
        newTodoText.innerText = todoText;
        //new TO-DO status value
        changeStatus(todoStatus, newTodoText);
        //create new To-Do buttons
        const newTodoButtons = document.createElement('td');
        const newTodoDeleteBtn = document.createElement('button');
        const newTodoUpdtBtn = document.createElement('button');

        newTodoDeleteBtn.setAttribute('data-delete', deleteURL) //set update uri
        newTodoDeleteBtn.innerText = 'Delete';
        newTodoDeleteBtn.classList.add('btn', 'btn-danger', 'del-todo');

        newTodoUpdtBtn.innerText = 'Modify';
        newTodoUpdtBtn.classList.add('btn', 'btn-primary');
        newTodoUpdtBtn.setAttribute('data-update', updateURL) //set delete uri

        newTodoButtons.classList.add('d-flex', 'justify-content-between')
        newTodoButtons.appendChild(newTodoDeleteBtn)
        newTodoButtons.appendChild(newTodoUpdtBtn)

        //new to do delete
        newTodoDeleteBtn.addEventListener('click', event => {
            deleteTodo(newTodoDeleteBtn)
        });
        //new to do update
        const updateCancelBtnDOM = document.querySelector(".update-cancel-btn");
        newTodoUpdtBtn.addEventListener('click', clickEvent => {
            toggleModify(newTodoUpdtBtn,clickEvent);
        });
        //add new To-Do to table
        newTodo.appendChild(newTodoText)
        newTodo.appendChild(newTodoButtons)
        document.querySelector('#list-todo-block .todo_list_table tbody').appendChild(newTodo)
    }

    function toggleModify(updtTodoBtnDOM,clickEvent){
        toggleOpacity(listTodoBlockDOM, updateTodoBlockDOM, clickEvent, 0.2);
        //get data from old data
        const todoOldTable = updtTodoBtnDOM.parentNode.parentNode;
        const todoOldTextDOM = todoOldTable.children[0];
        const todoUpdateStatus = document.getElementsByName('todo-update-status')[0];
        document.getElementsByName('todo-update-text')[0].value = todoOldTextDOM.innerText;
        todoUpdateStatus.checked = todoOldTextDOM.getAttribute('data-status').trim() == "1" ? true : false
        const updateSubmitBtnDOM = document.getElementById("update-submit-btn");

        //if cancel (during the modifying)
        const updateCancelBtnDOM = document.querySelector(".update-cancel-btn");

        const cancelListener = function (e) {
            toggleOpacity(updateTodoBlockDOM, listTodoBlockDOM, clickEvent);
            updateSubmitBtnDOM.removeEventListener('click', updateListener, false)
            updateCancelBtnDOM.removeEventListener('click', cancelListener, false)
        }
        updateCancelBtnDOM.addEventListener("click", cancelListener);
        //if save (during the modifying)
        const updateListener = function (e) {
            updateTodo(todoOldTable);
        }
        updateSubmitBtnDOM.addEventListener("click", updateListener);
    }

    function updateTodo(todoOldTable) {
        const todoUpdateTextDOM = document.getElementsByName('todo-update-text')[0];
        const todoUpdateStatus = document.getElementsByName('todo-update-status')[0].checked;
        const url = todoOldTable.children[1].children[1].getAttribute('data-update');
        //POST
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "_token": document.getElementById("csrf-token-field").getAttribute('value'),
                "todoText": todoUpdateTextDOM.value,
                "todoStatus": todoUpdateStatus,
            })
        })
            .then(response => response.json())
            .then((response) => {
                if (response['status'] === 201) {
                    updateStatusBag(0, response['message'])
                    todoOldTable.children[0].innerText = todoUpdateTextDOM.value;
                    todoUpdateStatus ? changeStatus(1, todoOldTable.children[0]) : changeStatus(0, todoOldTable.children[0])
                } else updateStatusBag(1, response['message'])

            })
    }

    function deleteTodo(delTodoBtnDOM){
        delTodoBtnDOM.parentNode.parentNode.remove();
        const delURL = delTodoBtnDOM.getAttribute('data-delete')
        fetch(delURL, {method: 'GET'})
            .then(response => response)
    }

    function toggleOpacity(hiddenDOM = null, visibleDOM = null, clickEvent = null, opacity = 0) {
        if (clickEvent) clickEvent.preventDefault()
        if (opacity < 1 && opacity > 0) {
            if (hiddenDOM) hiddenDOM.style.opacity = opacity.toString();
            if (visibleDOM) visibleDOM.setAttribute('style', 'opacity:1; visibility:visible');
        } else {
            if (hiddenDOM) hiddenDOM.setAttribute('style', 'opacity:0; visibility:hidden');
            if (visibleDOM) visibleDOM.setAttribute('style', 'opacity:1; visibility:visible');
        }
    }

    function changeStatus(status, textElement) {
        status = status.toString();
        if (status === '1') {
            textElement.classList.add('text-success');
            textElement.classList.remove('text-danger');
            textElement.setAttribute('data-status', '1');
        } else if (status === '0') {
            textElement.classList.add('text-danger');
            textElement.classList.remove('text-success');
            textElement.setAttribute('data-status', '0');
        }
    }

    function updateStatusBag(hasError, responseText = null) {
        toggleOpacity(null, statusBag)
        setTimeout(() => toggleOpacity(statusBag), 2000)
        if (hasError === 0) {
            statusBag.classList.remove('alert-danger');
            statusBag.classList.add('alert-success');
            responseText ? statusBag.innerText = responseText : statusBag.innerText = 'Success..'
        } else {
            statusBag.classList.remove('alert-success');
            statusBag.classList.add('alert-danger');
            responseText ? statusBag.innerText = responseText : statusBag.innerText = 'Something went wrong..'
        }
    }

});

